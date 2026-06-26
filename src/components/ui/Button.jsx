// Botón estilo iOS: forma de píldora, material según variante, rebote al pulsar.
export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-600 ' +
    'transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary: 'bg-white text-canvas hover:bg-white/90 shadow-glass-sm',
    ghost: 'glass text-ink hover:bg-white/10',
    danger: 'glass text-ink-muted hover:text-ink',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}
