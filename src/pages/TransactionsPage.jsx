import { useState } from 'react'
import BudgetForm from '../components/transactions/BudgetForm'
import BudgetPocketList from '../components/transactions/BudgetPocketList'
import DeleteTransactionModal from '../components/transactions/DeleteTransactionModal'
import FinancialUpdateForms from '../components/transactions/FinancialUpdateForms'
import TransactionForm from '../components/transactions/TransactionForm'
import TransactionTable from '../components/transactions/TransactionTable'

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
  loadMoreTransactions,
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
  transactionsMeta,
}) {
  const [transactionToDelete, setTransactionToDelete] = useState(null)

  const confirmDeleteTransaction = async () => {
    if (!transactionToDelete) return
    await handleDeleteTransaction(transactionToDelete.id)
    setTransactionToDelete(null)
  }

  return (
    <section className="panel stack">
      <div className="split-grid transactions-grid">
        <TransactionForm
          transactionForm={transactionForm}
          setTransactionForm={setTransactionForm}
          pocketOptions={pocketOptions}
          selectedPocketCategory={selectedPocketCategory}
          handleTransactionSubmit={handleTransactionSubmit}
          loading={loading}
          t={t}
        />

        <BudgetForm
          budgetForm={budgetForm}
          setBudgetForm={setBudgetForm}
          handleBudgetSubmit={handleBudgetSubmit}
          loading={loading}
          t={t}
        />
      </div>

      <BudgetPocketList budgets={budgets} t={t} />

      <FinancialUpdateForms
        assessment={assessment}
        loanPayment={loanPayment}
        loanUpdateValue={loanUpdateValue}
        setLoanUpdate={setLoanUpdate}
        handleLoanUpdateSubmit={handleLoanUpdateSubmit}
        emergencyFund={emergencyFund}
        emergencyUpdateValue={emergencyUpdateValue}
        setEmergencyUpdate={setEmergencyUpdate}
        handleEmergencyUpdateSubmit={handleEmergencyUpdateSubmit}
        loading={loading}
        t={t}
      />

      <TransactionTable
        transactions={transactions}
        transactionsMeta={transactionsMeta}
        formatTransactionType={formatTransactionType}
        handleExportCsv={handleExportCsv}
        loadMoreTransactions={loadMoreTransactions}
        onDeleteRequest={setTransactionToDelete}
        loading={loading}
        t={t}
      />

      <DeleteTransactionModal
        transaction={transactionToDelete}
        onConfirm={confirmDeleteTransaction}
        onCancel={() => setTransactionToDelete(null)}
        loading={loading}
        t={t}
      />
    </section>
  )
}
