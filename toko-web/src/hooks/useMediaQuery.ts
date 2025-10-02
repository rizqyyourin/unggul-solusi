import { useEffect, useState } from 'react'

interface UseMediaQueryOptions {
  breakpoint?: number
}

export function useMediaQuery({ breakpoint = 768 }: UseMediaQueryOptions = {}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return { isMobile }
}