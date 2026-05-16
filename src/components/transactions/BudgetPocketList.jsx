import { currency } from '../../lib/format'

/**
 * Budget pockets list with progress bars.
 */
export default function BudgetPocketList({ budgets, t }) {
  return (
    <div className="inset">
      <h3>{t('Kantong Budget', 'Budget Pockets')}</h3>
      {budgets.length === 0 ? (
        <p className="helper">
          {t('Belum ada kantong budget. Tambahkan di atas.', 'No budget pockets yet. Add one above.')}
        </p>
      ) : (
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
                  role="progressbar"
                  aria-valuenow={Math.round(item.progress_percent || 0)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.category} ${Math.round(item.progress_percent || 0)}%`}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
