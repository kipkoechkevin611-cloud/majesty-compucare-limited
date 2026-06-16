'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Loading from '@/components/Loading'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.replace('/login')
    } else {
      router.replace('/dashboard')
    }
  }, [status, router])

  return <Loading />
}
