import { useState, useEffect } from "react"

// components
import Loading from "../../components/common/Loading"

// toastify
import { ToastContainer, toast } from 'react-toastify'

// joi
import Joi from "joi"

// helper
import { validateData } from "../../utils/helper"

// context
import { useOtp } from "../../contexts/OtpContext"
import { useAuth } from "../../contexts/AuthContext"

// axios instance
import axiosInstance from "../../api/axiosInstance"

const OtpVerification = () => {
    const { authUser } = useAuth()
    const { setAccessToken } = useOtp()

    const [otpCode, setOtpCode] = useState('')
    const [verificationId, setVerificationId] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const sentOtpCode = async () => {
        setIsLoading(true)
        try {
            const employeeId = authUser?._id
            const { verificationId } = await axiosInstance.post('/payment/sendOtp', {
                employeeId
            })
            console.log(verificationId)
            setVerificationId(verificationId)
        } catch (error) {
            console.error(error)
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", error.message)
            }
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }

    const verifyOtp = async () => {
         setIsLoading(true)
         try {
            const employeeId = authUser?._id
            const { otpToken } = await axiosInstance.post('/payment/verifyOtp', {
                employeeId,
                otpCode,
                verificationId
            })
            setAccessToken(otpToken)
        } catch (error) {
            console.error(error)
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", error.message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        sentOtpCode()
    }, [])

    return (
        <>
            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Loading */}
            {isLoading && <Loading />}

            <div className="w-full h-[calc(100vh-100px)] flex justify-center items-center">
                <div className="bg-white rounded-sm py-5 px-10 w-[450px]">
                    <h1 className="text-center text-lg text-black font-semibold mb-2">Verification</h1>
                    <p className="text-[#4cbd9b] text-center text-sm text-grey-300">Verification code just sent to your office email</p>
                    <div className="flex space-x-10 my-5">
                        <div className="flex space-x-5">
                            <label htmlFor="" className="label">
                                <span className="labe-text">Enter Code : </span>
                            </label>
                            <input 
                                type="text" 
                                className="input w-[100px]"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                            />
                        </div>
                        <div>
                            <button 
                                className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2" onClick={verifyOtp}
                            >Verify</button>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <span className="text-sm font-semibold text-[#2563EB] cursor-pointer" onClick={sentOtpCode}>Resend OTP</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OtpVerification