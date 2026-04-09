import type { Message } from '@/types'

export function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  const alignmentClasses = isOwn
    ? 'self-end rounded-br-sm bg-brand-600 text-white'
    : 'self-start rounded-bl-sm bg-surface-muted text-text-primary'

  return (
    <div className={['max-w-[70%] rounded-lg px-4 py-3 text-sm', alignmentClasses].join(' ')}>
      {message.content}
    </div>
  )
}
