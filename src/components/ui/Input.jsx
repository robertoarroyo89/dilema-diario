// Campo de texto con material de cristal.
export default function Input({ label, id, className = '', ...props }) {
  return (
    <label htmlFor={id} className="block">
      {label && (
        <span className="mb-2 block text-xs font-500 uppercase tracking-wider text-ink-faint">
          {label}
        </span>
      )}
      <input
        id={id}
        className={
          'glass w-full rounded-2xl px-4 py-3.5 text-ink placeholder:text-ink-faint ' +
          'transition-all focus:border-white/25 focus:bg-white/10 focus:outline-none ' +
          className
        }
        {...props}
      />
    </label>
  )
}
