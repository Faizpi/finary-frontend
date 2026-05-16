import RupiahInput from '../RupiahInput'

/**
 * Budget pocket creation form.
 */
export default function BudgetForm({
  budgetForm,
  setBudgetForm,
  handleBudgetSubmit,
  loading,
  t,
}) {
  return (
    <form className="inset form-grid compact" onSubmit={handleBudgetSubmit}>
      <h3>{t('Tambah Kantong Budget', 'Add Budget Pocket')}</h3>
      <label>
        {t('Kategori', 'Category')}
        <input
          list="category-list"
          value={budgetForm.category}
          onChange={(e) => setBudgetForm((prev) => ({ ...prev, category: e.target.value }))}
          placeholder={t('Nama kantong budget', 'Budget pocket name')}
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
        <RupiahInput
          value={budgetForm.monthly_limit}
          onChange={(e) => setBudgetForm((prev) => ({ ...prev, monthly_limit: e.target.value }))}
          placeholder
          required
        />
      </label>
      <button className="button" disabled={loading}>
        {t('Simpan Budget', 'Save Budget')}
      </button>
    </form>
  )
}
