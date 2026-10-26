'use client'

import { createContext, useState, type FormEvent, type ReactNode } from 'react'

export const FieldErrorsContext = createContext<Record<string, string>>({})

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string }

type ErrorBody = { errors?: Record<string, string>; message?: string }

const isErrorBody = (value: unknown): value is ErrorBody =>
  typeof value === 'object' && value !== null

type EnhancedFormProps = {
  action: string
  submitLabel: string
  successMessage: string
  children: ReactNode
}

const NETWORK_ERROR = 'Une erreur réseau est survenue. Réessayez dans un instant.'

/**
 * A native <form method="post">, so it works without JavaScript (the server answers with a redirect).
 * When JavaScript is available, it submits with fetch, keeps what was typed and shows errors per field.
 */
export function EnhancedForm({ action, submitLabel, successMessage, children }: EnhancedFormProps) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setStatus({ kind: 'sending' })
    setFieldErrors({})

    try {
      const response = await fetch(action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
      const body: unknown = await response.json().catch(() => null)

      if (response.ok) {
        form.reset()
        setStatus({ kind: 'sent' })
        return
      }
      if (isErrorBody(body) && body.errors) {
        setFieldErrors(body.errors)
        setStatus({ kind: 'error', message: 'Certains champs sont à corriger.' })
        return
      }
      setStatus({ kind: 'error', message: isErrorBody(body) && body.message ? body.message : NETWORK_ERROR })
    } catch {
      setStatus({ kind: 'error', message: NETWORK_ERROR })
    }
  }

  return (
    <FieldErrorsContext.Provider value={fieldErrors}>
      <form className="form" method="post" action={action} onSubmit={handleSubmit}>
        {children}

        {/* Honeypot: invisible to people and assistive technology, bots fill it in. */}
        <div className="hp" aria-hidden="true">
          <label>
            Ne pas remplir
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div role="status" aria-live="polite" className="empty:hidden">
          {status.kind === 'sent' && <p className="notice m-0">{successMessage}</p>}
          {status.kind === 'error' && <p className="notice notice-error m-0">{status.message}</p>}
        </div>

        <button className="button" type="submit" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? 'Envoi en cours…' : submitLabel}
        </button>
      </form>
    </FieldErrorsContext.Provider>
  )
}
