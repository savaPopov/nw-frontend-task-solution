import { useState, useEffect, useCallback } from 'react'
import { BannerDto } from '../services/dto/banner.dto'

export const bannerValidationRules = {
    link: (value: string) => {
        if (!value) return 'Link URL is required'
        if (!isValidUrl(value)) return 'Please enter a valid URL for the link'
        return ''
    },

    imageUrl: (value: string) => {
        if (!value) return 'Image URL is required'
        if (!isValidUrl(value)) return 'Please enter a valid URL for the image'
        return ''
    }
}

function isValidUrl(string: string): boolean {
    try {
        new URL(string)
        return true
    } catch (_) {
        return false
    }
}

export const useBannerFormValidation = (values: BannerDto) => {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const validateField = useCallback((name: string, value: string) => {
        if (bannerValidationRules[name as keyof typeof bannerValidationRules]) {
            return bannerValidationRules[name as keyof typeof bannerValidationRules](value)
        }
        return ''
    }, [])

    useEffect(() => {
        const newErrors: Record<string, string> = {}
        Object.keys(touched).forEach(key => {
            if (touched[key]) {
                newErrors[key] = validateField(key, values[key as keyof BannerDto] as string)
            }
        })
        setErrors(newErrors)
    }, [values, touched, validateField])

    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {}
        Object.keys(values).forEach(key => {
            newErrors[key] = validateField(key, values[key as keyof BannerDto] as string)
        })
        return newErrors
    }, [values, validateField])

    const isFormValid = useCallback(() => {
        const formErrors = validateForm()
        return !Object.values(formErrors).some(error => error)
    }, [validateForm])

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target
        setTouched(prev => ({ ...prev, [name]: true }))
    }, [])

    const markAllTouched = useCallback(() => {
        const newTouched: Record<string, boolean> = {}
        const newErrors: Record<string, string> = {}

        Object.keys(values).forEach(key => {
            newTouched[key] = true
            newErrors[key] = validateField(key, values[key as keyof BannerDto] as string)
        })

        setTouched(newTouched)
        setErrors(newErrors)

        return newErrors
    }, [values, validateField])

    return {
        errors,
        touched,
        handleBlur,
        markAllTouched,
        isFormValid,
        setErrors,
        setTouched
    }
}