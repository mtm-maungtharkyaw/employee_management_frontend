import { useEffect, useState } from "react"

// react router dom
import { useNavigate } from "react-router-dom"

// components
import Breadcrumbs from "../../components/Breadcrumbs"
import Loading from "../../components/common/Loading"
import Input from "../../components/employee/Input"
import SelectBox from "../../components/employee/SelectBox"

// axios instance
import axiosInstance from '../../api/axiosInstance'

// toastify
import { ToastContainer, toast } from 'react-toastify'

// moment
import moment from 'moment'

// Joi
import Joi from "joi"

// helper
import { validateData } from "../../utils/helper"

// constants
import { AUTH_ROLES } from "../../constants/role"

import { useAuth } from "../../contexts/AuthContext"

const PERIOD_OPTIONS = [
    {
        label: 'Morning',
        value: 'morning'
    },
    {
        label: 'Evening',
        value: 'afternoon'
    },
    {
        label: 'Full',
        value: 'full_day'
    }
]

const SingleLeaveRequest = () => {
    const navigate = useNavigate()
    const { authUser } = useAuth()

    const [empOptions, setEmpOptions] = useState([])
    const [selectedEmp, setSelectedEmp] = useState(null)
    const [date, setDate] = useState('')
    const [period, setPeriod] = useState('')
    const [reason, setReason] = useState('')
    const [errors, setErrors] = useState(null)

    const [isLoading, setIsLoading] = useState(false)
    const [breadcrumbItems, setBreadcrumbItems] = useState([])

    const BREADCRUMB_ITEMS = [{
        label: "Single Leave Request"
    }]

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const onSelectEmployeeId = (id) => {
        const employee = empOptions.filter(option => option._id == id)
        if (employee.length > 0) {
            setSelectedEmp(employee[0])
        }
    }

    const clearErrors = () => {
        setErrors(false)
    }

    const fetchEmployeeOptions = async () => {
        try {
            const { options } = await axiosInstance.get('/employee/options')
            setEmpOptions(options)
            console.log(options)
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", "Something Went Wrong")
            }
        }
    }

    const goToListPage = () => {
        navigate('/leaveRequestList')
    }

    const requestLeave = async () => {
        clearErrors()

        const data = {
            date,
            reason,
            period
        }

        let validationSchema = Joi.object({
            date: Joi.date().required().messages({
                "any.required": "Leave Date is required.",
            }),
            reason: Joi.string().required().messages({
                "string.empty": "Reason is required.",
            }),
            period: Joi.string().required().messages({
                "string.empty": "Period is required.",
            }),
        })

        if (authUser.role === AUTH_ROLES.ADMIN) {
            data.employee_id = selectedEmp?._id

            validationSchema = validationSchema.append({
                employee_id: Joi.string().required().messages({
                    "string.empty": "Employee Id is required.",
                })
            });
        }

        const validationErrors = validateData(validationSchema, data)

        if (validationErrors) {
            setErrors(validationErrors)
            return
        }

        setIsLoading(true)
        try {
            const payload = {
                reason: reason,
                period: period,
                date: moment(date).toISOString()
            }

            if (authUser.role === AUTH_ROLES.ADMIN) {
                payload.employee_id = selectedEmp?._id
            } else {
                payload.employee_id = authUser?._id
            }
            await axiosInstance.post('/leave/single', payload)
            showToast("success", "Successfully requested leave")
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", "Something went wrong")
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (authUser.role === AUTH_ROLES.ADMIN) {
            fetchEmployeeOptions()
            setBreadcrumbItems([
                {
                    label: "Leave",
                    to: "/leaveRequestList"
                },
                {
                    label: "Single Leave Request"
                }
            ])
        }

        if (authUser.role === AUTH_ROLES.EMPLOYEE) {
            setBreadcrumbItems([{
                label: "Single Leave Request"
            }])
        }
    }, [authUser.role])

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

            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} />

            <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-[100px]">
                    <div>
                        {authUser.role === AUTH_ROLES.EMPLOYEE && (
                            <Input
                                label="Employee Id"
                                name="employee_id"
                                containerClassName="mb-5"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                value={authUser?.employee_id}
                                disabled={true}
                            />
                        )}

                        {authUser.role === AUTH_ROLES.ADMIN && (
                            <SelectBox
                                label="Employee Id"
                                name="employee_id"
                                options={empOptions.map(option => ({ label: option.employee_id, value: option._id }))}
                                containerClassName="mb-5"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={selectedEmp ? selectedEmp._id : ''}
                                onChange={onSelectEmployeeId}
                                errorMessage={errors?.employee_id}
                            />
                        )}

                        {authUser.role === AUTH_ROLES.EMPLOYEE && (
                            <Input
                                label="Name"
                                name="name"
                                containerClassName="mb-5"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                value={authUser?.name}
                                disabled={true}
                            />
                        )}

                        {authUser.role === AUTH_ROLES.ADMIN && (
                            <Input
                                label="Name"
                                name="name"
                                containerClassName="mb-5"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                value={selectedEmp ? selectedEmp.name : ''}
                                disabled={true}
                            />
                        )}

                        <Input
                            label="Leave Type"
                            name="leave_type"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                            value="Single Leave"
                            disabled={true}
                        />

                        <Input
                            type="date"
                            label="Leave Date"
                            name="leave_date"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-b border-b-[#9c9c9c]"
                            value={date}
                            onChange={setDate}
                            errorMessage={errors?.date}
                        />
                    </div>
                    <div>
                        <SelectBox
                            label="Period"
                            options={PERIOD_OPTIONS}
                            name="period"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            value={period}
                            onChange={setPeriod}
                            errorMessage={errors?.period}
                        />

                        <div className="mb-5 form-control w-full">
                            <div className="flex items-start justify-between">
                                <div>
                                    <label htmlFor="reason" className="labe">
                                        <span className="label-text text-[#5c5c5c] text-sm">Reason</span>
                                    </label>
                                </div>
                                <div className="w-[70%]">
                                    <textarea
                                        className="textarea  w-full bg-white border border-b-[#9c9c9c] rounded-none focus:outline-none focus:border-inherit"
                                        placeholder="Reason"
                                        onChange={e => setReason(e.target.value)}
                                        value={reason}
                                    >
                                    </textarea>
                                </div>
                            </div>
                            {errors?.reason && (
                                <div className="flex">
                                    <div className="w-[30%]"></div>
                                    <div>
                                        <small className="text-[#fc1303]">{errors?.reason}</small>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2" onClick={requestLeave}>Request</button>
                    <button className="bg-gray-500  btn text-white border-none w-[120px] py-2" onClick={goToListPage}>Cancel</button>
                </div>
            </div>
        </>
    )
}

export default SingleLeaveRequest