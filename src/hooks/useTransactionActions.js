import { useCallback } from 'react'
import { transactionApi } from '../lib/api'

/**
 * Handles transaction CRUD actions.
 */
export function useTransactionActions({
  transactionForm,
  setTransactionForm,
  pocketOptions,
  selectedPocketCategory,
  guardedAction,
  setError,
  setMessage,
  t,
}) {
  const handleTransactionSubmit = useCallback(async (event) => {
    event.preventDefault()

    if (pocketOptions.length === 0) {
      setError(t('Buat kantong budget dulu sebelum menambah transaksi.', 'Create a budget pocket first before adding transactions.'))
      setMessage('')
      return
    }

    await guardedAction(async () => {
      await transactionApi.create({
        ...transactionForm,
        category: selectedPocketCategory,
        amount: Number(transactionForm.amount),
      })
      setTransactionForm((prev) => ({ ...prev, amount: '', note: '' }))
    }, t('Transaksi baru sudah ditambahkan.', 'New transaction added.'))
  }, [transactionForm, setTransactionForm, pocketOptions, selectedPocketCategory, guardedAction, setError, setMessage, t])

  const handleDeleteTransaction = useCallback(async (id) => {
    await guardedAction(
      () => transactionApi.remove(id),
      t('Transaksi berhasil dihapus.', 'Transaction deleted successfully.'),
    )
  }, [guardedAction, t])

  return { handleTransactionSubmit, handleDeleteTransaction }
}
