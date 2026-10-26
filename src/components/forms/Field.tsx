'use client'

import { useContext, useId } from 'react'
import { FieldErrorsContext } from './EnhancedForm'

type FieldProps = {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'textarea'
  required?: boolean
  autoComplete?: string
  hint?: string
  min?: string | number
  max?: string | number
  maxLength?: number
  rows?: number
}

export function Field({
  name,
  label,
  type = 'text',
  required = false,
  autoComplete,
  hint,
  min,
  max,
  maxLength,
  rows = 5,
}: FieldProps) {
  const id = useId()
  const error = useContext(FieldErrorsContext)[name]
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ')

  const shared = {
    id,
    name,
    required,
    autoComplete,
    maxLength,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy || undefined,
  }

  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : <span className="field-optional"> (facultatif)</span>}
      </label>
      {type === 'textarea' ? (
        <textarea {...shared} rows={rows} />
      ) : (
        <input {...shared} type={type} min={min} max={max} inputMode={type === 'number' ? 'numeric' : undefined} />
      )}
      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}
