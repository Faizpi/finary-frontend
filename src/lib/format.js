export const currency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(Number(value) || 0)
    .replace(/\u00A0/g, '')
    .replace('IDR', 'Rp')

export const compactDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Translates a transaction type key to a localised label.
 * @param {'income'|'expense'|string} type
 * @param {function} t  - i18n helper (idText, enText) => string
 */
export const formatTransactionType = (type, t) => {
  if (type === 'income') return t('Pemasukan', 'Income')
  if (type === 'expense') return t('Pengeluaran', 'Expense')
  return type
}
