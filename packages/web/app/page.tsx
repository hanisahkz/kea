import { Metadata } from 'next'
import IntegrityPage from '@/app/integrity/page'
 
export const metadata: Metadata = {
  title: `Nurul's Portfolio`,
  description: `Nurul's Portfolio`,
}
 
export default function HomePage() {
  return <IntegrityPage/>
}