import { useState, useEffect } from "react"

// react-router-dom
import { useNavigate } from 'react-router-dom'

// components
import Loading from "../components/common/Loading"
import PasswordInput from "../components/changePassword/PasswordInput"

// toastify
import { ToastContainer, toast } from 'react-toastify'

// joi
import Joi from "joi"

// helper
import { validateData } from "../utils/helper"

// context
import { useAuth } from "../contexts/AuthContext"

// constants
import { AUTH_ROLES } from "../constants/role"

// axiosInstance
import axiosInstance from "../api/axiosInstance"

const ChangePassword = () => {
    const { authUser } = useAuth()
    const navigate = useNavigate()

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const goToDashboardPage = () => {
        navigate('/')
    }

    const clearErrors = () => {
        setErrors({})
    }

    const onChangeEmpPassword = async () => {
        const data = {
            current_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmPassword
        }

        const changePasswordSchema = Joi.object({
            current_password: Joi.string().required().messages({
                'string.empty': 'Current password is required',
            }),
            new_password: Joi.string()
                .min(5)
                .required()
                .messages({
                    'string.empty': 'New password is required',
                    'string.min': 'New password must be at least 5 characters'
                }),
            confirm_password: Joi.any()
                .valid(Joi.ref('new_password'))
                .required()
                .messages({
                    'any.only': 'Confirm password must match new password',
                    'any.required': 'Confirm password is required',
                }),
        })

        const validationErrors = validateData(changePasswordSchema, data)

        if (validationErrors) {
            setErrors(validationErrors)
            return
        }

        setIsLoading(true)
        try {
            await axiosInstance.post('/employee-auth/change-password', {
                old_password: oldPassword,
                new_password: newPassword
            })
            showToast("success", "Successfully Changed Your Password")
            setTimeout(() => {
                goToDashboardPage()
            }, 600)
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", "Something Went Wrong")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const onChangeAdminPassword = async () => {
        const data = {
            current_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmPassword
        }

        const changePasswordSchema = Joi.object({
            current_password: Joi.string()
                .alphanum() // replaces your regex: only a-z, A-Z, 0-9
                .min(3)
                .max(30)
                .required()
                .messages({
                    'string.empty': 'Current password is required',
                    'string.alphanum': 'Current password must only contain letters and numbers',
                    'string.min': 'Current password must be at least {#limit} characters',
                    'string.max': 'Current password must not exceed {#limit} characters',
                }),

            new_password: Joi.string()
                .alphanum() // same here
                .min(3)
                .max(30)
                .required()
                .messages({
                    'string.empty': 'New password is required',
                    'string.alphanum': 'New password must only contain letters and numbers',
                    'string.min': 'New password must be at least {#limit} characters',
                    'string.max': 'New password must not exceed {#limit} characters',
                }),

            confirm_password: Joi.any()
                .valid(Joi.ref('new_password'))
                .required()
                .messages({
                    'any.only': 'Confirm password must match new password',
                    'any.required': 'Confirm password is required',
                }),
        })

        const validationErrors = validateData(changePasswordSchema, data)

        if (validationErrors) {
            setErrors(validationErrors)
            return
        }

        setIsLoading(true)
        try {
            await axiosInstance.post('/admin-auth/change-password', {
                old_password: oldPassword,
                new_password: newPassword
            })
            showToast("success", "Successfully Changed Your Password")
            setTimeout(() => {
                goToDashboardPage()
            }, 600)
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", "Something Went Wrong")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const onChangePassword = () => {
        clearErrors()

        if (authUser?.role === AUTH_ROLES.EMPLOYEE) {
            onChangeEmpPassword()
        } else {
            onChangeAdminPassword()
        }
    }

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
                    <h1 className="text-center text-lg text-black font-semibold mb-2">Change Password</h1>
                    <p className="text-center text-sm text-grey-300">update your password to keep your account secure</p>

                    {/* current password */}
                    <PasswordInput
                        customClass="mt-5 mb-3"
                        label="Current Password"
                        name="current-password"
                        value={oldPassword}
                        onChangeValue={setOldPassword}
                        error={errors.current_password}
                    />

                    {/* new password */}
                    <PasswordInput
                        customClass="mb-3"
                        label="New Password"
                        name="new-password"
                        value={newPassword}
                        onChangeValue={setNewPassword}
                        error={errors.new_password}
                    />

                    {/* confirm password */}
                    <PasswordInput
                        customClass="mb-3"
                        label="Confirm Password"
                        name="confirm-password"
                        value={confirmPassword}
                        onChangeValue={setConfirmPassword}
                        error={errors.confirm_password}
                    />

                    <div className="flex justify-center mt-5">
                        <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2" onClick={onChangePassword}>Change</button>
                        <button className="bg-soft-green btn text-white border-none w-[120px] py-2" onClick={goToDashboardPage}>Back</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangePassword