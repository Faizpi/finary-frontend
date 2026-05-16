import { useCallback } from 'react'
import { assessmentApi } from '../lib/api'

/**
 * Handles assessment form submission and ML classification result.
 */
export function useAssessmentActions({
  assessmentForm,
  setMlClassifyResult,
  setShowOnboarding,
  setActiveTab,
  refreshAll,
  setLoading,
  setError,
  setMessage,
  t,
}) {
  const handleAssessmentSubmit = useCallback(async (event) => {
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
      await refreshAll()
      setMessage(t(
        `Assessment tersimpan. Klasifikasi AI: ${classifyData.classification}`,
        `Assessment saved. AI classification: ${classifyData.classification}`,
      ))
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
  }, [assessmentForm, setMlClassifyResult, setShowOnboarding, setActiveTab, refreshAll, setLoading, setError, setMessage, t])

  return { handleAssessmentSubmit }
}
