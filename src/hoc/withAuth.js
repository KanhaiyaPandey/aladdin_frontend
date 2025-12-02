'use client'

import LoadingScreen from '@/components/LoadingScreen'
import { useUser } from '@/context/UserContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function withAuth(Component) {
  return function ProtectedPage(props) {
    const { user_info, loading } = useUser()
    const router = useRouter()
    const search = useSearchParams()

    useEffect(() => {
      if (!loading && !user_info) {
        const current = search.toString()
        router.push(`/login?redirectTo=${window.location.pathname}?${current}`)
      }
    }, [loading, user_info, router])

    if (loading) return <div className="text-center p-10"><LoadingScreen/></div>

    if (!user_info) return null // prevent flashing

    return <Component {...props} />
  }
}
