import { useEffect, useState } from "react"

// react router dom
import { useNavigate, useParams } from "react-router-dom"

// components
import Breadcrumbs from "../../components/Breadcrumbs"
import Loading from "../../components/common/Loading"
import Input from "../../components/employee/Input"

// axios instance
import axiosInstance from '../../api/axiosInstance'

// toastify
import { ToastContainer, toast } from 'react-toastify'

// moment
import moment from 'moment'

// Joi
import Joi, { options } from "joi"

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

const LeaveDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { authUser } = useAuth()

    const [leaveDetail, setLeaveDetail] = useState(null)

    const [isLoading, setIsLoading] = useState(false)
    const [breadcrumbItems, setBreadcrumbItems] = useState([])

    const fetchLeaveDetail = async () => {
        setIsLoading(true)
        try {
            const leave = await axiosInstance.get(`/leave/${id}`)
            const period = PERIOD_OPTIONS.filter(option => option.value === leave.period)[0]
            const frmtLeave = {
                id: leave._id,
                employee: {
                    employee_id: leave.employee.employee_id,
                    name: leave.employee.name
                },
                date: leave.date ? moment(leave.date).format('DD/MM/YYYY') : '',
                period: period ? period.label : '',
                status: leave.status,
                reason: leave.reason
            }
            setLeaveDetail(frmtLeave)
            console.log(frmtLeave)
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
        fetchLeaveDetail()
    }, [])

    useEffect(() => {
        if (authUser.role === AUTH_ROLES.ADMIN) {
            setBreadcrumbItems([
                {
                    label: "Leave",
                    to: "/leaveRequestList"
                },
                {
                    label: "Leave Detail"
                }
            ])
        } else if (authUser.role === AUTH_ROLES.EMPLOYEE) {
            setBreadcrumbItems([{
                label: "Leave Detail"
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
                        {/* Employee Id */}
                        <Input
                            label="Employee Id"
                            name="employee_id"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-0 border-b border-b-[#9c9c9c]"
                            value={leaveDetail?.employee?.employee_id}
                            readOnly={true}
                        />

                        {/* Employee Name */}
                        <Input
                            label="Name"
                            name="name"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-0 border-b border-b-[#9c9c9c]"
                            value={leaveDetail?.employee?.name}
                            readOnly={true}
                        />

                        {/* Leave Date */}
                        <Input
                            label="Leave Date"
                            name="date"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-0 border-b border-b-[#9c9c9c]"
                            value={leaveDetail?.date}
                            readOnly={true}
                        />
                    </div>
                    <div>
                        {/* Period */}
                        <Input
                            label="Period"
                            name="period"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-0 border-b border-b-[#9c9c9c]"
                            value={leaveDetail?.period}
                            readOnly={true}
                        />

                        {/* Status */}
                        <Input
                            label="Status"
                            name="status"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-0 border-b border-b-[#9c9c9c]"
                            value={leaveDetail?.status}
                            readOnly={true}
                        />

                        {/* Reason */}
                        <Input
                            label="Reason"
                            name="reason"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-0 border-b border-b-[#9c9c9c]"
                            value={leaveDetail?.reason}
                            readOnly={true}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default LeaveDetail