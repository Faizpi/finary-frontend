import { badgeLevelByKey, maxBadgeLevel, pieColors, platformDomains } from '../constants'

export const splitCsv = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

export const clampBadgeLevel = (value) => {
  const numericLevel = Number(value)
  if (!Number.isFinite(numericLevel)) {
    return 1
  }

  return Math.max(1, Math.min(maxBadgeLevel, Math.trunc(numericLevel)))
}

export const getBadgeIcon = (key, level) => `/badges/${key}/level-${clampBadgeLevel(level)}.png`
export const getBadgeBaseIcon = (key) => `/badges/${key}.png`
export const getBadgeLevel = (key) => badgeLevelByKey[key] || 1

export const getPlatformDomain = (platform = '') => {
  const normalized = platform.toLowerCase()
  const match = platformDomains.find(([keyword]) => normalized.includes(keyword))

  return match?.[1] || ''
}

export const getPlatformLogo = (platform = '') => {
  const domain = getPlatformDomain(platform)

  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : ''
}

export const buildPieSlices = (items) => {
  const cleaned = items.filter((item) => item.value > 0)
  const total = cleaned.reduce((sum, item) => sum + item.value, 0)

  const { slices } = cleaned.reduce((acc, item, index) => {
    const percent = total > 0 ? (item.value / total) * 100 : 0
    const start = acc.running
    const end = acc.running + percent

    return {
      running: end,
      slices: [
        ...acc.slices,
        {
          ...item,
          color: pieColors[index % pieColors.length],
          percent,
          start,
          end,
        },
      ],
    }
  }, { running: 0, slices: [] })

  return { slices, total }
}

export const getPieBackground = (slicesData) => {
  if (slicesData.total <= 0) {
    return 'conic-gradient(var(--chart-empty) 0% 100%)'
  }

  const gradient = slicesData.slices
    .map((slice) => `${slice.color} ${slice.start}% ${slice.end}%`)
    .join(', ')

  return `conic-gradient(${gradient})`
}
