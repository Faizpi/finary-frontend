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
 * Depends on shared loading/error/message setters and refreshAll from parent.
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
  setRecommendationSource,
  setShowOnboarding,
  setTransactionForm,
  transactionForm,
  refreshAll,
  setLoading,
  setError,
  setMessage,
  setActiveTab,
  t,
}) {
  const guardedAction = useCallback(async (fn, successMessage) => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await fn()
      await refreshAll()
      if (successMessage) {
        setMessage(successMessage)
      }
    } catch (err) {
      if (err?.response?.status === 422) {
        const validationErrors = err.response.data?.errors
        if (validationErrors) {
          setError(Object.values(validationErrors).flat().join(' '))
        } else {
          setError(err.response.data?.message || 'Validasi gagal. Periksa input Anda.')
        }
      } else {
        setError(err?.response?.data?.message || 'Proses gagal, coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }, [refreshAll, setLoading, setError, setMessage])

  const buildAssessmentPayload = useCallback((overrides = {}) => {
    if (!assessment) {
      return null
    }

    const loanValue = overrides.loan_payment ?? assessment.loan_payment ?? 0
    const emergencyValue = overrides.emergency_fund ?? assessment.emergency_fund ?? 0

    return {
      monthly_income: Number(assessment.monthly_income || 0),
      monthly_expense: Number(assessment.monthly_expense || 0),
      actual_savings: Number(assessment.actual_savings || 0),
      budget_goal: Number(assessment.budget_goal || 0),
      emergency_fund: Number(emergencyValue || 0),
      loan_payment: Number(loanValue || 0),
      classification: assessment.classification || 'unknown',
    }
  }, [assessment])

  const handleTransactionSubmit = async (event) => {
    event.preventDefault()

    if (pocketOptions.length === 0) {
      setError('Buat kantong budget dulu sebelum menambah transaksi.')
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
    }, 'Transaksi baru sudah ditambahkan.')
  }

  const handleDeleteTransaction = async (id) => {
    await guardedAction(() => transactionApi.remove(id), 'Transaksi berhasil dihapus.')
  }

  const handleBudgetSubmit = async (event) => {
    event.preventDefault()

    await guardedAction(async () => {
      await budgetApi.create({
        ...budgetForm,
        monthly_limit: Number(budgetForm.monthly_limit),
      })

      setBudgetForm((prev) => ({ ...prev, monthly_limit: '' }))
    }, 'Budget tersimpan.')
  }

  const handleLoanUpdateSubmit = async (event) => {
    event.preventDefault()
    const payload = buildAssessmentPayload({ loan_payment: Number(loanUpdateValue || 0) })

    if (!payload) {
      setError(t('Lengkapi assessment dulu sebelum memperbarui cicilan.', 'Complete the assessment before updating loan installments.'))
      setMessage('')
      return
    }

    await guardedAction(async () => {
      await assessmentApi.create(payload)
      setLoanUpdate(null)
    }, t('Cicilan hutang diperbarui.', 'Loan installment updated.'))
  }

  const handleEmergencyUpdateSubmit = async (event) => {
    event.preventDefault()
    const payload = buildAssessmentPayload({ emergency_fund: Number(emergencyUpdateValue || 0) })

    if (!payload) {
      setError(t('Lengkapi assessment dulu sebelum memperbarui dana darurat.', 'Complete the assessment before updating emergency funds.'))
      setMessage('')
      return
    }

    await guardedAction(async () => {
      await assessmentApi.create(payload)
      setEmergencyUpdate(null)
    }, t('Dana darurat diperbarui.', 'Emergency fund updated.'))
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
      })

      const savedAssessment = response.data.data
      const classifyData = savedAssessment?.metadata?.classification_result || {
        classification: savedAssessment?.classification || 'unknown',
        score: savedAssessment?.ml_score || 0,
        explanation: savedAssessment?.ml_explanation || '',
      }

      setMlClassifyResult(classifyData)
      await refreshAll()
      setMessage(`Assessment tersimpan. Klasifikasi AI: ${classifyData.classification} (score: ${(classifyData.score * 100).toFixed(0)}%)`)

      setShowOnboarding(false)
      setActiveTab('dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Assessment gagal, coba lagi.')
    } finally {
      setLoading(false)
    }
  }

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
      setMessage('Rekomendasi side hustle berhasil dimuat.')
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Gagal memuat rekomendasi side hustle.')
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
    }, 'Postingan forum berhasil dipublikasikan.')
  }

  const handleForumReplySubmit = async (event, postId) => {
    event.preventDefault()

    const body = (forumReplyForms[postId] || '').trim()

    if (!body) {
      setError('Balasan tidak boleh kosong.')
      setMessage('')
      return
    }

    await guardedAction(async () => {
      await forumApi.reply(postId, { body })
      setForumReplyForms((prev) => ({ ...prev, [postId]: '' }))
    }, 'Balasan forum berhasil dikirim.')
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
      setMessage('Laporan CSV berhasil diunduh.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Gagal export report.')
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
  }
}
