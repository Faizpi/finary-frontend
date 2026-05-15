import { badgeLevelByKey, maxBadgeLevel, pieColors, platformDomains } from '../constants'

/**
 * Translates server-generated Indonesian warnings to English.
 * Uses pattern matching since warnings contain dynamic values (category names, percentages).
 */
const warningPatterns = [
  {
    match: /^Kategori (.+) sudah melewati batas budget\.$/,
    en: (m) => `Category ${m[1]} has exceeded the budget limit.`,
  },
  {
    match: /^Cashflow bulan ini negatif\. Pangkas pengeluaran non-esensial\.$/,
    en: () => 'This month\'s cashflow is negative. Cut non-essential spending.',
  },
  {
    match: /^Kondisi keuangan bulan depan diprediksi terkendali\. Pertahankan pola pengeluaran saat ini\.$/,
    en: () => 'Next month\'s finances are predicted to be stable. Maintain your current spending pattern.',
  },
  {
    match: /^Saldo bulan depan diprediksi negatif/,
    en: () => 'Next month\'s balance is predicted to be negative — prioritize cutting variable expenses immediately.',
  },
  {
    match: /^Risiko defisit bulan depan sangat tinggi \((\d+)%\)\. Tinjau pengeluaran besar sekarang\.$/,
    en: (m) => `Next month's deficit risk is very high (${m[1]}%). Review large expenses now.`,
  },
  {
    match: /^Ada indikasi tekanan keuangan bulan depan \((\d+)%\)\. Kurangi pengeluaran non-esensial\.$/,
    en: (m) => `Financial pressure indicated next month (${m[1]}%). Reduce non-essential spending.`,
  },
  {
    match: /^Tetapkan limit mingguan untuk pengeluaran fleksibel\.$/,
    en: () => 'Set a weekly limit for flexible spending.',
  },
  {
    match: /^Aktifkan auto-transfer tabungan setiap hari gajian\.$/,
    en: () => 'Enable auto-transfer savings on every payday.',
  },
  {
    match: /^Prioritaskan side hustle dengan waktu mulai cepat\.$/,
    en: () => 'Prioritize side hustles with a quick start time.',
  },
  {
    match: /^Pertahankan ritme sekarang dan evaluasi target 30 hari ke depan\.$/,
    en: () => 'Maintain your current rhythm and review targets for the next 30 days.',
  },
  {
    match: /^Saldo bulan depan diprediksi negatif\. Prioritaskan pemangkasan pengeluaran variabel\.$/,
    en: () => 'Next month\'s balance is predicted negative. Prioritize cutting variable expenses.',
  },
  {
    match: /^Rasio pengeluaran tinggi \((\d+)%\)\. Evaluasi pengeluaran non-esensial\.$/,
    en: (m) => `Expense ratio is high (${m[1]}%). Evaluate non-essential spending.`,
  },
  {
    match: /^Beban cicilan cukup besar\. Pertimbangkan restrukturisasi atau percepatan pelunasan\.$/,
    en: () => 'Loan burden is significant. Consider restructuring or accelerating repayment.',
  },
  {
    match: /^Buffer tabungan masih tipis\. Sisihkan minimal 10% income untuk tabungan darurat\.$/,
    en: () => 'Savings buffer is thin. Set aside at least 10% of income for emergency savings.',
  },
  {
    match: /^Kondisi keuangan cukup stabil\. Jaga konsistensi dan review target bulanan\.$/,
    en: () => 'Financial condition is fairly stable. Stay consistent and review monthly targets.',
  },
  {
    match: /^Tingkatkan emergency fund\.$/,
    en: () => 'Increase your emergency fund.',
  },
  {
    match: /^Warning tinggi: batasi transaksi non-esensial selama 2 minggu\.$/,
    en: () => 'High warning: limit non-essential transactions for 2 weeks.',
  },
]

export const translateWarning = (text, language) => {
  if (language === 'id') return text

  for (const pattern of warningPatterns) {
    const match = text.match(pattern.match)
    if (match) return pattern.en(match)
  }

  return text
}

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

/**
 * Returns the display level for a badge chip.
 * - locked badges (unlocked=false) → 0
 * - unlocked badges → level from badgeLevelByKey (default 1)
 */
export const getBadgeLevel = (badgeOrKey, unlocked = true) => {
  if (typeof badgeOrKey === 'object' && badgeOrKey !== null) {
    return badgeOrKey.unlocked ? Number(badgeOrKey.level || 1) : 0
  }

  if (!unlocked) return 0
  return badgeLevelByKey[badgeOrKey] || 1
}

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
