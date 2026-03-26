import type { Message } from '@/types'
import styles from './MessageBubble.module.css'

export function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={[styles.bubble, isOwn ? styles.own : styles.other].join(' ')}>
      {message.content}
    </div>
  )
}
