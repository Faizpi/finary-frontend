import { useMemo } from 'react'
import { defaultBadgeIcon, getCurrentMonth, maxBadgeLevel, visualAssets } from '../constants'
import { currency } from '../lib/format'
import { buildPieSlices, getBadgeBaseIcon, getBadgeIcon, getBadgeLevel, getPieBackground } from '../lib/helpers'

export default function DashboardPage({
  assessment,
  badges,
  budgets,
  dashboard,
  emergencyFund,
  isBalanceVisible,
  leaderboard,
  loanPayment,
  setIsBalanceVisible,
  t,
  transactions,
}) {
  const monthlyIncome = Number(dashboard?.summary?.income || 0)
  const monthlyExpense = Number(dashboard?.summary?.expense || 0)
  const monthlyBalance = Number(dashboard?.summary?.balance || 0)
  const monthlySavings = Number(assessment?.actual_savings || 0)
  const savingsTarget = Number(assessment?.budget_goal || 0)
  const monthMax = Math.max(monthlyIncome, monthlyExpense, 1)
  const currentMonth = getCurrentMonth()

  const expenseSlices = useMemo(
    () => buildPieSlices(budgets.map((item) => ({
      label: item.category,
      value: Number(item.spent) || 0,
    }))),
    [budgets],
  )

  const incomeSlices = useMemo(() => {
    const incomeMap = new Map()
    transactions
      .filter((item) => item.type === 'income' && String(item.transaction_date || '').slice(0, 7) === currentMonth)
      .forEach((item) => {
        const key = item.category || t('Lainnya', 'Other')
        const nextValue = (incomeMap.get(key) || 0) + Number(item.amount || 0)
        incomeMap.set(key, nextValue)
      })

    const items = Array.from(incomeMap.entries()).map(([label, value]) => ({
      label,
      value,
    }))

    return buildPieSlices(items)
  }, [transactions, t])

  const expensePieBackground = useMemo(() => getPieBackground(expenseSlices), [expenseSlices])
  const incomePieBackground = useMemo(() => getPieBackground(incomeSlices), [incomeSlices])

  const achievementLevel = useMemo(() => {
    const badgeList = badges?.badges || []
    if (badgeList.length === 0) return 0

    const totalLevel = badgeList.reduce((sum, b) => sum + (b.level || 0), 0)
    const max = badges?.summary?.max_level || maxBadgeLevel
    const avg = totalLevel / badgeList.length
    return Math.max(0, Math.min(max, Math.round(avg)))
  }, [badges])

  const metricSlides = useMemo(
    () => [
      {
        key: 'loan',
        label: t('Cicilan Hutang', 'Loan Installment'),
        value: currency(loanPayment),
        helper: t('Perkiraan cicilan bulanan.', 'Estimated monthly installment.'),
      },
      {
        key: 'emergency',
        label: t('Dana Darurat', 'Emergency Fund'),
        value: currency(emergencyFund),
        helper: t('Dana cadangan yang tersedia.', 'Reserve funds available now.'),
      },
      {
        key: 'savings',
        label: t('Tabungan Bulan Ini', 'Savings This Month'),
        value: currency(monthlySavings),
        helper: t('Mengacu pada asesmen terakhir.', 'Based on your latest assessment.'),
      },
      {
        key: 'target',
        label: t('Target Tabungan', 'Savings Target'),
        value: currency(savingsTarget),
        helper: t('Target tabungan yang ingin dicapai.', 'Savings goal you want to reach.'),
      },
    ],
    [t, loanPayment, emergencyFund, monthlySavings, savingsTarget],
  )

  return (
          <>
            <section className="panel balance-hero">
              <div className="balance-copy">
                <p className="kicker">{t('Saldo Utama', 'Main Balance')}</p>
                <h2>{t('Posisi keuanganmu bulan ini', 'Your financial position this month')}</h2>
                <div className="balance-row">
                  <p className={`balance-amount ${isBalanceVisible ? '' : 'is-hidden'}`}>
                    {isBalanceVisible ? currency(monthlyBalance) : '******'}
                  </p>
                  <button
                    type="button"
                    className="button ghost tiny"
                    onClick={() => setIsBalanceVisible((prev) => !prev)}
                  >
                    {isBalanceVisible ? t('Sembunyikan', 'Hide') : t('Lihat', 'Show')}
                  </button>
                </div>
                <p className="balance-caption">{t('Saldo acuan sebelum pengeluaran berikutnya.', 'Baseline balance before upcoming expenses.')}</p>
                <div className="quick-metrics">
                  <span>{transactions.length} {t('transaksi', 'transactions')}</span>
                  <span>{budgets.length} {t('kantong aktif', 'active pockets')}</span>
                </div>
              </div>
              <div className="balance-art">
                <img
                  src={visualAssets.dashboard}
                  alt={t('Ilustrasi dashboard', 'Dashboard illustration')}
                  loading="lazy"
                />
              </div>
            </section>

            <section className="panel stack">
              <div className="section-head">
                <h3>{t('Ringkasan Cashflow', 'Cashflow Overview')}</h3>
                <p className="helper">
                  {t('Pemasukan dan pengeluaran bulan ini dalam satu tampilan.', 'Income and expense snapshot for this month.')}
                </p>
              </div>
              <div className="split-grid duo dashboard-overview">
                <article className="inset income-pie-card">
                  <div className="pie-wrap">
                    <div className="pie-chart" style={{ background: incomePieBackground }} aria-hidden="true" />
                    <div className="pie-center">
                      <span>{t('Pemasukan', 'Income')}</span>
                      <strong>{currency(incomeSlices.total || monthlyIncome)}</strong>
                    </div>
                  </div>
                  <div className="pie-legend">
                    {incomeSlices.slices.length === 0 ? (
                      <p className="helper">{t('Belum ada pemasukan per kategori bulan ini.', 'No income by category recorded this month.')}</p>
                    ) : (
                      incomeSlices.slices.map((slice) => (
                        <div className="pie-legend-item" key={slice.label}>
                          <span className="pie-dot" style={{ background: slice.color }} />
                          <span>{slice.label}</span>
                          <strong>{currency(slice.value)}</strong>
                        </div>
                      ))
                    )}
                  </div>
                </article>
                <article className="inset expense-pie-card">
                  <div className="pie-wrap">
                    <div className="pie-chart" style={{ background: expensePieBackground }} aria-hidden="true" />
                    <div className="pie-center">
                      <span>{t('Pengeluaran', 'Expense')}</span>
                      <strong>{currency(expenseSlices.total || monthlyExpense)}</strong>
                    </div>
                  </div>
                  <div className="pie-legend">
                    {expenseSlices.slices.length === 0 ? (
                      <p className="helper">{t('Belum ada pengeluaran per kantong bulan ini.', 'No pocket expenses recorded this month.')}</p>
                    ) : (
                      expenseSlices.slices.map((slice) => (
                        <div className="pie-legend-item" key={slice.label}>
                          <span className="pie-dot" style={{ background: slice.color }} />
                          <span>{slice.label}</span>
                          <strong>{currency(slice.value)}</strong>
                        </div>
                      ))
                    )}
                  </div>
                </article>
              </div>
              <div className="metric-carousel" role="list">
                {metricSlides.map((item) => (
                  <article className="metric-slide" key={item.key} role="listitem">
                    <p className="metric-label">{item.label}</p>
                    <strong>{item.value}</strong>
                    <small>{item.helper}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel stack">
              <div className="section-head">
                <h3>{t('Kantong Aktif', 'Active Pockets')}</h3>
                <p className="helper">{budgets.length} {t('kantong terdaftar', 'pockets registered')}</p>
              </div>

              <div className="pocket-grid">
                {budgets.length === 0 && (
                  <article className="pocket-card empty">
                    <strong>{t('Belum ada kantong.', 'No pockets yet.')}</strong>
                    <p>{t('Buka tab Transaksi, lalu tambah kantong budget dulu.', 'Open the Transactions tab and add a budget pocket first.')}</p>
                  </article>
                )}

                {budgets.map((item) => (
                  <article
                    key={item.id}
                    className={`pocket-card ${item.is_overbudget ? 'is-over' : ''}`}
                  >
                    <div className="pocket-head">
                      <strong>{item.category}</strong>
                      <span>{item.period || getCurrentMonth()}</span>
                    </div>
                    <p>{currency(item.spent)} / {currency(item.monthly_limit)}</p>
                    <div className="progress-wrap">
                      <div
                        className={`progress ${item.is_overbudget ? 'danger' : ''}`}
                        style={{ width: `${Math.min(item.progress_percent || 0, 100)}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round(item.progress_percent || 0)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${item.category} ${Math.round(item.progress_percent || 0)}% ${t('terpakai', 'used')}`}
                      />
                    </div>
                    <small>{Math.round(item.progress_percent || 0)}% {t('terpakai', 'used')}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel stack">
              <div className="section-head">
                <h3>{t('Cashflow Bulan Ini', 'This Month Cashflow')}</h3>
                <p className="helper">
                  {t('Perbandingan pemasukan dan pengeluaran bulan berjalan.', 'Income vs expense for the current month.')}
                </p>
              </div>

                <div className="chart-single">
                  <div className="chart-single-row">
                    <span>{t('Pemasukan', 'Income')}</span>
                    <div className="progress-wrap">
                      <div
                        className="progress income"
                        style={{ width: `${(monthlyIncome / monthMax) * 100}%` }}
                        role="progressbar"
                        aria-valuenow={monthlyIncome}
                        aria-valuemin={0}
                        aria-valuemax={monthMax}
                        aria-label={`${t('Pemasukan', 'Income')}: ${monthlyIncome}`}
                      />
                    </div>
                    <strong>{currency(monthlyIncome)}</strong>
                  </div>
                  <div className="chart-single-row">
                    <span>{t('Pengeluaran', 'Expense')}</span>
                    <div className="progress-wrap">
                      <div
                        className="progress expense"
                        style={{ width: `${(monthlyExpense / monthMax) * 100}%` }}
                        role="progressbar"
                        aria-valuenow={monthlyExpense}
                        aria-valuemin={0}
                        aria-valuemax={monthMax}
                        aria-label={`${t('Pengeluaran', 'Expense')}: ${monthlyExpense}`}
                      />
                    </div>
                    <strong>{currency(monthlyExpense)}</strong>
                  </div>
                </div>
            </section>

            <section className="panel stack">
              <div className="split-grid duo dashboard-bottom">
                <article className="inset">
                  <h3>{t('Progress Badge', 'Badge Progress')}</h3>
                  <p>
                    {badges?.summary?.unlocked_count || 0} / {badges?.summary?.total_badges || 0} {t('badge terbuka', 'badges unlocked')}
                  </p>
                  <p className="achievement-level">
                    {t('Level Pencapaian', 'Achievement Level')}: <strong>Lv {achievementLevel}</strong>
                  </p>
                  <div className="badge-grid">
                    {(badges?.badges || []).map((badge) => {
                      const level = getBadgeLevel(badge)

                      return (
                        <div
                            key={badge.key}
                            className={`badge-chip level-${level} ${badge.unlocked ? 'on' : 'locked'}`}
                          >
                            <div className="badge-head">
                              <div className="badge-photo-wrap" aria-hidden="true">
                                {level === 0 ? (
                                  <img
                                    className="badge-photo"
                                    src={defaultBadgeIcon}
                                    alt={`${badge.name} terkunci`}
                                    loading="lazy"
                                  />
                                ) : (
                                  <img
                                    className="badge-photo"
                                    src={getBadgeIcon(badge.key, level)}
                                    data-base-src={getBadgeBaseIcon(badge.key)}
                                    data-fallback-stage="level"
                                    alt={`${badge.name} level ${level}`}
                                    loading="lazy"
                                    onError={(event) => {
                                      const stage = event.currentTarget.dataset.fallbackStage || 'level'
                                      if (stage === 'level') {
                                        event.currentTarget.dataset.fallbackStage = 'base'
                                        event.currentTarget.src = event.currentTarget.dataset.baseSrc || defaultBadgeIcon
                                        return
                                      }

                                      event.currentTarget.onerror = null
                                      event.currentTarget.src = defaultBadgeIcon
                                    }}
                                  />
                                )}
                              </div>
                              <div className="badge-copy">
                                <strong>{badge.name}</strong>
                                <small>{badge.description}</small>
                              </div>
                            </div>

                            <div className="badge-level-row" aria-label={badge.unlocked ? `Level ${level} dari ${maxBadgeLevel}` : 'Terkunci'}>
                              <span className="badge-level-label">{badge.unlocked ? `Lv ${level}` : 'Lv 0'}</span>
                              {badge.unlocked && (
                                <div className="badge-level-track">
                                  {Array.from({ length: maxBadgeLevel }, (_, index) => (
                                    <span
                                      key={`${badge.key}-level-${index + 1}`}
                                      className={`badge-level-dot ${index + 1 <= level ? 'on' : 'off'}`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>

                            <span className={`badge-state ${badge.unlocked ? 'on' : 'off'}`}>
                              {badge.unlocked ? t('Terbuka', 'Unlocked') : t('Terkunci', 'Locked')}
                            </span>
                            {badge.next_target !== null && badge.next_target !== undefined && (
                              <small className="badge-next-target">
                                {t('Progress', 'Progress')}: {badge.progress ?? 0} / {badge.next_target}
                              </small>
                            )}
                            {badge.next_target === null && badge.unlocked && (
                              <small className="badge-next-target maxed">
                                {t('Level maksimal tercapai', 'Max level reached')}
                              </small>
                            )}
                          </div>
                      )
                    })}
                  </div>
                </article>

                <article className="inset leaderboard-panel">
                  <h3>{t('Leaderboard', 'Leaderboard')}</h3>
                  {leaderboard.length === 0 ? (
                    <p className="helper">{t('Belum ada data leaderboard.', 'No leaderboard data yet.')}</p>
                  ) : (
                    <ol className="leaderboard">
                      {leaderboard.map((item) => (
                        <li key={`${item.name}-${item.rank}`}>
                          <span className="leaderboard-user">
                            {item.avatar ? (
                              <img className="leaderboard-avatar" src={item.avatar} alt="" loading="lazy" />
                            ) : (
                              <span className="leaderboard-avatar-fallback">{(item.name || '?')[0].toUpperCase()}</span>
                            )}
                            #{item.rank} {item.name}
                          </span>
                          <strong>{item.discipline_score}</strong>
                        </li>
                      ))}
                    </ol>
                  )}
                </article>
              </div>
            </section>
          </>
  )
}
