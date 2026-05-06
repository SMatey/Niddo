'use client'

import { Hero, SearchBar, FeaturedProperties, FeaturedRoomies } from '@/features/home'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col px-4 bg-gradient-to-b from-surface to-background">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center pt-20 pb-12">
          <div className="w-full max-w-4xl mx-auto space-y-8 text-center">
            <Hero />
            <div className="pt-8">
              <SearchBar />
            </div>
          </div>
        </div>

        {/* Featured Sections */}
        <div className="w-full max-w-6xl mx-auto">
          <FeaturedProperties />
          <FeaturedRoomies />
        </div>
      </main>
    </div>
  )
}
