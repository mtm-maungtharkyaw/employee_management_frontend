import { useState, useEffect } from "react"

// react router dom
import { useNavigate, useParams } from "react-router-dom"

// Auth Context
import { useAuth } from "../../contexts/AuthContext"

// constants
import { AUTH_ROLES } from "../../constants/role"

// axios instance
import axiosInstance from './../../api/axiosInstance'

// components
import Breadcrumbs from "../../components/Breadcrumbs"
import Loading from "../../components/common/Loading"

// toastify
import { ToastContainer, toast } from 'react-toastify'

// constants
import { ATTENDANCE_STATUS } from "../../constants/constant"

// moment
import moment from "moment"

// joi
import Joi from "joi"

// helper
import { validateData } from "../../utils/helper"

const AttendanceEdit = () => {
    const navigate = useNavigate()
    const { attendanceId } = useParams()
    const { authUser } = useAuth()

    const [attendance, setAttendance] = useState(null)
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

    const fetchAttendance = async (attendance_id) => {
        try {
            const result = await axiosInstance.get(`/attendance/${attendance_id}`)
            setAttendance({
                ...result,
                check_in: result.check_in ? moment(result.check_in).format('HH:mm') : '',
                check_out: result.check_out ? moment(result.check_out).format('HH:mm') : ''
            })
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", error.message)
            }
        }
    }

    const onChangeStatus = (status) => {
        setAttendance(prevAtt => ({
            ...prevAtt,
            status: status
        }))
    }

    const onChangeCheckInTime = (time) => {
        setAttendance(prevAtt => ({
            ...prevAtt,
            check_in: time
        }))
    }

    const onChangeCheckOutTime = (time) => {
        setAttendance(prevAtt => ({
            ...prevAtt,
            check_out: time
        }))
    }

    const onChangeNote = (note) => {
        setAttendance(prevAtt => ({
            ...prevAtt,
            notes: note
        }))
    }

    const goToHistoryPage = () => {
        navigate('/attendanceHistory')
    }

    const goToListPage = () => {
        navigate('/attendanceList', {
            state: { date : moment(attendance.date).format('YYYY-MM-DD')}
        })
    }

    const goBack = () => {
        authUser.role === AUTH_ROLES.ADMIN ? goToListPage() : goToHistoryPage()
    }

    const updateAttendance = async () => {
        const validationSchema = Joi.object({
            checkIn: Joi.string().required(),
            checkOut: Joi.string().required(),
            status: Joi.string().required()
        })

        const validationErrors = validateData(validationSchema, {
            checkIn: attendance.check_in,
            checkOut: attendance.check_out,
            status: attendance.status
        })

        if (validationErrors) {
            setErrors(validationErrors)
            return
        }

        const date = moment(attendance.date).format('YYYY-MM-DD')
        const checkInUTC = moment(`${date} ${attendance.check_in}`, 'YYYY-MM-DD HH:mm')
            .utc()
            .toISOString()

        const checkOutUTC = moment(`${date} ${attendance.check_out}`, 'YYYY-MM-DD HH:mm')
            .utc()
            .toISOString()

        const payload = {
            check_in: checkInUTC,
            check_out: checkOutUTC,
            status: attendance.status,
            notes: attendance.notes
        }

        setIsLoading(true)
        const start = Date.now()
        try {
            await axiosInstance.put(`/attendance/${attendance._id}`, payload)
            showToast("success", "Successfully Updated Attedance")
            const elapsed = Date.now() - start
            const delay = Math.max(1000 - elapsed, 0)
            setTimeout(() => {
                setIsLoading(false)
                if(authUser?.role === AUTH_ROLES.ADMIN) {
                    goToListPage()
                } else {
                    goToHistoryPage()
                }
            }, delay)
        } catch (error) {
            setIsLoading(false)
            console.log(error)
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", error.message)
            }
        }

    }


    useEffect(() => {
        fetchAttendance(attendanceId)
        if (authUser.role === AUTH_ROLES.ADMIN) {
            setBreadcrumbItems([{
                label: "Attendance",
                to: "/attendanceList"
            }, {
                label: "Edit"
            }])
        } else {
            setBreadcrumbItems([{
                label: "Attendance Edit"
            }])
        }
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
            <Breadcrumbs items={breadcrumbItems} />

            <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5">

                {/* Employee */}
                <div className="mb-8">
                    <div className="flex items-center">
                        <div className="w-[200px]">
                            <label htmlFor="" className="label">
                                <span className="label-text">Employee Id: </span>
                            </label>
                        </div>
                        <div>
                            <input
                                type="text"
                                className="input w-[200px] dark-blue"
                                value={attendance?.employee?.employee_id}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Employee */}
                <div className="mb-8">
                    <div className="flex items-center">
                        <div className="w-[200px]">
                            <label htmlFor="" className="label">
                                <span className="label-text">Employee: </span>
                            </label>
                        </div>
                        <div>
                            <input
                                type="text"
                                className="input w-[200px] dark-blue"
                                value={attendance?.employee?.name}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Date */}
                <div className="mb-8">
                    <div className="flex items-center">
                        <div className="w-[200px]">
                            <label htmlFor="" className="label">
                                <span className="label-text">Date: </span>
                            </label>
                        </div>
                        <div>
                            <span className="dark-blue">{attendance?.date ? moment(attendance.date).format('YYYY/MM/DD') : ''}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="mb-6">
                        <label htmlFor="" className="label">
                            <span className="label-text">Shift Time: </span>
                        </label>
                    </div>

                    {/* check in */}
                    <div className="mb-6">
                        <div className="flex items-center">
                            <div className="w-[200px]">
                                <label htmlFor="" className="label">
                                    <span className="label-text">Check In: </span>
                                </label>
                            </div>
                            <div>
                                <input type="time" placeholder="Type here" className="input w-[200px]" value={attendance?.check_in} onChange={(e) => onChangeCheckInTime(e.target.value)} />
                                {errors?.checkIn && (
                                    <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* check out */}
                    <div className="mb-6">
                        <div className="flex items-center">
                            <div className="w-[200px]">
                                <label htmlFor="" className="label">
                                    <span className="label-text">Check Out: </span>
                                </label>
                            </div>
                            <div>
                                <input type="time" placeholder="Type here" className="input w-[200px]" value={attendance?.check_out} onChange={e => onChangeCheckOutTime(e.target.value)} />
                                {errors?.checkOut && (
                                    <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="mb-8">
                    <div className="flex items-center">
                        <div className="w-[200px]">
                            <label htmlFor="" className="label">
                                <span className="label-text">Status: </span>
                            </label>
                        </div>
                        <div>
                            <select className="select w-[300px]" value={attendance?.status} onChange={e => onChangeStatus(e.target.value)}>
                                <option value="">Select Status</option>
                                {
                                    ATTENDANCE_STATUS.map(status => (
                                        <option value={status.value} key={status.key}>{status.key}</option>
                                    ))
                                }
                            </select>
                            {errors?.status && (
                                <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="mb-8">
                    <div className="flex items-center">
                        <div className="w-[200px]">
                            <label htmlFor="" className="label">
                                <span className="label-text">Note: </span>
                            </label>
                        </div>
                        <div>
                            <textarea className="textarea w-[300px]" placeholder="Note" value={attendance?.note} onChange={e => onChangeNote(e.target.value)}></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <button className="bg-gray-500  btn text-white border-none w-[120px] py-2" onClick={goBack}>Back</button>
                    <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2" onClick={updateAttendance}>Update</button>
                </div>
            </div>
        </>
    )
}

export default AttendanceEdit