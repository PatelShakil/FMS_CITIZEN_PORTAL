import { useState, useEffect, useCallback } from 'react'
import { getCurrentPosition, getAddressFromCoords } from '../utils/geolocation'
import { useFormStore } from '../store/formStore'
import toast from 'react-hot-toast'

export const useGeolocation = (autoFetch = false) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const setLocation = useFormStore((state) => state.setLocation)
    const location = useFormStore((state) => state.location)

    const fetchLocation = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const position = await getCurrentPosition()

            // Get address from coordinates
            const address = await getAddressFromCoords(
                position.latitude,
                position.longitude
            )

            const locationData = {
                latitude: position.latitude,
                longitude: position.longitude,
                accuracy: position.accuracy,
                address: address?.formatted || '',
            }

            setLocation(locationData)
            toast.success('Location captured successfully')

            return locationData
        } catch (err) {
            setError(err.message)
            toast.error(err.message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [setLocation])

    useEffect(() => {
        if (autoFetch && !location) {
            fetchLocation()
        }
    }, [autoFetch, location, fetchLocation])

    return {
        location,
        isLoading,
        error,
        fetchLocation,
        clearLocation: () => setLocation(null),
    }
}
