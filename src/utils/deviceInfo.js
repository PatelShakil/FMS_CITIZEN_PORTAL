export const getDeviceInfo = () => {
    const userAgent = navigator.userAgent
    const platform = navigator.platform

    // Detect device type
    let deviceType = 'DESKTOP'
    if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
        if (/iPad|Tablet/i.test(userAgent)) {
            deviceType = 'TABLET'
        } else {
            deviceType = 'MOBILE'
        }
    }

    // Detect browser
    let browser = 'Unknown'
    if (userAgent.includes('Chrome')) browser = 'Chrome'
    else if (userAgent.includes('Safari')) browser = 'Safari'
    else if (userAgent.includes('Firefox')) browser = 'Firefox'
    else if (userAgent.includes('Edge')) browser = 'Edge'
    else if (userAgent.includes('Opera')) browser = 'Opera'

    // Detect platform/OS
    let os = 'Unknown'
    if (platform.includes('Win')) os = 'Windows'
    else if (platform.includes('Mac')) os = 'macOS'
    else if (platform.includes('Linux')) os = 'Linux'
    else if (/Android/i.test(userAgent)) os = 'Android'
    else if (/iPhone|iPad|iPod/i.test(userAgent)) os = 'iOS'

    return {
        userAgent,
        platform: os,
        browser,
        deviceType,
    }
}

export const getIPAddress = async () => {
    try {
        // Use a free IP detection service
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        return data.ip
    } catch (error) {
        console.error('Error fetching IP:', error)
        return null
    }
}
