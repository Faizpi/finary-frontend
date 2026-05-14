import { useCallback, useState } from 'react'
import {
  assessmentApi,
  authApi,
  budgetApi,
  dashboardApi,
  forumApi,
  recommendationApi,
  transactionApi,
} from '../lib/api'

/**
 * Manages all server-fetched data state and the refreshAll function.
 * Keeps data concerns separate from auth and action logic.
 */
export function useAppData() {
  const [user, setUser] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [profile, setProfile] = useState(null)
  const [badges, setBadges] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [transactions, setTransactions] = useState([])
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
    setBudgets([])
    setAssessment(null)
    setRecommendations([])
    setForumPosts([])
  }, [])

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
      recommendationRes,
      forumRes,
    ] = await Promise.all([
      authApi.me(),
      dashboardApi.getDashboard(),
      dashboardApi.getProfile(),
      dashboardApi.getBadges(),
      dashboardApi.getLeaderboard(),
      transactionApi.list(),
      budgetApi.list(),
      assessmentApi.getLatest(),
      recommendationApi.sideHustles(),
      forumApi.list(),
    ])

    const latestAssessment = assessmentRes.data.data

    setUser(meRes.data.user)
    setDashboard(dashboardRes.data.data)
    setProfile(profileRes.data.data)
    setBadges(badgesRes.data.data)
    setLeaderboard(leaderboardRes.data.data || [])
    setTransactions(transactionRes.data.data || [])
    setBudgets(budgetRes.data.data || [])
    setAssessment(latestAssessment)
    setRecommendations(recommendationRes.data.data?.recommendations || [])
    setRecommendationSource(recommendationRes.data.data?.source || '-')
    setForumPosts(forumRes.data.data || [])

    return { latestAssessment }
  }, [])

  return {
    user, setUser,
    dashboard,
    profile,
    badges,
    leaderboard,
    transactions,
    budgets,
    assessment,
    recommendations,
    recommendationSource, setRecommendationSource,
    forumPosts,
    clearData,
    refreshAll,
  }
}
