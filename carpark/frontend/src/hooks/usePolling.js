import { useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook for polling data at intervals
 */
export const usePolling = (callback, interval, enabled = true) => {
    const savedCallback = useRef()
    const intervalId = useRef()

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval
    useEffect(() => {
        const tick = () => {
            savedCallback.current()
        }

        if (enabled && interval) {
            // Call immediately
            tick()

            // Then set up interval
            intervalId.current = setInterval(tick, interval)

            return () => {
                if (intervalId.current) {
                    clearInterval(intervalId.current)
                }
            }
        }
    }, [interval, enabled])

    // Manual trigger
    const trigger = useCallback(() => {
        if (savedCallback.current) {
            savedCallback.current()
        }
    }, [])

    return { trigger }
}

export default usePolling
