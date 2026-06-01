import { useCallback, useRef, useState } from 'react'
import {
  assessmentApi,
  authApi,
  budgetApi,
  dashboardApi,
  forumApi,
  transactionApi,
} from '../lib/api'

const LEADERBOARD_PAGE_SIZE = 10
const TRANSACTION_PAGE_SIZE = 30
const getCurrentMonthKey = () => new Date().toISOString().slice(0, 7)

/**
 * Manages all server-fetched data state.
 *
 * refreshAll   — full bootstrap (login, page reload)
 * refreshFinancial — after transaction/budget/assessment changes
 * refreshInsights  — after assessment changes or when insights tab opens
 * refreshForum     — after forum post/reply
 */
export function useAppData() {
  const [user, setUser] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [dashboardMonth, setDashboardMonthState] = useState(getCurrentMonthKey)
  const dashboardMonthRef = useRef(dashboardMonth)
  const [profile, setProfile] = useState(null)
  const [badges, setBadges] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardMeta, setLeaderboardMeta] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [transactionsMeta, setTransactionsMeta] = useState(null)
  const [budgets, setBudgets] = useState([])
  const [assessment, setAssessment] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [recommendationSource, setRecommendationSource] = useState('-')
  const [forumPosts, setForumPosts] = useState([])

  const setDashboardMonth = useCallback((month) => {
    dashboardMonthRef.current = month
    setDashboardMonthState(month)
  }, [])

  const clearData = useCallback(() => {
    const currentMonth = getCurrentMonthKey()
    setUser(null)
    setDashboard(null)
    setDashboardMonth(currentMonth)
    setProfile(null)
    setBadges(null)
    setLeaderboard([])
    setLeaderboardMeta(null)
    setTransactions([])
    setTransactionsMeta(null)
    setBudgets([])
    setAssessment(null)
    setRecommendations([])
    setRecommendationSource('-')
    setForumPosts([])
  }, [setDashboardMonth])

  // Full refresh — used on bootstrap and after assessment submit
  const refreshAll = useCallback(async () => {
    const month = dashboardMonthRef.current
    const [
      meRes,
      dashboardRes,
      profileRes,
      badgesRes,
      leaderboardRes,
      transactionRes,
      budgetRes,
      assessmentRes,
      forumRes,
    ] = await Promise.all([
      authApi.me(),
      dashboardApi.getDashboard({ month }),
      dashboardApi.getProfile(),
      dashboardApi.getBadges(),
      dashboardApi.getLeaderboard({ month, per_page: LEADERBOARD_PAGE_SIZE, page: 1 }),
      transactionApi.list({ month, per_page: TRANSACTION_PAGE_SIZE, page: 1 }),
      budgetApi.list({ month }),
      assessmentApi.getLatest(),
      forumApi.list(),
    ])

    const latestAssessment = assessmentRes.data.data

    setUser(meRes.data.user)
    setDashboard(dashboardRes.data.data)
    setProfile(profileRes.data.data)
    setBadges(badgesRes.data.data)
    setLeaderboard(leaderboardRes.data.data || [])
    setLeaderboardMeta(leaderboardRes.data.meta || null)
    setTransactions(transactionRes.data.data || [])
    setTransactionsMeta(transactionRes.data.meta || null)
    setBudgets(budgetRes.data.data || [])
    setAssessment(latestAssessment)
    setForumPosts(forumRes.data.data || [])

    return { latestAssessment }
  }, [])

  // Lightweight refresh after transaction/budget CRUD — includes assessment for metric slides
  const refreshFinancial = useCallback(async () => {
    const month = dashboardMonthRef.current
    const [dashboardRes, transactionRes, budgetRes, assessmentRes] = await Promise.all([
      dashboardApi.getDashboard({ month }),
      transactionApi.list({ month, per_page: TRANSACTION_PAGE_SIZE, page: 1 }),
      budgetApi.list({ month }),
      assessmentApi.getLatest(),
    ])

    setDashboard(dashboardRes.data.data)
    setTransactions(transactionRes.data.data || [])
    setTransactionsMeta(transactionRes.data.meta || null)
    setBudgets(budgetRes.data.data || [])
    setAssessment(assessmentRes.data.data)
  }, [])

  // Refresh insights — called when profile/badges/leaderboard tab opens or after assessment
  const refreshInsights = useCallback(async () => {
    const month = dashboardMonthRef.current
    const [profileRes, badgesRes, leaderboardRes] = await Promise.all([
      dashboardApi.getProfile(),
      dashboardApi.getBadges(),
      dashboardApi.getLeaderboard({ month, per_page: LEADERBOARD_PAGE_SIZE, page: 1 }),
    ])

    setProfile(profileRes.data.data)
    setBadges(badgesRes.data.data)
    setLeaderboard(leaderboardRes.data.data || [])
    setLeaderboardMeta(leaderboardRes.data.meta || null)
  }, [])

  const loadDashboardMonth = useCallback(async (month) => {
    setDashboardMonth(month)

    const [dashboardRes, transactionRes, budgetRes, leaderboardRes] = await Promise.all([
      dashboardApi.getDashboard({ month }),
      transactionApi.list({ month, per_page: TRANSACTION_PAGE_SIZE, page: 1 }),
      budgetApi.list({ month }),
      dashboardApi.getLeaderboard({ month, per_page: LEADERBOARD_PAGE_SIZE, page: 1 }),
    ])

    setDashboard(dashboardRes.data.data)
    setTransactions(transactionRes.data.data || [])
    setTransactionsMeta(transactionRes.data.meta || null)
    setBudgets(budgetRes.data.data || [])
    setLeaderboard(leaderboardRes.data.data || [])
    setLeaderboardMeta(leaderboardRes.data.meta || null)
  }, [setDashboardMonth])

  // Replace leaderboard page while preserving global rank from the API.
  const loadLeaderboardPage = useCallback(async (page) => {
    const month = dashboardMonthRef.current
    const res = await dashboardApi.getLeaderboard({
      month,
      per_page: LEADERBOARD_PAGE_SIZE,
      page,
    })

    setLeaderboard(res.data.data || [])
    setLeaderboardMeta(res.data.meta || null)
  }, [])

  // Load more transactions (pagination)
  const loadMoreTransactions = useCallback(async (page) => {
    const month = dashboardMonthRef.current
    const res = await transactionApi.list({ month, per_page: TRANSACTION_PAGE_SIZE, page })
    setTransactions((prev) => [...prev, ...(res.data.data || [])])
    setTransactionsMeta(res.data.meta || null)
  }, [])

  // Refresh forum only
  const refreshForum = useCallback(async () => {
    const res = await forumApi.list()
    setForumPosts(res.data.data || [])
  }, [])

  return {
    user, setUser,
    dashboard,
    dashboardMonth,
    profile,
    badges,
    leaderboard,
    leaderboardMeta,
    transactions,
    transactionsMeta,
    budgets,
    assessment, setAssessment,
    recommendations, setRecommendations,
    recommendationSource, setRecommendationSource,
    forumPosts,
    clearData,
    refreshAll,
    refreshFinancial,
    refreshInsights,
    refreshForum,
    loadMoreTransactions,
    loadDashboardMonth,
    loadLeaderboardPage,
  }
}
