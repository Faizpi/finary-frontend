import { compactDate, currency } from '../../lib/format'

/**
 * Delete confirmation modal for a transaction.
 */
export default function DeleteTransactionModal({
  transaction,
  onConfirm,
  onCancel,
  loading,
  t,
}) {
  if (!transaction) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{t('Hapus Transaksi?', 'Delete Transaction?')}</h3>
        <p>
          {t('Kamu akan menghapus transaksi', 'You are about to delete a transaction of')}{' '}
          <strong>{currency(transaction.amount)}</strong>{' '}
          ({transaction.category}, {compactDate(transaction.transaction_date)}).
        </p>
        <p className="helper">{t('Aksi ini tidak bisa dibatalkan.', 'This action cannot be undone.')}</p>
        <div className="modal-actions">
          <button
            className="button ghost"
            onClick={onCancel}
            disabled={loading}
          >
            {t('Batal', 'Cancel')}
          </button>
          <button
            className="button modal-delete-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? t('Menghapus...', 'Deleting...') : t('Ya, Hapus', 'Yes, Delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
