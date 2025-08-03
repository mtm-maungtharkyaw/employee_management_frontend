import { useEffect, useState } from "react"

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
import { LEAVE_TYPES } from "../../constants/constant"

import { useAuth } from "../../contexts/AuthContext"

const LongTermLeaveRequest = () => {
    const navigate = useNavigate()
    const { authUser } = useAuth()

    const [empOptions, setEmpOptions] = useState([])
    const [selectedEmp, setSelectedEmp] = useState(null)
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [reason, setReason] = useState('')
    const [leaveType, setLeaveType] = useState('')
    const [leaveDays, setLeaveDays] = useState([])
    const [errors, setErrors] = useState(null)

    const [isLoading, setIsLoading] = useState(false)
    const [breadcrumbItems, setBreadcrumbItems] = useState([])

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const clearErrors = () => {
        setErrors(false)
    }

    const goToListPage = () => {
        navigate('/leaveRequestList')
    }

    const onSelectEmployeeId = (id) => {
        const employee = empOptions.filter(option => option._id == id)
        if (employee.length > 0) {
            setSelectedEmp(employee[0])
        }
    }

    const fetchEmployeeOptions = async () => {
        try {
            const { options } = await axiosInstance.get('/employee/options')
            setEmpOptions(options)
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", "Something Went Wrong")
            }
        }
    }


    const showLeaveDays = () => {
        clearErrors()
        setLeaveDays([])

        const data = {
            fromDate,
            toDate,
            reason,
            leaveType
        }

        let validationSchema = Joi.object({
            fromDate: Joi.date().required().messages({
                "any.required": "From Date is required.",
            }),
            toDate: Joi.date().required().messages({
                "any.required": "To Date is required.",
            }),
            reason: Joi.string().required().messages({
                "string.empty": "Reason is required.",
            }),
            leaveType: Joi.string().required().messages({
                "string.empty": "Leave Type is required.",
            })
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

        const startDateMoment = moment(fromDate)
        const endDateMoment = moment(toDate)

        const requestedLeaveDays = []
        let currentDay = startDateMoment.clone()
        while (currentDay.isSameOrBefore(endDateMoment, 'day')) {
            const dayOfWeek = currentDay.day()
            const isWeekEnd = dayOfWeek === 0 || dayOfWeek === 6
            if (!isWeekEnd) { // Exclude weekend
                requestedLeaveDays.push(currentDay.clone().format('YYYY-MM-DD'))
            }
            currentDay.add(1, 'day');
        }

        console.log(requestedLeaveDays)

        setLeaveDays(requestedLeaveDays)
    }

    const requestLeave = async () => {
        setIsLoading(true)
        try {
            const payload = {
                employee_id: authUser?._id,
                start_date: moment(fromDate).toISOString(),
                end_date: moment(toDate).toISOString(),
                reason: reason,
                leave_type: leaveType
            }

            if (authUser.role === AUTH_ROLES.ADMIN) {
                payload.employee_id = selectedEmp?._id
            }

            await axiosInstance.post('/leave/long-term', payload)
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
                    label: "Long Term Leave Request"
                }
            ])
        }

        if (authUser.role === AUTH_ROLES.EMPLOYEE) {
            setBreadcrumbItems([{
                label: "Long Term Leave Request"
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

            <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5 mb-3">
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
                            type="date"
                            label="Request Date"
                            name="request_date"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                            value={moment().format('YYYY-MM-DD')}
                            disabled={true}
                        />

                        <SelectBox
                            label="Leave Type"
                            name="leave_type"
                            options={LEAVE_TYPES}
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            value={leaveType}
                            onChange={setLeaveType}
                            errorMessage={errors?.leaveType}
                        />

                    </div>
                    <div>
                        <Input
                            type="date"
                            label="From Date"
                            name="from_date"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                            value={fromDate}
                            onChange={setFromDate}
                            errorMessage={errors?.fromDate}
                        />

                        <Input
                            type="date"
                            label="To Date"
                            name="to_date"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                            value={toDate}
                            onChange={setToDate}
                            errorMessage={errors?.toDate}
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
                <div className="flex justify-center">
                    <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2 mt-3" onClick={showLeaveDays}>Show</button>
                </div>
            </div>
            <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5">
                <div className="overflow-x-auto  max-w-[70%] mx-auto">
                    <table className="table table-bordered border border-gray-300">
                        {/* head */}
                        <thead>
                            <tr>
                                <th className="border border-gray-300 w-[30%]">Date</th>
                                <th className="border border-gray-300 w-[30%]">Type</th>
                                <th className="border border-gray-300 w-[40%]">Leave Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                leaveDays.map(day => (
                                    <tr key={day}>
                                        <td className="border border-gray-300">{day}</td>
                                        <td className="border border-gray-300">Long Term Leave</td>
                                        <td className="border border-gray-300">{reason}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center items-center mt-3">
                    <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2" onClick={requestLeave}>Request</button>
                    {authUser.role === AUTH_ROLES.ADMIN && (
                        <button className="bg-gray-500  btn text-white border-none w-[120px] py-2" onClick={goToListPage}>Cancel</button>
                    )}
                </div>
            </div>
        </>
    )
}

export default LongTermLeaveRequest