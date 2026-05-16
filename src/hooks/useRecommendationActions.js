import { useCallback } from 'react'
import { recommendationApi } from '../lib/api'

/**
 * Handles side-hustle recommendation fetching and form submission.
 */
export function useRecommendationActions({
  assessment,
  recommendForm,
  setMlSideHustleResult,
  setMlLoading,
  setRecommendations,
  setRecommendationSource,
  setError,
  setMessage,
  t,
}) {
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

  const handleRecommendationSubmit = useCallback(async (event) => {
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
  }, [recommendForm, setMlSideHustleResult, setMlLoading, setRecommendationSource, setError, setMessage, t])

  return { fetchInitialSideHustles, handleRecommendationSubmit }
}
