import RupiahInput from '../RupiahInput'
import { currency } from '../../lib/format'

/**
 * Loan installment and emergency fund quick-update forms.
 */
export default function FinancialUpdateForms({
  assessment,
  loanPayment,
  loanUpdateValue,
  setLoanUpdate,
  handleLoanUpdateSubmit,
  emergencyFund,
  emergencyUpdateValue,
  setEmergencyUpdate,
  handleEmergencyUpdateSubmit,
  loading,
  t,
}) {
  return (
    <div className="split-grid duo transaction-extra">
      <form className="inset form-grid compact" onSubmit={handleLoanUpdateSubmit}>
        <h3>{t('Cicilan Hutang', 'Loan Installment')}</h3>
        <p className="helper">
          {t('Perbarui cicilan bulanan dari assessment.', 'Update monthly installments from your assessment.')}
        </p>
        <label>
          {t('Nominal', 'Amount')}
          <RupiahInput
            value={loanUpdateValue}
            onChange={(e) => setLoanUpdate(e.target.value)}
            placeholder
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
          <p className="helper">
            {t('Lengkapi assessment dulu agar bisa diperbarui.', 'Complete the assessment before updating this value.')}
          </p>
        )}
      </form>

      <form className="inset form-grid compact" onSubmit={handleEmergencyUpdateSubmit}>
        <h3>{t('Dana Darurat', 'Emergency Fund')}</h3>
        <p className="helper">
          {t('Perbarui dana darurat terbaru dari assessment.', 'Update your latest emergency fund value.')}
        </p>
        <label>
          {t('Nominal', 'Amount')}
          <RupiahInput
            value={emergencyUpdateValue}
            onChange={(e) => setEmergencyUpdate(e.target.value)}
            placeholder
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
          <p className="helper">
            {t('Lengkapi assessment dulu agar bisa diperbarui.', 'Complete the assessment before updating this value.')}
          </p>
        )}
      </form>
    </div>
  )
}
