import { visualAssets } from '../constants'

export default function AssessmentPage({
  assessment,
  assessmentForm,
  handleAssessmentSubmit,
  loading,
  mlClassifyResult,
  setAssessmentForm,
  t,
}) {
  return (
    <section className="panel stack">
      <div className="split-grid duo">
        <form className="inset form-grid" onSubmit={handleAssessmentSubmit}>
          <h3>{t('Assessment Finansial', 'Financial Assessment')}</h3>
          <p className="helper">{t('6 field input — dikirim ke model AI (/classify) untuk klasifikasi otomatis.', '6 input fields — sent to the AI model (/classify) for automatic classification.')}</p>

          <label>{t('Pendapatan Bulanan (IDR)', 'Monthly Income (IDR)')}
            <input type="number" min="1" value={assessmentForm.monthly_income}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, monthly_income: e.target.value }))} placeholder={t('Total pemasukan per bulan', 'Total income per month')} required />
          </label>
          <label>{t('Total Pengeluaran Bulanan (IDR)', 'Total Monthly Expenses (IDR)')}
            <input type="number" min="0" value={assessmentForm.monthly_expense}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, monthly_expense: e.target.value }))} placeholder={t('Total pengeluaran per bulan', 'Total spending per month')} required />
          </label>
          <label>{t('Tabungan Aktual Bulan Ini (IDR)', 'Actual Savings This Month (IDR)')}
            <input type="number" min="0" value={assessmentForm.actual_savings}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, actual_savings: e.target.value }))} placeholder={t('Jumlah yang berhasil ditabung', 'Amount you actually saved')} required />
          </label>
          <label>{t('Target Tabungan / Budget Goal (IDR)', 'Savings Target / Budget Goal (IDR)')}
            <input type="number" min="0" value={assessmentForm.budget_goal}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, budget_goal: e.target.value }))} placeholder={t('Target tabungan yang ingin dicapai', 'Your savings goal')} required />
          </label>
          <label>{t('Cicilan Hutang / Bulan (IDR)', 'Loan Installment / Month (IDR)')}
            <input type="number" min="0" value={assessmentForm.loan_payment}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, loan_payment: e.target.value }))} placeholder={t('Total cicilan bulanan, 0 jika tidak ada', 'Total monthly loan, 0 if none')} required />
          </label>
          <label>{t('Dana Darurat saat ini (IDR)', 'Emergency Fund (IDR)')}
            <input type="number" min="0" value={assessmentForm.emergency_fund}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, emergency_fund: e.target.value }))} placeholder={t('Dana cadangan yang kamu punya', 'Emergency reserve you currently have')} required />
          </label>

          <button className="button" disabled={loading}>
            {loading ? t('Menganalisis...', 'Analyzing...') : t('Simpan & Analisis', 'Save & Analyze')}
          </button>
        </form>

        <article className="inset assessment-preview">
          <img
            className="assessment-illustration"
            src={visualAssets.assessment}
            alt={t('Ilustrasi assessment', 'Assessment illustration')}
            loading="lazy"
          />
          <h3>{t('Hasil Klasifikasi AI', 'AI Classification Result')}</h3>
          {mlClassifyResult ? (
            <>
              <div className={`ml-classify-badge ml-${mlClassifyResult.classification}`}>
                {mlClassifyResult.classification?.toUpperCase()}
              </div>
              <p>{t('Kepercayaan', 'Confidence')}: <strong>{(mlClassifyResult.score * 100).toFixed(1)}%</strong></p>
              <p className="helper">{mlClassifyResult.explanation}</p>
              <div className="prob-row">
                {Object.entries(mlClassifyResult.probabilities || {}).map(([k, v]) => (
                  <div key={k} className="prob-item">
                    <span>{k}</span>
                    <div className="progress-wrap">
                      <div className="progress" style={{ width: `${(v * 100).toFixed(0)}%` }} />
                    </div>
                    <small>{(v * 100).toFixed(0)}%</small>
                  </div>
                ))}
              </div>
              <div className="risk-flags">
                <h4>{t('Penanda Risiko', 'Risk Flags')}</h4>
                {Object.entries(mlClassifyResult.risk_flags || {}).map(([k, v]) => (
                  <span key={k} className={`risk-flag ${v ? 'flag-on' : 'flag-off'}`}>
                    {k.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="helper">{t('Kirim form untuk analisis AI real-time.', 'Submit the form for real-time AI analysis.')}</p>
              {assessment && (
                <>
                  <p>{t('Klasifikasi tersimpan', 'Saved classification')}:</p>
                  <div className={`ml-classify-badge ml-${assessment.classification}`}>
                    {(assessment.classification || '-').toUpperCase()}
                  </div>
                </>
              )}
            </>
          )}
        </article>
      </div>
    </section>
  )
}
