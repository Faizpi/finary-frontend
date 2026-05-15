import { useCallback, useState } from 'react'
import {
  assessmentApi,
  authApi,
  budgetApi,
  dashboardApi,
  forumApi,
  transactionApi,
} from '../lib/api'

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
  const [profile, setProfile] = useState(null)
  const [badges, setBadges] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [transactions, setTransactions] = useState([])
  const [transactionsMeta, setTransactionsMeta] = useState(null)
  const [budgets, setBudgets] = useState([])
  const [assessment, setAssessment] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [recommendationSource, setRecommendationSource] = useState('-')
  const [forumPosts, setForumPosts] = useState([])

  const clearData = useCallback(() => {
    setUser(null)
    setDashboard(null)
    setProfile(null)
    setBadges(null)
    setLeaderboard([])
    setTransactions([])
    setTransactionsMeta(null)
    setBudgets([])
    setAssessment(null)
    setRecommendations([])
    setRecommendationSource('-')
    setForumPosts([])
  }, [])

  // Full refresh — used on bootstrap and after assessment submit
  const refreshAll = useCallback(async () => {
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
      dashboardApi.getDashboard(),
      dashboardApi.getProfile(),
      dashboardApi.getBadges(),
      dashboardApi.getLeaderboard(),
      transactionApi.list({ per_page: 30, page: 1 }),
      budgetApi.list(),
      assessmentApi.getLatest(),
      forumApi.list(),
    ])

    const latestAssessment = assessmentRes.data.data

    setUser(meRes.data.user)
    setDashboard(dashboardRes.data.data)
    setProfile(profileRes.data.data)
    setBadges(badgesRes.data.data)
    setLeaderboard(leaderboardRes.data.data || [])
    setTransactions(transactionRes.data.data || [])
    setTransactionsMeta(transactionRes.data.meta || null)
    setBudgets(budgetRes.data.data || [])
    setAssessment(latestAssessment)
    setForumPosts(forumRes.data.data || [])

    return { latestAssessment }
  }, [])

  // Lightweight refresh after transaction/budget CRUD — includes assessment for metric slides
  const refreshFinancial = useCallback(async () => {
    const [dashboardRes, transactionRes, budgetRes, assessmentRes] = await Promise.all([
      dashboardApi.getDashboard(),
      transactionApi.list({ per_page: 30, page: 1 }),
      budgetApi.list(),
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
    const [profileRes, badgesRes, leaderboardRes] = await Promise.all([
      dashboardApi.getProfile(),
      dashboardApi.getBadges(),
      dashboardApi.getLeaderboard(),
    ])

    setProfile(profileRes.data.data)
    setBadges(badgesRes.data.data)
    setLeaderboard(leaderboardRes.data.data || [])
  }, [])

  // Load more transactions (pagination)
  const loadMoreTransactions = useCallback(async (page) => {
    const res = await transactionApi.list({ per_page: 30, page })
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
    profile,
    badges,
    leaderboard,
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
  }
}
