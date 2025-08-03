import { Navigate, Outlet } from 'react-router-dom'

import { useOtp } from '../contexts/OtpContext'

const VerifiedPaymentAccessGuard = () => {
    const { paymentAccessToken, isCheckingOtp } = useOtp()

    if(isCheckingOtp) return null

    return paymentAccessToken ?  <Outlet /> : <Navigate to="/otpVerification" replace />
}

export default VerifiedPaymentAccessGuard