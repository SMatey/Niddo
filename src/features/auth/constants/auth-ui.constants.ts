export const AUTH_UI_STYLES = {
  PAGE_WRAPPER:
    'min-h-screen px-4 py-10 flex items-center justify-center md:px-6',
  CARD: 'w-full max-w-[460px] rounded-2xl border border-white/70 bg-white/85 px-8 py-10 shadow-lg backdrop-blur-xl',
  TITLE: 'mb-2 text-3xl font-extrabold tracking-tight text-text-primary',
  SUBTITLE: 'mb-8 text-sm text-text-secondary',
  FORM: 'flex flex-col gap-5',
  FEEDBACK: 'rounded-xl border border-border bg-surface-muted p-3 text-sm text-text-secondary',
  FORM_ERROR: 'rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-state-error',
  FOOTER: 'mt-6 flex flex-col items-center gap-2 text-sm text-text-secondary',
  FOOTER_CENTER: 'mt-6 flex justify-center text-sm',
  LINK: 'font-semibold text-brand-600 underline-offset-4 transition-colors hover:text-brand-700 hover:underline',
  HINT: 'mt-5 text-xs leading-relaxed text-text-muted',
  DIVIDER_ROW: 'flex items-center gap-3 text-xs text-text-muted',
  DIVIDER_LINE: 'h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent',
  ACTIONS_ROW: 'mt-4 flex flex-wrap gap-4',
} as const
