import { LandingPage } from '@/components/LandingPage'
import { PressHighlights } from '@/components/PressHighlights'

export default async function Home() {
  return (
    <div className="bg-[#0020FF]">
      <LandingPage />
      <PressHighlights />
    </div>
  )
}
