import { useEffect, useRef } from 'react'

const EMPTY_ASSESSMENT_FORM = {
  monthly_income: '',
  monthly_expense: '',
  actual_savings: '',
  budget_goal: '',
  emergency_fund: '',
  loan_payment: '',
  skills: [],
  experience_level: '',
  interest_category: '',
  available_hours_per_week: '',
}

const EMPTY_TRANSACTION_FORM = { type: 'expense', category: '', amount: '', transaction_date: '', note: '' }
const EMPTY_BUDGET_FORM = { category: 'Makanan', period: '', monthly_limit: '' }
const EMPTY_RECOMMEND_FORM = { experience_level: '', available_hours_per_week: '', interest_category: '' }
const EMPTY_FORUM_FORM = { title: '', body: '', tags: '' }

/**
 * Encapsulates the three server→form sync patterns that React 19's
 * strict lint doesn't like in App.jsx's render body.
 *
 * These effects intentionally call setState to synchronize server data
 * into local form state. They are NOT cascading renders — each fires
 * at most once per upstream change and is guarded by a ref.
 */
export function useFormSync({
  user,
  assessment,
  showOnboarding,
  getToday,
  getCurrentMonth,
  setAssessmentForm,
  setTransactionForm,
  setBudgetForm,
  setForumForm,
  setForumReplyForms,
  setRecommendForm,
  setMlClassifyResult,
  setMlSideHustleResult,
  setProfilePhoto,
}) {
  // 1. Reset all form state when user logs out (transitions to null)
  const prevUserRef = useRef(user)
  useEffect(() => {
    const wasLoggedIn = prevUserRef.current
    prevUserRef.current = user

    if (wasLoggedIn && !user) {
      setAssessmentForm(EMPTY_ASSESSMENT_FORM)
      setTransactionForm({ ...EMPTY_TRANSACTION_FORM, transaction_date: getToday() })
      setBudgetForm({ ...EMPTY_BUDGET_FORM, period: getCurrentMonth() })
      setForumForm(EMPTY_FORUM_FORM)
      setForumReplyForms({})
      setRecommendForm(EMPTY_RECOMMEND_FORM)
      setMlClassifyResult(null)
      setMlSideHustleResult(null)
    }
  }, [user, getToday, getCurrentMonth, setAssessmentForm, setTransactionForm, setBudgetForm, setForumForm, setForumReplyForms, setRecommendForm, setMlClassifyResult, setMlSideHustleResult])

  // 2. Sync server assessment into form when it changes (skip during onboarding)
  const prevAssessmentRef = useRef(null)
  useEffect(() => {
    if (!assessment || showOnboarding) return
    if (prevAssessmentRef.current === assessment) return
    prevAssessmentRef.current = assessment

    const ctx = assessment.metadata?.side_hustle_context || {}
    setAssessmentForm((prev) => ({
      ...prev,
      monthly_income: String(assessment.monthly_income ?? ''),
      monthly_expense: String(assessment.monthly_expense ?? ''),
      actual_savings: String(assessment.actual_savings ?? ''),
      budget_goal: String(assessment.budget_goal ?? ''),
      emergency_fund: String(assessment.emergency_fund ?? ''),
      loan_payment: String(assessment.loan_payment ?? ''),
      skills: assessment.skills ?? ctx.skills ?? [],
      experience_level: ctx.experience_level ?? '',
      interest_category: ctx.interest_category ?? '',
      available_hours_per_week: String(assessment.available_hours_per_week ?? ctx.available_hours_per_week ?? ''),
    }))
  }, [assessment, showOnboarding, setAssessmentForm])

  // 3. Sync profile photo from server user data
  const prevAvatarRef = useRef(undefined)
  useEffect(() => {
    const avatar = user?.avatar ?? ''
    if (prevAvatarRef.current === avatar) return
    prevAvatarRef.current = avatar
    setProfilePhoto(avatar)
  }, [user, setProfilePhoto])
}
