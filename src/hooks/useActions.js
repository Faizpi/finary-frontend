import { useCallback } from 'react'
import api, {
  assessmentApi,
  budgetApi,
  forumApi,
  recommendationApi,
  transactionApi,
} from '../lib/api'
import { getCurrentMonth } from '../constants'
import { splitCsv } from '../lib/helpers'

/**
 * All form-submission handlers and side-effect actions.
 * Uses targeted refresh helpers (financial / insights / forum) instead of
 * a blanket refreshAll to avoid wasted requests and ML hits.
 */
export function useActions({
  assessment,
  assessmentForm,
  budgetForm, setBudgetForm,
  forumForm, setForumForm,
  forumReplyForms, setForumReplyForms,
  loanUpdateValue,
  emergencyUpdateValue,
  pocketOptions,
  recommendForm,
  selectedPocketCategory,
  setEmergencyUpdate,
  setLoanUpdate,
  setMlClassifyResult,
  setMlLoading,
  setMlSideHustleResult,
  setRecommendations,
  setRecommendationSource,
  setShowOnboarding,
  setTransactionForm,
  transactionForm,
  refreshAll,
  refreshFinancial,
  refreshInsights,
  refreshForum,
  setLoading,
  setError,
  setMessage,
  setActiveTab,
  t,
}) {
  /**
   * Wraps a mutation and refreshes only the slices the caller cares about.
   * `refreshFn` defaults to refreshFinancial — the cheapest sensible refresh.
   */
  const guardedAction = useCallback(async (fn, successMessage, refreshFn = refreshFinancial) => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await fn()
      if (refreshFn) await refreshFn()
      if (successMessage) {
        setMessage(successMessage)
      }
    } catch (err) {
      if (err?.response?.status === 422) {
        const validationErrors = err.response.data?.errors
        if (validationErrors) {
          setError(Object.values(validationErrors).flat().join(' '))
        } else {
          setError(err.response.data?.message || t('Validasi gagal. Periksa input Anda.', 'Validation failed. Please check your input.'))
        }
      } else if (err?.response?.status === 429) {
        setError(t('Terlalu banyak request. Tunggu sebentar lalu coba lagi.', 'Too many requests. Please wait a moment and try again.'))
      } else {
        setError(err?.response?.data?.message || t('Proses gagal, coba lagi.', 'Action failed, please try again.'))
      }
    } finally {
      setLoading(false)
    }
  }, [refreshFinancial, setLoading, setError, setMessage, t])

  const handleTransactionSubmit = async (event) => {
    event.preventDefault()

    if (pocketOptions.length === 0) {
      setError(t('Buat kantong budget dulu sebelum menambah transaksi.', 'Create a budget pocket first before adding transactions.'))
      setMessage('')
      return
    }

    await guardedAction(async () => {
      await transactionApi.create({
        ...transactionForm,
        category: selectedPocketCategory,
        amount: Number(transactionForm.amount),
      })

      setTransactionForm((prev) => ({ ...prev, amount: '', note: '' }))
    }, t('Transaksi baru sudah ditambahkan.', 'New transaction added.'))
  }

  const handleDeleteTransaction = async (id) => {
    await guardedAction(() => transactionApi.remove(id), t('Transaksi berhasil dihapus.', 'Transaction deleted successfully.'))
  }

  const handleBudgetSubmit = async (event) => {
    event.preventDefault()

    await guardedAction(async () => {
      await budgetApi.create({
        ...budgetForm,
        monthly_limit: Number(budgetForm.monthly_limit),
      })

      setBudgetForm((prev) => ({ ...prev, monthly_limit: '' }))
    }, t('Budget tersimpan.', 'Budget saved.'))
  }

  const handleLoanUpdateSubmit = async (event) => {
    event.preventDefault()

    if (!assessment) {
      setError(t('Lengkapi assessment dulu sebelum memperbarui cicilan.', 'Complete the assessment before updating loan installments.'))
      setMessage('')
      return
    }

    await guardedAction(async () => {
      await assessmentApi.patchLatest({ loan_payment: Number(loanUpdateValue || 0) })
      setLoanUpdate(null)
    }, t('Cicilan hutang diperbarui.', 'Loan installment updated.'), async () => {
      // After patch we need both fresh financial state and fresh insights/prediction
      await Promise.all([refreshFinancial(), refreshInsights()])
    })
  }

  const handleEmergencyUpdateSubmit = async (event) => {
    event.preventDefault()

    if (!assessment) {
      setError(t('Lengkapi assessment dulu sebelum memperbarui dana darurat.', 'Complete the assessment before updating emergency funds.'))
      setMessage('')
      return
    }

    await guardedAction(async () => {
      await assessmentApi.patchLatest({ emergency_fund: Number(emergencyUpdateValue || 0) })
      setEmergencyUpdate(null)
    }, t('Dana darurat diperbarui.', 'Emergency fund updated.'), async () => {
      await Promise.all([refreshFinancial(), refreshInsights()])
    })
  }

  const handleAssessmentSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await assessmentApi.create({
        monthly_income: Number(assessmentForm.monthly_income),
        monthly_expense: Number(assessmentForm.monthly_expense),
        actual_savings: Number(assessmentForm.actual_savings),
        budget_goal: Number(assessmentForm.budget_goal),
        emergency_fund: Number(assessmentForm.emergency_fund),
        loan_payment: Number(assessmentForm.loan_payment || 0),
        skills: assessmentForm.skills || [],
        experience_level: assessmentForm.experience_level || 'Beginner',
        interest_category: assessmentForm.interest_category || '',
        available_hours_per_week: Number(assessmentForm.available_hours_per_week || 10),
      })

      const savedAssessment = response.data.data
      const classifyData = savedAssessment?.metadata?.classification_result || {
        classification: savedAssessment?.classification || 'unknown',
        score: savedAssessment?.ml_score || 0,
        explanation: savedAssessment?.ml_explanation || '',
      }

      setMlClassifyResult(classifyData)
      // Assessment touches everything — full refresh is justified here once.
      await refreshAll()
      setMessage(t(`Assessment tersimpan. Klasifikasi AI: ${classifyData.classification}`, `Assessment saved. AI classification: ${classifyData.classification}`))

      setShowOnboarding(false)
      setActiveTab('dashboard')
    } catch (err) {
      if (err?.response?.status === 429) {
        setError(t('Terlalu banyak request ke AI. Tunggu sebentar lalu coba lagi.', 'Too many AI requests. Please wait a moment and try again.'))
      } else {
        setError(err?.response?.data?.message || err?.message || t('Assessment gagal, coba lagi.', 'Assessment failed, please try again.'))
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Side-hustle recommendations are now demand-driven:
   * the side-hustle tab (or this submit handler) is the only caller.
   */
  const fetchInitialSideHustles = useCallback(async () => {
    if (!assessment) return
    try {
      const res = await recommendationApi.sideHustles({})
      const list = res.data.data?.recommendations || []
      const source = res.data.data?.source || '-'
      setMlSideHustleResult(list)
      setRecommendations(list)
      setRecommendationSource(source)
    } catch {
      // Silent — user can retry from the form
    }
  }, [assessment, setMlSideHustleResult, setRecommendations, setRecommendationSource])

  const handleRecommendationSubmit = async (event) => {
    event.preventDefault()
    setMlLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await recommendationApi.sideHustles({
        experience_level: recommendForm.experience_level,
        available_hours_per_week: Number(recommendForm.available_hours_per_week),
        interest_category: recommendForm.interest_category,
      })
      setMlSideHustleResult(res.data.data?.recommendations || [])
      setRecommendationSource(res.data.data?.source || '-')
      setMessage(t('Rekomendasi side hustle berhasil dimuat.', 'Side hustle recommendations loaded successfully.'))
    } catch (err) {
      if (err?.response?.status === 429) {
        setError(t('Terlalu banyak request ke AI. Tunggu sebentar lalu coba lagi.', 'Too many AI requests. Please wait a moment and try again.'))
      } else {
        setError(err?.response?.data?.message || err?.message || t('Gagal memuat rekomendasi side hustle.', 'Failed to load side hustle recommendations.'))
      }
    } finally {
      setMlLoading(false)
    }
  }

  const handleForumSubmit = async (event) => {
    event.preventDefault()

    await guardedAction(async () => {
      await forumApi.create({
        ...forumForm,
        tags: splitCsv(forumForm.tags),
      })

      setForumForm({ title: '', body: '', tags: 'budget,saving' })
    }, t('Postingan forum berhasil dipublikasikan.', 'Forum post published successfully.'), refreshForum)
  }

  const handleForumReplySubmit = async (event, postId) => {
    event.preventDefault()

    const body = (forumReplyForms[postId] || '').trim()

    if (!body) {
      setError(t('Balasan tidak boleh kosong.', 'Reply cannot be empty.'))
      setMessage('')
      return
    }

    await guardedAction(async () => {
      await forumApi.reply(postId, { body })
      setForumReplyForms((prev) => ({ ...prev, [postId]: '' }))
    }, t('Balasan forum berhasil dikirim.', 'Forum reply sent successfully.'), refreshForum)
  }

  const handleExportCsv = async () => {
    setLoading(true)
    setError('')

    try {
      const exportMonth = getCurrentMonth()
      const response = await api.get('/reports/transactions/export', {
        params: { month: exportMonth },
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `finary-transactions-${exportMonth}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      setMessage(t('Laporan CSV berhasil diunduh.', 'CSV report downloaded successfully.'))
    } catch (err) {
      setError(err?.response?.data?.message || t('Gagal export report.', 'Failed to export report.'))
    } finally {
      setLoading(false)
    }
  }

  return {
    handleTransactionSubmit,
    handleDeleteTransaction,
    handleBudgetSubmit,
    handleLoanUpdateSubmit,
    handleEmergencyUpdateSubmit,
    handleAssessmentSubmit,
    handleRecommendationSubmit,
    handleForumSubmit,
    handleForumReplySubmit,
    handleExportCsv,
    fetchInitialSideHustles,
  }
}
