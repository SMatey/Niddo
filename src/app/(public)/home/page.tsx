"use client"

import { Hero, SearchBar } from '@/features/home'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-surface to-background">
        <div className="w-full max-w-4xl mx-auto space-y-8 text-center">
          <Hero />
          <div className="pt-8">
            <SearchBar />
          </div>
        </div>
      </main>
    </div>
  )
}
