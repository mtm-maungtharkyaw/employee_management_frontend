import { useEffect, useState } from "react"

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

const BREADCRUMB_ITEMS = [{
    label: "Leave History"
}]

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

const LEAVE_STATUSES = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
}

const LeaveHistory = () => {
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [leaveDays, setLeaveDays] = useState([])
    const [pagination, setPagination] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const init = () => {
        const firstDay = moment().startOf('month')
        const lastDay = moment().endOf('month')

        // Helper to check if day is weekend (Sat=6, Sun=0)
        const isWeekend = (day) => {
            const dayOfWeek = day.day()
            return dayOfWeek === 0 || dayOfWeek === 6
        };

        // Adjust first day if it's a weekend
        let from = firstDay.clone()
        while (isWeekend(from)) {
            from.add(1, 'day')
        }

        // Adjust last day if it's a weekend
        let to = lastDay.clone()
        while (isWeekend(to)) {
            to.subtract(1, 'day')
        }

        const fromStr = from.format('YYYY-MM-DD')
        const toStr = to.format('YYYY-MM-DD')

        setFromDate(fromStr)
        setToDate(toStr)
        fetchLeaveRequest(fromStr, toStr, 1, 10)
    }

    const fetchLeaveRequest = async (from, to, page = 1, limit = 10) => {
        setIsLoading(true)

        try {
            const payLoad = {
                start_date: from,
                end_date: to,
                page,
                limit
            }

            const { leaves, pagination } = await axiosInstance.post('/leave/by-employee', payLoad)
            console.log(leaves)
            setLeaveDays(leaves)
            setPagination(pagination)
        } catch (error) {
            console.error('Fetch attendance error:', error);
            // Optionally: show toast or fallback UI

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

    const searchLeaveRequest = () => {
        fetchLeaveRequest(fromDate, toDate, 1, pagination.limit)
    }

    useEffect(() => {
        init()
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

            <div className='flex justify-start items-end mb-5'>
                {/* Filter Options */}
                <div className='filter flex items-end space-x-2'>
                    <div>
                        <label htmlFor="" className='block mb-1'>From Date</label>
                        <input
                            type="date"
                            placeholder="Enter From Date"
                            className="input bg-white w-[200px]"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="" className='block mb-1'>To Date</label>
                        <input
                            type="date"
                            placeholder="Enter To Date"
                            className="input bg-white w-[200px]"
                            value={toDate}
                            onChange={e => setToDate(e.target.value)}
                        />
                    </div>

                    <button className="btn bg-[#4caf93] text-white border-none" onClick={searchLeaveRequest}>Search</button>
                </div>
            </div>

            {(!isLoading && leaveDays.length == 0) && (
                <h1>There is no leave request lists</h1>
            )}

            {(!isLoading && leaveDays.length > 0) && (
                <div>
                    <div className="overflow-x-auto rounded-sm border border-[#e6e5e5] bg-[#fefefe]">
                        <table className="table">
                            {/* head */}
                            <thead className="bg-gray-100 text-[#00836b] text-sm font-bold">
                                <tr>
                                    <th>No</th>
                                    <th>Employee Id</th>
                                    <th>Name</th>
                                    <th>Leave Date</th>
                                    <th>Period</th>
                                    <th>Requested At</th>
                                    <th>Status</th>
                                    <th>Leave Reason</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {
                                    leaveDays.map((leaveDay, index) => {
                                        const id = (pagination.page - 1) * pagination.limit + index + 1
                                        const name = leaveDay.employee?.name
                                        const employee_id = leaveDay.employee?.employee_id
                                        const date = leaveDay.date ? moment(leaveDay.date).format('DD/MM/YYYY') : ''
                                        let period = PERIOD_OPTIONS.filter(option => option.value === leaveDay.period)
                                        period = period.length > 0 ? period[0].label : ''
                                        const requestedAt = moment(leaveDay.createdAt).format('DD/MM/YYYY')
                                        const status = leaveDay.status
                                        const reason = leaveDay.reason
                                        return (
                                            <tr key={leaveDay._id} className="hover:bg-gray-50 border-b border-[#e6e5e5]">
                                                <th>{id}</th>
                                                <td>{employee_id}</td>
                                                <td>{name}</td>
                                                <td>{date}</td>
                                                <td>{period}</td>
                                                <td>{requestedAt}</td>
                                                <td className="uppercase">{status}</td>
                                                <td>{reason}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    )
}

export default LeaveHistory