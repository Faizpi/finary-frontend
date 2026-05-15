import { useMemo } from 'react'
import { badgeDescriptionText, defaultBadgeIcon } from '../constants'
import { compactDate, currency } from '../lib/format'
import { getBadgeBaseIcon, getBadgeIcon, getBadgeLevel } from '../lib/helpers'

export default function ProfilePage({
  assessment,
  badges,
  handleProfilePhotoChange,
  handleRemovePhoto,
  language,
  leaderboard,
  profile,
  profilePhoto,
  setProfilePhoto,
  t,
  user,
}) {
  const userLeaderboardRow = useMemo(
    () => leaderboard.find((item) => item.name === user?.name),
    [leaderboard, user],
  )

  const userInitials = useMemo(() => {
    const rawName = user?.name || ''
    const parts = rawName.trim().split(' ').filter(Boolean)
    if (parts.length === 0) {
      return '??'
    }

    return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join('')
  }, [user])

  const latestUnlockedBadges = useMemo(
    () => (badges?.badges || []).filter((badge) => badge.unlocked).slice(-3).reverse(),
    [badges],
  )

  // Consolidate all warnings: budget overages + prediction warning + prediction recommendations
  const allWarnings = useMemo(() => {
    const base = profile?.warnings || []
    const predWarning = profile?.prediction?.warning_flag && profile?.prediction?.warning_text
      ? [profile.prediction.warning_text]
      : []
    const predRecs = (profile?.prediction?.recommendations || [])
    // Deduplicate by string value
    return Array.from(new Set([...base, ...predWarning, ...predRecs]))
  }, [profile])

  return (
          <section className="panel stack profile-simple">
            <div className="profile-header">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt={t('Foto profil', 'Profile photo')} />
                  ) : (
                    <div className="profile-avatar-fallback">{userInitials}</div>
                  )}
                </div>
                <div className="profile-avatar-actions">
                  <label className="button ghost tiny" htmlFor="profile-photo-input">
                    {t('Ganti Foto', 'Change Photo')}
                  </label>
                  <input
                    id="profile-photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                    hidden
                  />
                  {profilePhoto && (
                    <button
                      type="button"
                      className="button ghost tiny"
                      onClick={handleRemovePhoto}
                    >
                      {t('Hapus Foto', 'Remove Photo')}
                    </button>
                  )}
                </div>
              </div>
              <div className="profile-header-main">
                <div className="profile-title-row">
                  <h2>{user.name || '-'}</h2>
                  <span className={`ml-classify-badge profile-title-status ml-${assessment?.classification || 'unknown'}`}>
                    {assessment ? (assessment.classification || '-').toUpperCase() : t('BELUM ASSESSMENT', 'NOT ASSESSED')}
                  </span>
                </div>
                <p>{user.email || '-'}</p>
                <div className="profile-meta-row">
                  <span>{t('Status akun', 'Account status')}: <strong>{assessment ? t('Aktif', 'Active') : t('Belum assessment', 'Assessment pending')}</strong></span>
                  <span>{t('Bergabung', 'Joined')}: <strong>{user.created_at ? compactDate(user.created_at) : '-'}</strong></span>
                </div>
              </div>
            </div>

            <div className="split-grid profile-grid">
              <article className="inset profile-card simple">
                <h3>{t('Ringkasan Finansial', 'Financial Summary')}</h3>
                <div className="profile-meta">
                  <p>{t('Kebiasaan belanja', 'Spending habit')}: <strong>{profile?.spending_habit || '-'}</strong></p>
                  <p>{t('Pola pemasukan', 'Income pattern')}: <strong>{profile?.income_pattern || '-'}</strong></p>
                  <p>{t('Perilaku menabung', 'Saving behavior')}: <strong>{profile?.saving_behavior || '-'}</strong></p>
                  <p>{t('Posisi leaderboard', 'Leaderboard position')}: <strong>{userLeaderboardRow ? `#${userLeaderboardRow.rank}` : '-'}</strong></p>
                </div>
              </article>

              <article className="inset profile-card simple profile-prediction-card">
                <div className="profile-card-head">
                  <h3>{t('Estimasi Saldo Bulan Depan', 'Next Month Balance Estimate')}</h3>
                  <span className="status-pill ready">{profile?.prediction?.source || '-'}</span>
                </div>
                <p className="helper">
                  {t('AI memperkirakan sisa saldo bulan depan dari pola pemasukan, pengeluaran, dan assessment terakhirmu.', 'AI estimates next month balance from your income, spending, and latest assessment patterns.')}
                </p>
                <strong className="predict-balance" aria-label={t('Estimasi saldo bulan depan', 'Estimated next month balance')}>
                  {currency(profile?.prediction?.next_month_balance || 0)}
                </strong>
                <div className="prediction-stats">
                  <span>
                    {t('Kondisi keuangan', 'Financial condition')}
                    <strong>{profile?.prediction?.warning_flag ? t('Perlu perhatian', 'Needs attention') : t('Terkendali', 'On track')}</strong>
                  </span>
                  <span>
                    {t('Dihitung pada', 'Calculated for')}
                    <strong>{profile?.prediction?.generated_for || '-'}</strong>
                  </span>
                </div>
              </article>

              <article className="inset profile-card simple">
                <h3>{t('Peringatan', 'Warnings')}</h3>
                {language === 'en' && allWarnings.length > 0 && (
                  <p className="helper">{t('Peringatan ditampilkan dalam Bahasa Indonesia (dari server).', 'Warnings are displayed in Indonesian (from the server).')}</p>
                )}
                <ul className="dynamic-profile-warnings">
                  {allWarnings.length === 0 && (
                    <li>{t('Tidak ada peringatan. Pertahankan ritme keuanganmu.', 'No warnings yet. Keep up the good rhythm.')}</li>
                  )}
                  {allWarnings.map((item, idx) => (
                    <li key={`warning-${idx}`}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>

            <article className="inset profile-achievement-card">
              <h3>{t('Achievement Terbaru', 'Latest Achievements')}</h3>
              <p>
                {badges?.summary?.unlocked_count || 0} / {badges?.summary?.total_badges || 0} {t('badge terbuka', 'badges unlocked')}
              </p>

              <div className="profile-achievement-list">
                {latestUnlockedBadges.length === 0 && (
                  <p className="helper">{t('Belum ada badge yang terbuka.', 'No badges unlocked yet.')}</p>
                )}

                {latestUnlockedBadges.map((badge) => {
                  const level = getBadgeLevel(badge)

                  return (
                    <article className="profile-achievement-item" key={`latest-${badge.key}`}>
                      <div className="badge-photo-wrap" aria-hidden="true">
                        <img
                          className="badge-photo"
                          src={getBadgeIcon(badge.key, level)}
                          data-base-src={getBadgeBaseIcon(badge.key)}
                          data-fallback-stage="level"
                          alt={`${badge.name} level ${level}`}
                          loading="lazy"
                          onError={(event) => {
                            const stage = event.currentTarget.dataset.fallbackStage || 'level'
                            if (stage === 'level') {
                              event.currentTarget.dataset.fallbackStage = 'base'
                              event.currentTarget.src = event.currentTarget.dataset.baseSrc || defaultBadgeIcon
                              return
                            }

                            event.currentTarget.onerror = null
                            event.currentTarget.src = defaultBadgeIcon
                          }}
                        />
                      </div>
                      <div className="profile-achievement-copy">
                        <strong>{badge.name}</strong>
                        <small>{badgeDescriptionText[badge.key]
                          ? t(badgeDescriptionText[badge.key].id, badgeDescriptionText[badge.key].en)
                          : ''}</small>
                      </div>
                    </article>
                  )
                })}
              </div>
            </article>
          </section>
  )
}
