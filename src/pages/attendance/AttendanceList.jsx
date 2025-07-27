import { useEffect, useState } from "react"

// react router dom
import { useNavigate } from "react-router-dom"

// components
import Breadcrumbs from "../../components/Breadcrumbs"
import Loading from "../../components/common/Loading"
import Pagination from "../../components/common/Pagination"
import Button from "../../components/common/Button"

// icons
import { IoAddCircle } from "react-icons/io5"
import { FaEdit } from "react-icons/fa"
import { RiDeleteBin5Line } from "react-icons/ri"

// toastify
import { ToastContainer, toast } from 'react-toastify'

// moment
import moment from "moment"

// axios instance
import axiosInstance from "../../api/axiosInstance"

const BREADCRUMB_ITEMS = [{
    label: "Attendance List"
}]

const AttendanceList = () => {
    const nevigate = useNavigate()

    const [date, setDate] = useState('')
    const [attendances, setAttendances] = useState([])
    const [pagination, setPagination] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const goToAttendnaceListReportPage = () => {
        nevigate('/attendanceListReport')
    }

    const searchAttendance = () => {
        fetchAttendance(date, 1, pagination.limit)
    }

    const fetchAttendance = async (date, page = 1, limit = 10) => {
        const payload = {
            date,
            page,
            limit
        }

        setIsLoading(true)
        try {
            const { attendances, pagination } = await axiosInstance.post('/attendance/by-date', payload)
            setAttendances(attendances)
            setPagination(pagination)
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
        const todayDate = moment().startOf('day')
        setDate(todayDate.format('YYYY-MM-DD'))
        fetchAttendance(todayDate.toISOString())
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

            <div className='flex justify-between items-end mb-5'>
                {/* Filter Options */}
                <div className='filter flex items-end space-x-2'>
                    <div>
                        <label htmlFor="" className='block mb-1'>Date</label>
                        <input
                            type="date"
                            placeholder="Enter Date"
                            className="input bg-white w-[200px]"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <button className="btn bg-[#4caf93] text-white border-none" onClick={searchAttendance}>Search</button>
                </div>
                <div>
                    <Button
                        text='Report'
                        onClick={goToAttendnaceListReportPage}
                        icon={<IoAddCircle size={22} />}
                    />
                </div>
            </div>

            {(!isLoading && attendances.length == 0) && (
                <h1>There is no attendance lists</h1>
            )}

            {(!isLoading && attendances.length > 0) && (
                <div>
                    <div className="overflow-x-auto rounded-sm border border-[#e6e5e5] bg-[#fefefe]">
                        <table className='table'>
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
                                        <tr key={attendance._id} className="hover:bg-gray-50 border-b border-[#e6e5e5]">
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
                        {/* pagination */}
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default AttendanceList