import { useCallback } from 'react'
import { reportApi } from '../lib/api'
import { getCurrentMonth } from '../constants'

/**
 * Handles CSV report export.
 */
export function useReportActions({ setLoading, setError, setMessage, t }) {
  const handleExportCsv = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const exportMonth = getCurrentMonth()
      const response = await reportApi.exportCsv(exportMonth)

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `finary-transactions-${exportMonth}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      setMessage(t('Laporan CSV berhasil diunduh.', 'CSV report downloaded successfully.'))
    } catch (err) {
      setError(err?.response?.data?.message || t('Gagal export report.', 'Failed to export report.'))
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setMessage, t])

  return { handleExportCsv }
}
