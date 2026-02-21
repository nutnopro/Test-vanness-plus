import { useEffect, useRef } from 'react'

export default function ConfirmModal({
    isOpen,
    onConfirm,
    onCancel,
    title = 'Confirm Delete',
    message = 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    variant = 'danger', // 'danger' | 'warning'
}) {
    const modalRef = useRef(null)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onCancel()
        }
        if (isOpen) window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onCancel])

    if (!isOpen) return null

    const variantStyles = {
        danger: {
            icon: (
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            ),
            iconBg: 'bg-red-50',
            confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        },
        warning: {
            icon: (
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            ),
            iconBg: 'bg-amber-50',
            confirmBtn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
        },
    }

    const v = variantStyles[variant] || variantStyles.danger

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onCancel}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto transform transition-all duration-300 animate-modal-pop"
                style={{
                    animation: 'modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                }}
            >
                {/* Top accent bar */}
                <div className={`h-1 rounded-t-2xl ${variant === 'danger' ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-amber-400 to-amber-600'}`} />

                <div className="p-6">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className={`w-14 h-14 rounded-full ${v.iconBg} flex items-center justify-center ring-8 ${variant === 'danger' ? 'ring-red-50' : 'ring-amber-50'}`}>
                            {v.icon}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-gray-500 text-center leading-relaxed mb-6">
                        {message}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 active:scale-95"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 ${v.confirmBtn}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes modalPop {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
        </div>
    )
}
