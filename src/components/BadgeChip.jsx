import { badgeDescriptionText, defaultBadgeIcon, maxBadgeLevel } from '../constants'
import { getBadgeBaseIcon, getBadgeIcon, getBadgeLevel } from '../lib/helpers'

/**
 * Shared badge chip used in DashboardPage and ProfilePage.
 * Renders a single badge with level track, lock state, and progress.
 */
export default function BadgeChip({ badge, t }) {
  const level = getBadgeLevel(badge)

  return (
    <div className={`badge-chip level-${level} ${badge.unlocked ? 'on' : 'locked'}`}>
      <div className="badge-head">
        <div className="badge-photo-wrap" aria-hidden="true">
          {level === 0 ? (
            <img
              className="badge-photo"
              src={getBadgeBaseIcon(badge.key)}
              alt={`${badge.name} terkunci`}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = defaultBadgeIcon
              }}
            />
          ) : (
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
          )}
        </div>
        <div className="badge-copy">
          <strong>{badge.name}</strong>
          <small>
            {badgeDescriptionText[badge.key]
              ? t(badgeDescriptionText[badge.key].id, badgeDescriptionText[badge.key].en)
              : ''}
          </small>
        </div>
      </div>

      <div
        className="badge-level-row"
        aria-label={
          badge.unlocked
            ? t(`Level ${level} dari ${maxBadgeLevel}`, `Level ${level} of ${maxBadgeLevel}`)
            : t('Terkunci', 'Locked')
        }
      >
        <span className="badge-level-label">{badge.unlocked ? `Lv ${level}` : 'Lv 0'}</span>
        {badge.unlocked && (
          <div className="badge-level-track">
            {Array.from({ length: maxBadgeLevel }, (_, index) => (
              <span
                key={`${badge.key}-level-${index + 1}`}
                className={`badge-level-dot ${index + 1 <= level ? 'on' : 'off'}`}
              />
            ))}
          </div>
        )}
      </div>

      <span className={`badge-state ${badge.unlocked ? 'on' : 'off'}`}>
        {badge.unlocked ? t('Terbuka', 'Unlocked') : t('Terkunci', 'Locked')}
      </span>

      {badge.next_target !== null && badge.next_target !== undefined && (
        <small className="badge-next-target">
          {t('Progress', 'Progress')}: {badge.progress ?? 0} / {badge.next_target}
        </small>
      )}
      {badge.next_target === null && badge.unlocked && (
        <small className="badge-next-target maxed">
          {t('Level maksimal tercapai', 'Max level reached')}
        </small>
      )}
    </div>
  )
}
