import Modal from './Modal.jsx'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Are you sure?'}>
      <p className="text-sm text-ink/65">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-full border border-forest-100 px-5 py-2.5 text-sm font-semibold text-ink/70 hover:bg-haze-100"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </Modal>
  )
}
