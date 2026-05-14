import { useMemo } from 'react'
import { experienceLevelOptions, interestCategoryOptions, visualAssets } from '../constants'
import { currency } from '../lib/format'
import { getPlatformLogo } from '../lib/helpers'

export default function HustlePage({
  handleRecommendationSubmit,
  mlLoading,
  mlSideHustleResult,
  recommendForm,
  recommendationSource,
  recommendations,
  setRecommendForm,
  t,
}) {
  const displayedSideHustles = useMemo(
    () => mlSideHustleResult ?? recommendations,
    [mlSideHustleResult, recommendations],
  )

  return (
    <section className="panel stack">
      <article className="inset hustle-hero">
        <form className="form-grid form-tight" onSubmit={handleRecommendationSubmit}>
          <h3>{t('Rekomendasi Side Hustle — AI', 'Side Hustle Recommendations — AI')}</h3>
          <p className="helper">{t('Powered by /recommend-side-hustle AI model.', 'Powered by /recommend-side-hustle AI model.')}</p>
          <label>{t('Level Pengalaman', 'Experience Level')}
            <select value={recommendForm.experience_level}
              onChange={(e) => setRecommendForm((p) => ({ ...p, experience_level: e.target.value }))}>
              {experienceLevelOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <label>{t('Kategori Minat', 'Interest Category')}
            <select value={recommendForm.interest_category}
              onChange={(e) => setRecommendForm((p) => ({ ...p, interest_category: e.target.value }))}>
              {interestCategoryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <label>{t('Waktu Luang / minggu (jam)', 'Available hours / week')}
            <input type="number" min="1" max="168" value={recommendForm.available_hours_per_week}
              onChange={(e) => setRecommendForm((p) => ({ ...p, available_hours_per_week: e.target.value }))} placeholder={t('Jam yang tersedia per minggu', 'Hours available per week')} />
          </label>
          <button className="button" disabled={mlLoading}>
            {mlLoading ? t('Mencari...', 'Searching...') : t('Cari Rekomendasi', 'Get Recommendations')}
          </button>
        </form>
        <div className="hustle-hero-media">
          <img
            src={visualAssets.hustle}
            alt={t('Ilustrasi side hustle', 'Side hustle illustration')}
            loading="lazy"
          />
        </div>
      </article>

      <div className="recommend-grid">
        <p className="helper recommend-source">
          {t('Sumber rekomendasi', 'Recommendation source')}: <strong>{recommendationSource}</strong>
        </p>
        {displayedSideHustles.map((item, idx) => {
          const platformLogo = getPlatformLogo(item.platform)

          return (
            <article className="recommend-card" key={`${item.job_category}-${idx}`}>
              <div className="recommend-card-head">
                <div className="platform-logo" aria-hidden="true">
                  {platformLogo ? (
                    <img
                      src={platformLogo}
                      alt=""
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <span>{(item.platform || '?').slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h4>{item.job_category}</h4>
                  <p className="hustle-platform">{item.platform || '-'}</p>
                </div>
              </div>
              <p className="hustle-project">{item.project_type}</p>
              <p className="hustle-income">{t('Estimasi', 'Estimate')}: <strong>{currency(item.predicted_monthly_earnings_idr)}</strong> / {t('bulan', 'month')}</p>
            </article>
          )
        })}
        {displayedSideHustles.length === 0 && mlSideHustleResult !== null && (
          <p className="helper">{t('Tidak ada rekomendasi. Coba ubah parameter.', 'No recommendations yet. Try adjusting the inputs.')}</p>
        )}
        {displayedSideHustles.length === 0 && mlSideHustleResult === null && (
          <p className="helper">{t('Pilih parameter dan klik "Cari Rekomendasi AI".', 'Choose parameters and click "Get AI Recommendations".')}</p>
        )}
      </div>
    </section>
  )
}
