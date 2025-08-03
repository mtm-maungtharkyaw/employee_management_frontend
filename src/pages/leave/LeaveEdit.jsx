import { useEffect, useState } from "react"

// react router dom
import { useNavigate, useParams } from "react-router-dom"

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

import { useAuth } from "../../contexts/AuthContext"

const BREADCRUMB_ITEMS = [{
    label: "Leave",
    to: "/leaveRequestList"
}, {
    label: "Leave Edit"
}]

// constants
import { 
    PERIOD_OPTIONS, 
    LEAVE_STATUS_OPTIONS,
    LEAVE_TYPES
} from "../../constants/constant"

const LeaveEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { authUser } = useAuth()

    const [leaveDetail, setLeaveDetail] = useState(null)

    const [errors, setErrors] = useState(null)

    const [isLoading, setIsLoading] = useState(false)

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const clearErrors = () => {
        setErrors(null)
    }

    const fetchLeaveDetail = async () => {
        setIsLoading(true)
        try {
            const leave = await axiosInstance.get(`/leave/${id}`)
            leave.date = leave.date ? moment(leave.date).format('YYYY-MM-DD') : ''
            setLeaveDetail(leave)
            console.log(leave)
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

    const onChangePeriod = (period) => {
        setLeaveDetail(prev => ({
            ...prev,
            period: period
        }))
    }

    const onChangeStatus = (status) => {
        setLeaveDetail(prev => ({
            ...prev,
            status: status
        }))
    }

    const onChangeReason = (reason) => {
        setLeaveDetail(prev => ({
            ...prev,
            reason: reason
        }))
    }

    const onChangeLeaveType = (type) => {
        setLeaveDetail(prev => ({
            ...prev,
            type: type
        }))
    }

    const goToListPage = () => {
        navigate('/leaveRequestList')
    }

    const updateLeave = async () => {
        clearErrors()
        const data = {
                status: leaveDetail.status,
                period: leaveDetail.period,
                reason: leaveDetail.reason,
                type: leaveDetail.type
            }

        let validationSchema = Joi.object({
            status: Joi.string().required().messages({
                "any.required": "Status is required.",
            }),
            reason: Joi.string().required().messages({
                "string.empty": "Reason is required.",
            }),
            period: Joi.string().required().messages({
                "string.empty": "Period is required.",
            }),
            type: Joi.string().required().messages({
                            "string.empty": "Leave Type is required.",
                        })
        })

        const validationErrors = validateData(validationSchema, data)

        if(validationErrors) {
            setErrors(validationErrors)
            return
        }

        setIsLoading(true)
        try {
            const payload = {
                status: leaveDetail.status,
                period: leaveDetail.period,
                reason: leaveDetail.reason,
                leave_type: leaveDetail.type
            }
            await axiosInstance.put(`/leave/update/${id}`, payload)
            showToast("success", "Successfully Updated")
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", "Something went wrong")
            }
        } finally {
            setIsLoading(false)
            goToListPage()
        }
    }

    useEffect(() => {
        fetchLeaveDetail()
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

            {/* Breadcrumbs */}
            <Breadcrumbs items={BREADCRUMB_ITEMS} />

            <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-[100px]">
                    <div>
                        {/* Employee Id */}
                        <Input
                            label="Employee Id"
                            name="employee_id"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                            value={leaveDetail?.employee?.employee_id}
                            disabled={true}
                        />

                        {/* Employee Name */}
                        <Input
                            label="Name"
                            name="name"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                            value={leaveDetail?.employee.name}
                            disabled={true}
                        />

                        {/* date */}
                        <Input
                            type="date"
                            label="Leave Date"
                            name="leave_date"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                            value={leaveDetail?.date}
                            disabled={true}
                        />
                    </div>
                    <div>
                        <SelectBox
                            label="Period"
                            options={PERIOD_OPTIONS}
                            name="period"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            value={leaveDetail?.period}
                            onChange={onChangePeriod}
                            errorMessage={errors?.period}
                        />
                        
                        <SelectBox
                            label="Status"
                            options={LEAVE_STATUS_OPTIONS}
                            name="status"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            value={leaveDetail?.status}
                            onChange={onChangeStatus}
                            errorMessage={errors?.status}
                        />

                        <SelectBox
                            label="Leave Type"
                            options={LEAVE_TYPES}
                            name="status"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            value={leaveDetail?.type}
                            onChange={onChangeLeaveType}
                            errorMessage={errors?.type}
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
                                        onChange={e => onChangeReason(e.target.value)}
                                        value={leaveDetail?.reason}
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
                    <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2" onClick={updateLeave}>Update</button>
                    <button className="bg-gray-500  btn text-white border-none w-[120px] py-2" onClick={goToListPage}>Cancel</button>
                </div>
            </div>
        </>
    )
}

export default LeaveEdit