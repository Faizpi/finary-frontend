import RupiahInput from '../components/RupiahInput'
import { experienceLevelOptions, interestCategoryOptions, skillOptions, visualAssets } from '../constants'

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
            <RupiahInput value={assessmentForm.monthly_income}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, monthly_income: e.target.value }))} placeholder required />
          </label>
          <label>{t('Total Pengeluaran Bulanan (IDR)', 'Total Monthly Expenses (IDR)')}
            <RupiahInput value={assessmentForm.monthly_expense}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, monthly_expense: e.target.value }))} placeholder required />
          </label>
          <label>{t('Tabungan Aktual Bulan Ini (IDR)', 'Actual Savings This Month (IDR)')}
            <RupiahInput value={assessmentForm.actual_savings}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, actual_savings: e.target.value }))} placeholder required />
          </label>
          <label>{t('Target Tabungan / Budget Goal (IDR)', 'Savings Target / Budget Goal (IDR)')}
            <RupiahInput value={assessmentForm.budget_goal}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, budget_goal: e.target.value }))} placeholder required />
          </label>
          <label>{t('Cicilan Hutang / Bulan (IDR)', 'Loan Installment / Month (IDR)')}
            <RupiahInput value={assessmentForm.loan_payment}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, loan_payment: e.target.value }))} placeholder required />
          </label>
          <label>{t('Dana Darurat saat ini (IDR)', 'Emergency Fund (IDR)')}
            <RupiahInput value={assessmentForm.emergency_fund}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, emergency_fund: e.target.value }))} placeholder required />
          </label>

          <hr className="form-divider" />
          <p className="helper form-section-label">{t('Profil Side Hustle', 'Side Hustle Profile')}</p>

          <label>{t('Level Pengalaman', 'Experience Level')}
            <select value={assessmentForm.experience_level}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, experience_level: e.target.value }))}>
              {experienceLevelOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <label>{t('Kategori Minat', 'Interest Category')}
            <select value={assessmentForm.interest_category}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, interest_category: e.target.value }))}>
              <option value="">{t('Pilih kategori minat', 'Pick an interest category')}</option>
              {interestCategoryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <label>{t('Waktu Luang per Minggu (jam)', 'Available Hours per Week')}
            <input type="number" min="0" max="168" value={assessmentForm.available_hours_per_week}
              onChange={(e) => setAssessmentForm((p) => ({ ...p, available_hours_per_week: e.target.value }))}
              placeholder={t('Jam luang yang bisa dipakai', 'Hours you can spare')} />
          </label>
          <fieldset className="skill-chip-group">
            <legend>{t('Keahlian', 'Skills')}</legend>
            <div className="skill-chip-list">
              {skillOptions.map((skill) => {
                const selected = (assessmentForm.skills || []).includes(skill)
                return (
                  <button
                    type="button"
                    key={skill}
                    className={`skill-chip ${selected ? 'on' : ''}`}
                    onClick={() => setAssessmentForm((p) => ({
                      ...p,
                      skills: selected
                        ? p.skills.filter((s) => s !== skill)
                        : [...(p.skills || []), skill],
                    }))}
                    aria-pressed={selected}
                  >
                    {skill}
                  </button>
                )
              })}
            </div>
          </fieldset>

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
              {mlClassifyResult.explanation && (
                <p className="helper">{mlClassifyResult.explanation}</p>
              )}
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
