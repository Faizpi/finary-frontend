import { useGuardedAction } from './useGuardedAction'
import { useTransactionActions } from './useTransactionActions'
import { useBudgetActions } from './useBudgetActions'
import { useAssessmentActions } from './useAssessmentActions'
import { useRecommendationActions } from './useRecommendationActions'
import { useForumActions } from './useForumActions'
import { useReportActions } from './useReportActions'

/**
 * Backward-compatible orchestrator that composes all domain action hooks.
 * App.jsx can consume this exactly as before — no prop changes needed.
 *
 * Over time, pages/components should import domain hooks directly
 * instead of going through this aggregator.
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
  const guardedAction = useGuardedAction({ setLoading, setError, setMessage, refreshFinancial, t })

  const { handleTransactionSubmit, handleDeleteTransaction } = useTransactionActions({
    transactionForm,
    setTransactionForm,
    pocketOptions,
    selectedPocketCategory,
    guardedAction,
    setError,
    setMessage,
    t,
  })

  const { handleBudgetSubmit, handleLoanUpdateSubmit, handleEmergencyUpdateSubmit } = useBudgetActions({
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
  })

  const { handleAssessmentSubmit } = useAssessmentActions({
    assessmentForm,
    setMlClassifyResult,
    setShowOnboarding,
    setActiveTab,
    refreshAll,
    setLoading,
    setError,
    setMessage,
    t,
  })

  const { fetchInitialSideHustles, handleRecommendationSubmit } = useRecommendationActions({
    assessment,
    recommendForm,
    setMlSideHustleResult,
    setMlLoading,
    setRecommendations,
    setRecommendationSource,
    setError,
    setMessage,
    t,
  })

  const { handleForumSubmit, handleForumReplySubmit } = useForumActions({
    forumForm,
    setForumForm,
    forumReplyForms,
    setForumReplyForms,
    guardedAction,
    refreshForum,
    setError,
    setMessage,
    t,
  })

  const { handleExportCsv } = useReportActions({ setLoading, setError, setMessage, t })

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
