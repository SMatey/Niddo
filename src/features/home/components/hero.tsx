import { HOME_DATA } from '../home.data'

export function Hero() {
  const { title, titleHighlight, titleEnd, description } = HOME_DATA.hero

  return (
    <div className="space-y-4">
      <h1 className="text-5xl md:text-6xl font-bold">
        {title}
        <span className="text-brand-600">{titleHighlight}</span>
        {titleEnd}
      </h1>

      <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  )
}
