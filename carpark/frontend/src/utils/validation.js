import { VALIDATION } from './constants'

/**
 * Validate email format
 */
export const validateEmail = email => {
    if (!email) return 'Email is required'
    if (!VALIDATION.EMAIL_REGEX.test(email)) return 'Invalid email format'
    return null
}

/**
 * Validate password
 */
export const validatePassword = password => {
    if (!password) return 'Password is required'
    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
        return `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
    }
    return null
}

/**
 * Validate phone number
 */
export const validatePhone = phone => {
    if (!phone) return 'Phone number is required'
    if (!VALIDATION.PHONE_REGEX.test(phone)) {
        return 'Invalid phone number format (10 digits required)'
    }
    return null
}

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} is required`
    }
    return null
}

/**
 * Validate form with multiple fields
 */
export const validateForm = (values, rules) => {
    const errors = {}

    Object.keys(rules).forEach(field => {
        const validator = rules[field]
        const error = validator(values[field])
        if (error) {
            errors[field] = error
        }
    })

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    }
}
