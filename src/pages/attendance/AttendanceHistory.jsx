import { useEffect, useState } from "react"

// momment
import moment from "moment"

// components
import Breadcrumbs from "../../components/Breadcrumbs"
import Loading from "../../components/common/Loading"
import Pagination from "../../components/common/Pagination"

// axios instance
import axiosInstance from "../../api/axiosInstance"

// toastify
import { ToastContainer, toast } from 'react-toastify'

import { useAuth } from "../../contexts/AuthContext"

const BREADCRUMB_ITEMS = [{
    label: "Attendance History"
}]

const AttendanceHistory = () => {
    const { authUser } = useAuth()

    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [attendances, setAttendances] = useState([])
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

        fetchAttendance(fromStr, toStr)
    };

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const onPageChange = (page) => {
        fetchAttendance(fromDate, toDate, "", page, pagination.limit)
    }

    const fetchAttendance = async (from, to, status = "", page = 1, limit = 10) => {
        setIsLoading(true);

        try {
            const payload = {
                employee_id: authUser?._id,
                from_date: moment(from).toISOString(),
                to_date: moment(to).toISOString(),
                page,
                limit
            };

            const { attendances, pagination } = await axiosInstance.post('/attendance/by-employee', payload);
            setAttendances(attendances)
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
            setIsLoading(false);
        }
    };

    const searchAttendance = () => {
        fetchAttendance(fromDate, toDate, "", 1, pagination.limit)
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

                    <button className="btn bg-[#4caf93] text-white border-none" onClick={searchAttendance}>Search</button>
                </div>
            </div>
            {(!isLoading && attendances.length == 0) && (
                <h1>There is no attendance lists</h1>
            )}
            {(!isLoading && attendances.length > 0) && (
                <div>
                    <div className="overflow-x-auto rounded-sm border border-[#e6e5e5] bg-[#fefefe]">
                        <table className="table">
                            {/* head */}
                            <thead className="bg-gray-100 text-[#00836b] text-sm font-bold">
                                <tr>
                                    <th>No</th>
                                    <th>Employee Id</th>
                                    <th>Name</th>
                                    <th>Record Date</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Attendance Type</th>
                                    <th>Note</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {
                                    attendances.map((attendance, index) => (
                                        <tr key={attendance.date} className="hover:bg-gray-50 border-b border-[#e6e5e5]">
                                            <th>{(pagination.page - 1) * pagination.limit + index + 1}</th>
                                            <td>{attendance.employee?.employee_id}</td>
                                            <td>{attendance.employee?.name}</td>
                                            <td>{attendance?.date ? moment(attendance?.date).format('YYYY/MM/DD') : ''}</td>
                                            <td>{attendance?.check_in ? moment(attendance.check_in).format('hh:mm A') : ''}</td>
                                            <td>{attendance.check_out ? moment(attendance.check_out).format('hh:mm A') : ''}</td>
                                            <td>{attendance?.status}</td>
                                            <td>{attendance?.notes}</td>
                                            <td></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    {/* pagination */}
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}

        </>
    )
}

export default AttendanceHistory