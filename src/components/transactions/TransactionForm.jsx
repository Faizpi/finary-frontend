import RupiahInput from '../RupiahInput'

/**
 * Transaction input form.
 */
export default function TransactionForm({
  transactionForm,
  setTransactionForm,
  pocketOptions,
  selectedPocketCategory,
  handleTransactionSubmit,
  loading,
  t,
}) {
  return (
    <form className="inset form-grid" onSubmit={handleTransactionSubmit}>
      <h3>{t('Input Transaksi', 'Add Transaction')}</h3>
      <label>
        {t('Tipe', 'Type')}
        <select
          value={transactionForm.type}
          onChange={(e) => setTransactionForm((prev) => ({ ...prev, type: e.target.value }))}
        >
          <option value="income">{t('Pemasukan', 'Income')}</option>
          <option value="expense">{t('Pengeluaran', 'Expense')}</option>
        </select>
      </label>
      <label>
        {t('Kantong', 'Pocket')}
        <select
          value={selectedPocketCategory}
          onChange={(e) => setTransactionForm((prev) => ({ ...prev, category: e.target.value }))}
          disabled={pocketOptions.length === 0}
          required
        >
          {pocketOptions.length === 0 && (
            <option value="">{t('Belum ada kantong', 'No pockets yet')}</option>
          )}
          {pocketOptions.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      {pocketOptions.length === 0 && (
        <p className="helper">
          {t('Tambah kantong budget dulu agar transaksi bisa dipilih dari dropdown.', 'Create a budget pocket first so you can select it here.')}
        </p>
      )}
      <label>
        {t('Nominal', 'Amount')}
        <RupiahInput
          value={transactionForm.amount}
          onChange={(e) => setTransactionForm((prev) => ({ ...prev, amount: e.target.value }))}
          placeholder
          required
        />
      </label>
      <label>
        {t('Tanggal', 'Date')}
        <input
          type="date"
          value={transactionForm.transaction_date}
          onChange={(e) => setTransactionForm((prev) => ({ ...prev, transaction_date: e.target.value }))}
          required
        />
      </label>
      <label>
        {t('Catatan', 'Notes')}
        <textarea
          value={transactionForm.note}
          onChange={(e) => setTransactionForm((prev) => ({ ...prev, note: e.target.value }))}
          placeholder={t('Keterangan tambahan jika diperlukan', 'Additional notes if needed')}
        />
      </label>
      <button className="button" disabled={loading || pocketOptions.length === 0}>
        {t('Simpan Transaksi', 'Save Transaction')}
      </button>
    </form>
  )
}
