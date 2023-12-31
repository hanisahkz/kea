import { Metadata } from 'next'
import IntegrityPage from '@/app/integrity/page'
 
// TODO: do some research on things that are supposed 
// to be put within export default function and those who dont to prevent that function frpm being re-rendered
export const metadata: Metadata = {
  title: `Nurul's Showcase`,
  description: `Nurul's Showcase`,
}
 
export default function HomePage() {
  return <IntegrityPage/>
}