export default function ConversationPage({
  params,
}: {
  params: { conversationId: string }
}) {
  return (
    <main>
      <h1>Conversación {params.conversationId}</h1>
    </main>
  )
}
