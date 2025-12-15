import { useQuery, useMutation } from '@tanstack/react-query'
import { qrService } from '../api/qrService'
import { useFormStore } from '../store/formStore'
import { useEffect } from 'react'
import { getDeviceInfo } from '../utils/deviceInfo'

export const useQRScan = (qrCodeSlug) => {
    const setQRData = useFormStore((state) => state.setQRData)

    // Fetch QR data
    const query = useQuery({
        queryKey: ['qr-scan', qrCodeSlug],
        queryFn: () => qrService.scanQR(qrCodeSlug),
        enabled: !!qrCodeSlug,
        retry: 1,
    })

    // Track scan mutation
    const trackScanMutation = useMutation({
        mutationFn: (metadata) => qrService.trackScan(qrCodeSlug, metadata),
    })

    useEffect(() => {
        if (query.data?.data) {
            // console.log('QR scan data:', query.data.data)
            setQRData(query.data?.data)

            // Track scan with device info
            const deviceInfo = getDeviceInfo()
            trackScanMutation.mutate({
                deviceType: deviceInfo.deviceType,
                browser: deviceInfo.browser,
                platform: deviceInfo.platform,
            })
        }
    }, [query.data])

    return {
        qrData: query.data?.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    }
}
