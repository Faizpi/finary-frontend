import { compactDate, currency } from '../../lib/format'

/**
 * Transaction history table with export and load-more.
 */
export default function TransactionTable({
  transactions,
  transactionsMeta,
  formatTransactionType,
  handleExportCsv,
  loadMoreTransactions,
  onDeleteRequest,
  loading,
  t,
}) {
  return (
    <div className="inset">
      <div className="table-head">
        <h3>{t('Riwayat Transaksi', 'Transaction History')}</h3>
        <button className="button ghost" onClick={handleExportCsv} disabled={loading}>
          {t('Export CSV', 'Export CSV')}
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t('Tanggal', 'Date')}</th>
              <th>{t('Tipe', 'Type')}</th>
              <th>{t('Kategori', 'Category')}</th>
              <th>{t('Nominal', 'Amount')}</th>
              <th>{t('Aksi', 'Action')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {t('Belum ada transaksi.', 'No transactions yet.')}
                </td>
              </tr>
            )}
            {transactions.map((item) => (
              <tr key={item.id}>
                <td>{compactDate(item.transaction_date)}</td>
                <td>{formatTransactionType(item.type)}</td>
                <td>{item.category}</td>
                <td>{currency(item.amount)}</td>
                <td>
                  <button
                    className="button tiny"
                    type="button"
                    onClick={() => onDeleteRequest(item)}
                    disabled={loading}
                    aria-label={`${t('Hapus transaksi', 'Delete transaction')} ${item.category} ${currency(item.amount)}`}
                  >
                    {t('Hapus', 'Delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactionsMeta?.has_more && (
        <div className="load-more-wrap">
          <button
            className="button ghost"
            type="button"
            onClick={() => loadMoreTransactions(transactionsMeta.current_page + 1)}
            disabled={loading}
          >
            {t('Muat Lebih Banyak', 'Load More')}
          </button>
          <small className="helper">
            {transactions.length} / {transactionsMeta.total} {t('transaksi', 'transactions')}
          </small>
        </div>
      )}
    </div>
  )
}
