import { useEffect, useState } from "react"

// components
import Breadcrumbs from "../../components/Breadcrumbs"
import Loading from "../../components/common/Loading"

// axios instance
import axiosInstance from './../../api/axiosInstance'

// toastify
import { ToastContainer, toast } from 'react-toastify'

// moment
import moment from 'moment'

// Joi
import Joi from "joi"

// helper
import { validateData } from "../../utils/helper"

// constants
import { ATTENDANCE_STATUS } from "../../constants/constant"

import { useAuth } from "../../contexts/AuthContext"

const BREADCRUMB_ITEMS = [{
    label: "Attendance Report"
}]

const AttendanceReport = () => {
    const { authUser } = useAuth()

    const [isLoading, setIsLoading] = useState(false)
    const [empOptions, setEmpOptions] = useState([])
    const [selectedEmpOption, setSelectedEmpOption] = useState('')
    const [date, setDate] = useState(moment().format('YYYY/MM/DD'))
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [status, setStatus] = useState(ATTENDANCE_STATUS[1].value)
    const [note, setNote] = useState("")
    const [errors, setErrors] = useState(null)

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const init = () => {
        fetchEmployeeOptions()

        const employee_id = authUser?._id
        const today_date = moment().toISOString()

        setSelectedEmpOption(employee_id)
        fetchAttendance(employee_id, today_date)
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
                showToast("error", "Something went wrong")
            }
        }
    }

    const fetchAttendance = async (employee_id, date) => {
        try {
            const attendance = await axiosInstance.post('/attendance/', {
                employee_id,
                date
            })

            if (attendance) {
                setSelectedEmpOption(attendance.employee || '')
                setDate(attendance.date ? moment(attendance.date).format('YYYY/MM/DD') : '')
                setCheckIn(attendance.check_in ? moment(attendance.check_in).format('HH:mm') : '')
                setCheckOut(attendance.check_out ? moment(attendance.check_out).format('HH:mm') : '')
                setStatus(attendance.status || '')
                setNote(attendance.notes || '')
            }
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", error.message)
            }
        }
    }

    const reportAttendance = async () => {
        const validationSchema = Joi.object({
            employee: Joi.string().required(),
            checkIn: Joi.string().required(),
            checkOut: Joi.string().when('$isAdmin', {
                is: true,
                then: Joi.string().required(),
                otherwise: Joi.string().allow(null, '')
            }),
            status: Joi.string().required()
        });

        const validationErrors = validateData(validationSchema, {
            employee: selectedEmpOption,
            checkIn: checkIn,
            checkOut: checkOut,
            status
        })

        if (validationErrors) {
            setErrors(validationErrors)
            return
        }

        const localDate = moment(date, 'YYYY/MM/DD');
        const dateUTCString = localDate.toISOString();

        const checkInUTC = checkIn
            ? moment(`${localDate.format('YYYY-MM-DD')} ${checkIn}`, 'YYYY-MM-DD HH:mm')
                .utc()
                .toISOString()
            : null;

        const checkOutUTC = checkOut
            ? moment(`${localDate.format('YYYY-MM-DD')} ${checkOut}`, 'YYYY-MM-DD HH:mm')
                .utc()
                .toISOString()
            : null;

        setIsLoading(true)
        try {
            await axiosInstance.post('/attendance/report', {
                employee_id: selectedEmpOption,
                date: dateUTCString,
                status,
                check_in: checkInUTC,
                check_out: checkOutUTC,
                notes: note
            })
            showToast("success", "Successfully Reported Attendance")
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", error.message)
            }
        } finally {
            setIsLoading(false)
        }
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

            <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5">
                {/* Employee */}
                <div className="mb-8">
                    <div className="flex items-center">
                        <div className="w-[200px]">
                            <label htmlFor="" className="label">
                                <span className="label-text">Employee: </span>
                            </label>
                        </div>
                        <div>
                            <select disabled={true} className="select w-[300px]" value={selectedEmpOption} onChange={e => setSelectedEmpOption(e.target.value)}>
                                <option value="">Select Employee</option>
                                {empOptions.map(option => (
                                    <option value={option._id} key={option._id}>{option.name}</option>
                                ))}
                            </select>
                            {errors?.employee && (
                                <p className="text-red-500 text-sm mt-1">{errors.employee}</p>
                            )}
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
                            <span className="dark-blue">{date}</span>
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
                                <input type="time" placeholder="Type here" className="input w-[200px]" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
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
                                <input type="time" placeholder="Type here" className="input w-[200px]" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
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
                            <select className="select w-[300px]" value={status} onChange={e => setStatus(e.target.value)}>
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
                            <textarea className="textarea w-[300px]" placeholder="Note" value={note} onChange={e => setNote(e.target.value)}></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2" onClick={reportAttendance}>Report</button>
                </div>
            </div>
        </>
    )
}

export default AttendanceReport