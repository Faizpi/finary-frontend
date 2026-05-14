import { compactDate, currency } from '../lib/format'

export default function TransactionsPage({
  assessment,
  budgetForm,
  budgets,
  emergencyFund,
  emergencyUpdateValue,
  formatTransactionType,
  handleBudgetSubmit,
  handleDeleteTransaction,
  handleEmergencyUpdateSubmit,
  handleExportCsv,
  handleLoanUpdateSubmit,
  handleTransactionSubmit,
  loading,
  loanPayment,
  loanUpdateValue,
  pocketOptions,
  selectedPocketCategory,
  setBudgetForm,
  setEmergencyUpdate,
  setLoanUpdate,
  setTransactionForm,
  t,
  transactionForm,
  transactions,
}) {
  return (
    <section className="panel stack">
      <div className="split-grid transactions-grid">
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
            <p className="helper">{t('Tambah kantong budget dulu agar transaksi bisa dipilih dari dropdown.', 'Create a budget pocket first so you can select it here.')}</p>
          )}
          <label>
            {t('Nominal', 'Amount')}
            <input
              type="number"
              min="1"
              value={transactionForm.amount}
              onChange={(e) => setTransactionForm((prev) => ({ ...prev, amount: e.target.value }))}
              required
            />
          </label>
          <label>
            {t('Tanggal', 'Date')}
            <input
              type="date"
              value={transactionForm.transaction_date}
              onChange={(e) =>
                setTransactionForm((prev) => ({ ...prev, transaction_date: e.target.value }))
              }
              required
            />
          </label>
          <label>
            {t('Catatan', 'Notes')}
            <textarea
              value={transactionForm.note}
              onChange={(e) => setTransactionForm((prev) => ({ ...prev, note: e.target.value }))}
            />
          </label>
          <button className="button" disabled={loading || pocketOptions.length === 0}>
            {t('Simpan Transaksi', 'Save Transaction')}
          </button>
        </form>

        <div className="inset">
          <h3>{t('Kantong Budget', 'Budget Pockets')}</h3>
          <form className="form-grid compact" onSubmit={handleBudgetSubmit}>
            <label>
              {t('Kategori', 'Category')}
              <input
                list="category-list"
                value={budgetForm.category}
                onChange={(e) => setBudgetForm((prev) => ({ ...prev, category: e.target.value }))}
                required
              />
            </label>
            <label>
              {t('Periode (YYYY-MM)', 'Period (YYYY-MM)')}
              <input
                type="month"
                value={budgetForm.period}
                onChange={(e) => setBudgetForm((prev) => ({ ...prev, period: e.target.value }))}
                required
              />
            </label>
            <label>
              {t('Limit Bulanan', 'Monthly Limit')}
              <input
                type="number"
                min="1"
                value={budgetForm.monthly_limit}
                onChange={(e) =>
                  setBudgetForm((prev) => ({ ...prev, monthly_limit: e.target.value }))
                }
                required
              />
            </label>
            <button className="button" disabled={loading}>{t('Simpan Budget', 'Save Budget')}</button>
          </form>

          <div className="budget-list">
            {budgets.map((item) => (
              <article key={item.id} className="budget-item">
                <div>
                  <strong>{item.category}</strong>
                  <p>{currency(item.spent)} / {currency(item.monthly_limit)}</p>
                </div>
                <div className="progress-wrap">
                  <div
                    className={`progress ${item.is_overbudget ? 'danger' : ''}`}
                    style={{ width: `${Math.min(item.progress_percent, 100)}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="split-grid duo transaction-extra">
        <form className="inset form-grid compact" onSubmit={handleLoanUpdateSubmit}>
          <h3>{t('Cicilan Hutang', 'Loan Installment')}</h3>
          <p className="helper">{t('Perbarui cicilan bulanan dari assessment.', 'Update monthly installments from your assessment.')}</p>
          <label>
            {t('Nominal', 'Amount')}
            <input
              type="number"
              min="0"
              value={loanUpdateValue}
              onChange={(e) => setLoanUpdate(e.target.value)}
              required
            />
          </label>
          <p className="helper">
            {t('Nilai saat ini', 'Current value')}: <strong>{currency(loanPayment)}</strong>
          </p>
          <button className="button" disabled={loading || !assessment}>
            {t('Simpan', 'Save')}
          </button>
          {!assessment && (
            <p className="helper">{t('Lengkapi assessment dulu agar bisa diperbarui.', 'Complete the assessment before updating this value.')}</p>
          )}
        </form>

        <form className="inset form-grid compact" onSubmit={handleEmergencyUpdateSubmit}>
          <h3>{t('Dana Darurat', 'Emergency Fund')}</h3>
          <p className="helper">{t('Perbarui dana darurat terbaru dari assessment.', 'Update your latest emergency fund value.')}</p>
          <label>
            {t('Nominal', 'Amount')}
            <input
              type="number"
              min="0"
              value={emergencyUpdateValue}
              onChange={(e) => setEmergencyUpdate(e.target.value)}
              required
            />
          </label>
          <p className="helper">
            {t('Nilai saat ini', 'Current value')}: <strong>{currency(emergencyFund)}</strong>
          </p>
          <button className="button" disabled={loading || !assessment}>
            {t('Simpan', 'Save')}
          </button>
          {!assessment && (
            <p className="helper">{t('Lengkapi assessment dulu agar bisa diperbarui.', 'Complete the assessment before updating this value.')}</p>
          )}
        </form>
      </div>

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
              {transactions.map((item) => (
                <tr key={item.id}>
                  <td>{compactDate(item.transaction_date)}</td>
                  <td>{formatTransactionType(item.type)}</td>
                  <td>{item.category}</td>
                  <td>{currency(item.amount)}</td>
                  <td>
                    <button
                      className="button tiny"
                      onClick={() => handleDeleteTransaction(item.id)}
                      disabled={loading}
                    >
                      {t('Hapus', 'Delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
