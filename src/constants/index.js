import faqImg from '../assets/faq.png'
import forumImg from '../assets/forum.png'
import haloImg from '../assets/halo.png'
import heroImg from '../assets/hero.png'
import hustleImg from '../assets/hustle.png'
import shockImg from '../assets/shock.png'
import shyImg from '../assets/shy.png'

export const categoryOptions = [
  'Makanan',
  'Transport',
  'Hiburan',
  'Tagihan',
  'Belanja',
  'Kesehatan',
  'Pendidikan',
  'Gaji',
  'Side Hustle',
  'Investasi',
]

export const skillOptions = [
  'design',
  'copywriting',
  'social media',
  'teaching',
  'spreadsheet',
  'seo',
  'writing',
  'communication',
]

export const experienceLevelOptions = ['Beginner', 'Intermediate', 'Expert']

export const interestCategoryOptions = [
  'App Development',
  'Web Development',
  'Graphic Design',
  'UI/UX Design',
  'SEO',
  'Copywriting',
  'Social Media Management',
  'Video Editing',
  'Content Writing',
  'Data Entry',
  'Virtual Assistant',
  'Translation',
  'Teaching / Tutoring',
  'Digital Marketing',
  'Photography',
]

export const badgeLevelByKey = {
  first_saver: 1,
  expense_tracker: 1,
  budget_keeper: 1,
  daily_logger: 1,
  side_hustler: 1,
  saving_streak: 1,
  comeback: 1,
}

export const maxBadgeLevel = 6

export const badgeDescriptionText = {
  first_saver: {
    id: 'Menandai progres saat kamu berhasil mulai menyisihkan uang.',
    en: 'Marks your progress when you start setting money aside.',
  },
  expense_tracker: {
    id: 'Membantu melihat konsistensi mencatat pengeluaran.',
    en: 'Shows how consistently you track expenses.',
  },
  budget_keeper: {
    id: 'Menunjukkan kemampuan menjaga pengeluaran tetap sesuai budget.',
    en: 'Shows your ability to keep spending within budget.',
  },
  daily_logger: {
    id: 'Mengukur kebiasaan rutin mencatat aktivitas keuangan.',
    en: 'Tracks your habit of logging financial activity regularly.',
  },
  side_hustler: {
    id: 'Menandai progres eksplorasi peluang penghasilan tambahan.',
    en: 'Marks progress exploring extra income opportunities.',
  },
  saving_streak: {
    id: 'Menunjukkan konsistensi mempertahankan kebiasaan menabung.',
    en: 'Shows consistency in maintaining a saving habit.',
  },
  comeback: {
    id: 'Mengapresiasi saat kamu kembali aktif mengelola keuangan.',
    en: 'Recognizes when you return to actively managing finances.',
  },
}

export const defaultBadgeIcon = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f3c5.svg'

export const pieColors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
]

export const platformDomains = [
  ['upwork', 'upwork.com'],
  ['fiverr', 'fiverr.com'],
  ['freelancer', 'freelancer.com'],
  ['instagram', 'instagram.com'],
  ['preply', 'preply.com'],
  ['shopee', 'shopee.co.id'],
  ['tokopedia', 'tokopedia.com'],
  ['linkedin', 'linkedin.com'],
  ['tiktok', 'tiktok.com'],
  ['youtube', 'youtube.com'],
  ['projects.co.id', 'projects.co.id'],
  ['sribulancer', 'sribulancer.com'],
  ['fastwork', 'fastwork.co.id'],
]

export const getToday = () => new Date().toISOString().slice(0, 10)
export const getCurrentMonth = () => new Date().toISOString().slice(0, 7)

// Backward-compatible aliases — prefer the functions above for fresh values
export const today = getToday()
export const currentMonth = getCurrentMonth()

export const visualAssets = {
  auth: haloImg,
  onboarding: heroImg,
  dashboard: shyImg,
  assessment: shockImg,
  forum: forumImg,
  faq: faqImg,
  hustle: hustleImg,
}
