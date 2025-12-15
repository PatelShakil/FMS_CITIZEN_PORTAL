export const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'))
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                })
            },
            (error) => {
                let message = 'Unable to get location'

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Location permission denied'
                        break
                    case error.POSITION_UNAVAILABLE:
                        message = 'Location information unavailable'
                        break
                    case error.TIMEOUT:
                        message = 'Location request timed out'
                        break
                }

                reject(new Error(message))
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        )
    })
}

export const getAddressFromCoords = async (latitude, longitude) => {
    try {
        // Use OpenStreetMap Nominatim for reverse geocoding (free)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
        const data = await response.json()

        return {
            formatted: data.display_name,
            city: data.address?.city || data.address?.town || data.address?.village,
            state: data.address?.state,
            country: data.address?.country,
            postcode: data.address?.postcode,
        }
    } catch (error) {
        console.error('Error fetching address:', error)
        return null
    }
}
