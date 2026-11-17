/** Inline error: icon + text so it never relies on colour alone. */
export default function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="flex items-start gap-2 text-sm font-semibold text-ink">
      <svg className="w-5 h-5 shrink-0 text-plum fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      <span>{children}</span>
    </p>
  );
}
