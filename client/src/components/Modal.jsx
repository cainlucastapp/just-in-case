// client/src/components/Modal.jsx

import { useLayoutEffect, useRef } from 'react'
import '../styles/modal.css'

// show modal
export function Modal({ onClose, label = 'Dialog', children }) {
  const dialogRef = useRef(null)

  // open on mount, restore focus to the trigger on close
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    const trigger = document.activeElement
    dialog.showModal()
    dialog.querySelector('[data-autofocus]')?.focus()
    return () => {
      dialog.close()
      if (trigger instanceof HTMLElement) trigger.focus()
    }
  }, [])

  // escape close, vetoable by the caller
  function handleCancel(event) {
    event.preventDefault()
    onClose()
  }

  // click outside the content box
  function handleClick(event) {
    if (event.target === dialogRef.current) onClose()
  }

  // keep tab focus inside the dialog
  function handleKeyDown(event) {
    if (event.key !== 'Tab') return
    const focusable = dialogRef.current.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-label={label}
      onCancel={handleCancel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="modal-content">{children}</div>
    </dialog>
  )
}
