import { Navigate, Outlet } from 'react-router-dom'

import { useOtp } from '../contexts/OtpContext'

const UnVerifiedPaymentAccessGuard = () => {
    const { paymentAccessToken, isCheckingOtp } = useOtp()

    if(isCheckingOtp) return null

    return paymentAccessToken ?  <Navigate to="/employeePaymentShow" replace/> : <Outlet />
}

export default UnVerifiedPaymentAccessGuard