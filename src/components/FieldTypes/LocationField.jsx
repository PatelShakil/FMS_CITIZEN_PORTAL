import { useState, useEffect } from 'react'
import { useFormStore } from '../../store/formStore'
import { useGeolocation } from '../../hooks/useGeolocation'
import Label from '../UI/Label'
import Button from '../UI/Button'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MapPinIcon,
    ArrowPathIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline'

const LocationField = ({ field }) => {
    const answer = useFormStore((state) => state.getAnswer(field.fieldId))
    const setAnswer = useFormStore((state) => state.setAnswer)
    const error = useFormStore((state) => state.errors[field.fieldId])
    const clearError = useFormStore((state) => state.clearError)

    const { location, isLoading, fetchLocation } = useGeolocation(false)
    const [hasLocation, setHasLocation] = useState(false)

    useEffect(() => {
        if (location) {
            setAnswer(field.fieldId, location)
            setHasLocation(true)
            clearError(field.fieldId)
        }
    }, [location, field.fieldId, setAnswer, clearError])

    const handleGetLocation = async () => {
        try {
            await fetchLocation()
        } catch (err) {
            console.error('Location error:', err)
        }
    }

    const handleClear = () => {
        setAnswer(field.fieldId, null)
        setHasLocation(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
        >
            <Label required={field.required}>{field.fieldLabel}</Label>

            <AnimatePresence mode="wait">
                {!hasLocation || !answer ? (
                    <motion.div
                        key="get-location"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Button
                            variant="outline"
                            fullWidth
                            size="lg"
                            onClick={handleGetLocation}
                            loading={isLoading}
                            disabled={isLoading}
                            icon={<MapPinIcon className="w-5 h-5" />}
                        >
                            {isLoading ? 'Getting Location...' : 'Get Current Location'}
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="location-display"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-3"
                    >
                        {/* Location Details */}
                        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-green-900 mb-1">
                                        Location Captured
                                    </p>
                                    {answer.address && (
                                        <p className="text-sm text-green-700 mb-2">
                                            {answer.address}
                                        </p>
                                    )}
                                    <div className="grid grid-cols-2 gap-2 text-xs text-green-600">
                                        <div>
                                            <span className="font-medium">Latitude:</span>{' '}
                                            {answer.latitude?.toFixed(6)}
                                        </div>
                                        <div>
                                            <span className="font-medium">Longitude:</span>{' '}
                                            {answer.longitude?.toFixed(6)}
                                        </div>
                                        <div className="col-span-2">
                                            <span className="font-medium">Accuracy:</span>{' '}
                                            ±{answer.accuracy?.toFixed(1)}m
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Preview (if coordinates exist) */}
                        {answer.latitude && answer.longitude && (
                            <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                                <iframe
                                    title="location-map"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${answer.longitude - 0.01},${answer.latitude - 0.01},${answer.longitude + 0.01},${answer.latitude + 0.01}&layer=mapnik&marker=${answer.latitude},${answer.longitude}`}
                                    allowFullScreen
                                />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleGetLocation}
                                loading={isLoading}
                                icon={<ArrowPathIcon className="w-4 h-4" />}
                            >
                                Refresh
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleClear}
                            >
                                Clear
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {field.helpText && !error && (
                <p className="help-text">{field.helpText}</p>
            )}

            {error && <p className="error-text">{error}</p>}
        </motion.div>
    )
}

export default LocationField
