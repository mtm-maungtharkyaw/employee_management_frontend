// react
import { useState } from "react"

import { NavLink } from 'react-router-dom'

// joi validation
import Joi from "joi"

// components
import Input from "../components/common/Input"
import Loading from "../components/common/Loading"

// api
import axiosInstance from "../api/axiosInstance"

// helper
import { validateData } from "../utils/helper"

// toastify
import { ToastContainer, toast } from 'react-toastify';

import { useAuth } from "../contexts/AuthContext"

const EmployeeLogin = () => {
    const [loginId, setLoginId] = useState('E00002')
    const [password, setPassword] = useState('6(&MoE#)icdi#')
    const [errors, setErrors] = useState({
        loginId: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)

    const authCtx = useAuth()

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const clearErrorMessage = () => {
        setErrors({
            loginId: "",
            password: ""
        })
    }

    const login = async () => {
        clearErrorMessage()
        const validationSchema = Joi.object({
            loginId: Joi.string().required(),
            password: Joi.string().required(),
        })

        const validationErrors = validateData(validationSchema, {
            loginId,
            password
        })

        if (validationErrors) {
            setErrors(validationErrors)
            return
        }

        setLoading(true)
        try {
            const { user, accessToken } = await axiosInstance.post('/employee-auth/login', {
                employee_id: loginId,
                password
            })
            user.role = 'employee'
            authCtx.login(user, accessToken)
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* loading */}
            {loading && <Loading />}

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
                theme="colored"
            />

            <div className="bg-white w-full min-h-[100vh] flex justify-center items-center">
                <div>
                    <h1 className="text-black text-center text-[32px] font-semibold mb-3">Employee Management System</h1>
                    <div className="p-8 bg-white rounded-sm w-[450px] border border-[#e0e0e0]">
                        <Input
                            label="LoginID"
                            name="login-id"
                            placeholder="Enter Your Login Id"
                            labelClassName="text-black"
                            inputClassName="w-full bg-white border border-2 border-[#e0e0e0]"
                            containerClassName="mb-5"
                            value={loginId}
                            onChange={setLoginId}
                            error={errors.loginId}
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter Your Password"
                            labelClassName="text-black"
                            inputClassName="w-full bg-white border border-2 border-[#e0e0e0]"
                            containerClassName="mb-5"
                            value={password}
                            onChange={setPassword}
                            error={errors.password}
                        />

                        <button className="bg-soft-green btn text-white border-none w-full mb-2" onClick={login}>Sign In</button>

                        <p className="text-center">
                            <NavLink to="/admin-login" className="text-sm font-semibold text-[#2563EB]">
                                Sign in as Admin
                            </NavLink>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmployeeLogin