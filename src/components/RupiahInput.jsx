import { currency } from '../lib/format'

/**
 * Controlled numeric input that displays formatted Rupiah while editing.
 * `value` is always a raw number (or empty string).
 * `onChange` receives a synthetic-like event with `{ target: { value: rawNumber } }`.
 */
export default function RupiahInput({
  value,
  onChange,
  placeholder,
  min = 0,
  required,
  disabled,
  id,
  className,
}) {
  const isEmpty = value === '' || value === undefined || value === null

  const formatDisplay = (raw) => {
    if (isEmpty) return ''
    return currency(raw)
  }

  const parseRaw = (displayValue) => {
    const digits = displayValue.replace(/\D/g, '')
    if (!digits) return ''
    return Number(digits)
  }

  const handleChange = (e) => {
    const raw = parseRaw(e.target.value)
    onChange({ target: { value: raw } })
  }

  // When required and empty, render an invisible required-paired input so the
  // browser's required validation triggers correctly even though the visible
  // input is type="text".
  return (
    <>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        className={className}
        value={formatDisplay(value)}
        onChange={handleChange}
        placeholder={placeholder ? 'Rp0,00' : ''}
        min={min}
        disabled={disabled}
        aria-required={required ? 'true' : undefined}
      />
      {required && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          required
          value={isEmpty ? '' : '1'}
          onChange={() => {}}
          style={{
            position: 'absolute',
            opacity: 0,
            height: 0,
            width: 0,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  )
}
