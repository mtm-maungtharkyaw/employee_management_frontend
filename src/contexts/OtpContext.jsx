import { useContext, useEffect, useState, createContext } from "react"
import axiosInstance from "../api/axiosInstance"

// create context
export const OtpContext = createContext()

// Custom hook to access the context easily
export const useOtp = () => useContext(OtpContext)

// Otp Provider Component
export const OtpProvider = ({ children }) => {
    const [paymentAccessToken, setPaymentAccessToken] = useState(null)
    const [isCheckingOtp, setIsCheckingOtp] = useState(true)

    useEffect(() => {
        initializePaymentAccessToken()
        axiosInstance.setClearPaymentAccessTokenHandler(clearAccessToken)
        setIsCheckingOtp(false)
    }, [])

    const initializePaymentAccessToken = () => {
        const savedPaymentAccessToken = localStorage.getItem('paymentAccessToken')
        if(savedPaymentAccessToken) {
            setPaymentAccessToken(savedPaymentAccessToken)
        }
    }

    const clearAccessToken = () => {
        setPaymentAccessToken(null)
        localStorage.removeItem('paymentAccessToken')
    }

    const setAccessToken = (token) => {
        setPaymentAccessToken(token)
        localStorage.setItem('paymentAccessToken', token)
    }

    return (
        <OtpContext.Provider
            value={{
                isCheckingOtp,
                paymentAccessToken,
                clearAccessToken,
                setAccessToken
            }}
        >
            {children}
        </OtpContext.Provider>
    )
}