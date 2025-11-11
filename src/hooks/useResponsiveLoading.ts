import { useTheme } from '@mui/joy'
import { useMediaQuery } from '@mui/system'
import { useCallback } from 'react'

export function useResponsiveLoading() {
    const theme = useTheme()
    

    const isXs = useMediaQuery(theme.breakpoints.down('sm'))       
    const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md')) 
    const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg')) 
    const isLg = useMediaQuery(theme.breakpoints.up('lg'))           


    const getOptimalPageSize = useCallback((scenario: 'initial' | 'scroll' | 'refill' = 'scroll') => {
        if (isXs) {
            return scenario === 'initial' ? 3 : 2
        } else if (isSm) {
            return scenario === 'initial' ? 6 : 4
        } else if (isMd) {
            return scenario === 'initial' ? 6 : 4
        } else {
            return scenario === 'initial' ? 9 : 6
        }
    }, [isXs, isSm, isMd, isLg])

    const getAutoLoadThreshold = useCallback(() => {
        if (isXs) return 2
        if (isSm) return 4  
        if (isMd) return 4
        return 6
    }, [isXs, isSm, isMd, isLg])


    const getScreenSize = useCallback(() => {
        if (isXs) return 'xs'
        if (isSm) return 'sm'
        if (isMd) return 'md'
        return 'lg/xl'
    }, [isXs, isSm, isMd, isLg])

    return {
        isXs,
        isSm, 
        isMd,
        isLg,
        getOptimalPageSize,
        getAutoLoadThreshold,
        getScreenSize
    }
}