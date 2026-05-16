import { useCallback } from 'react'
import { assessmentApi, budgetApi } from '../lib/api'

/**
 * Handles budget CRUD and loan/emergency fund patch actions.
 */
export function useBudgetActions({
  budgetForm,
  setBudgetForm,
  assessment,
  loanUpdateValue,
  emergencyUpdateValue,
  setLoanUpdate,
  setEmergencyUpdate,
  guardedAction,
  refreshFinancial,
  refreshInsights,
  setError,
  setMessage,
  t,
}) {
  const handleBudgetSubmit = useCallback(async (event) => {
    event.preventDefault()

    await guardedAction(async () => {
      await budgetApi.create({
        ...budgetForm,
        monthly_limit: Number(budgetForm.monthly_limit),
      })
      setBudgetForm((prev) => ({ ...prev, monthly_limit: '' }))
    }, t('Budget tersimpan.', 'Budget saved.'))
  }, [budgetForm, setBudgetForm, guardedAction, t])

  const handleLoanUpdateSubmit = useCallback(async (event) => {
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
      await Promise.all([refreshFinancial(), refreshInsights()])
    })
  }, [assessment, loanUpdateValue, setLoanUpdate, guardedAction, refreshFinancial, refreshInsights, setError, setMessage, t])

  const handleEmergencyUpdateSubmit = useCallback(async (event) => {
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
  }, [assessment, emergencyUpdateValue, setEmergencyUpdate, guardedAction, refreshFinancial, refreshInsights, setError, setMessage, t])

  return {
    handleBudgetSubmit,
    handleLoanUpdateSubmit,
    handleEmergencyUpdateSubmit,
  }
}
