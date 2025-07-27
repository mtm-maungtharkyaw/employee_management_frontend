import { useEffect, useState } from "react"

// components
import Breadcrumbs from "../../components/Breadcrumbs"
import Loading from "../../components/common/Loading"
import SelectBox from "../../components/employee/SelectBox"
import Input from "../../components/employee/Input"

// icons
import { RiDeleteBin5Line } from "react-icons/ri"

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
import { AUTH_ROLES } from "../../constants/role"

import { useAuth } from "../../contexts/AuthContext"
import status from "daisyui/components/status"

const BREADCRUMB_ITEMS = [
    {
        to: "/attendanceList",
        label: "Attendance List"
    }, {
        label: "Attendance Report"
    }
]

const ATTENDANCE_STATUS = [
    {
        key: 'Work From Home',
        value: "work_from_home"
    },
    {
        key: 'OFFICE',
        value: 'office'
    }
]


const AttendanceListReport = () => {
    const [isLoading, setIsLoading] = useState(false)

    const [empOptions, setEmpOptions] = useState([])
    const [selectedEmp, setSelectedEmp] = useState(null)
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [attendances, setAttendances] = useState([])

    const [errors, setErrors] = useState(null)

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

    const onSelectEmployee = (emp_id) => {
        const employee = empOptions.filter(empOption => empOption._id === emp_id)[0]
        setSelectedEmp(employee)
    }

    const showAttendances = () => {
        clearErrors()
        setAttendances([])

        const data = {
            employee_id: selectedEmp?._id,
            fromDate,
            toDate
        }

        let validationSchema = Joi.object({
            employee_id: Joi.string().required().messages({
                "any.required": "Employee Id is required",
                "string.empty": "Employee Id is required.",
            }),
            fromDate: Joi.date().required().messages({
                "any.required": "From Date is required.",
                "date.base": "From Date must be a valid date."
            }),
            toDate: Joi.date().required().messages({
                "any.required": "To Date is required.",
                "date.base": "To Date must be a valid date."
            })
        })

        const validationErrors = validateData(validationSchema, data)

        if (validationErrors) {
            setErrors(validationErrors)
            return
        }

        const startDateMoment = moment(fromDate)
        const endDateMoment = moment(toDate)

        const requestedAttendances = []
        let currentDay = startDateMoment.clone()
        while (currentDay.isSameOrBefore(endDateMoment, 'day')) {
            const dayOfWeek = currentDay.day()
            const isWeekEnd = dayOfWeek === 0 || dayOfWeek === 6
            if (!isWeekEnd) { // Exclude weekend
                requestedAttendances.push({
                    date: currentDay.clone().format('YYYY-MM-DD'),
                    check_in: "08:00",
                    check_out: "17:00",
                    status: "office",
                    notes: ""
                })
            }
            currentDay.add(1, 'day');
        }

        setAttendances(requestedAttendances)
    }

    const updateAttendance = (index, updateInfo = {}) => {
        if (index < 0 || index >= attendances.length) return

        const newAttendances = attendances.map((attendance, i) => {
            const currentAttendance = { ...attendance }
            if (i === index) {
                if (updateInfo.check_in) {
                    currentAttendance.check_in = updateInfo.check_in;
                }
                if (updateInfo.check_out) {
                    currentAttendance.check_out = updateInfo.check_out;
                }
                if (updateInfo.status) {
                    currentAttendance.status = updateInfo.status
                }
                if (updateInfo.notes) {
                    currentAttendance.notes = updateInfo.notes
                }
            }
            return currentAttendance
        });

        setAttendances(newAttendances)
    }

    const deleteAttendance = (index) => {
        if (index < 0 || index >= attendances.length) return
        const newAttendances = attendances.filter((_, idx) => index !== idx)
        setAttendances(newAttendances)
    }

    const submitAttendance = async () => {
        setIsLoading(true)
        try {
            const frmtAttendances = attendances.map(att => {
                const localDate = moment(att.date, 'YYYY/MM/DD');
                const dateUTCString = localDate.toISOString();
                return {
                    ...att,
                    date: dateUTCString, 
                    check_in: moment(`${localDate.format('YYYY-MM-DD')} ${att.check_in}`, 'YYYY-MM-DD HH:mm').utc().toISOString(),
                    check_out: moment(`${localDate.format('YYYY-MM-DD')} ${att.check_out}`, 'YYYY-MM-DD HH:mm').utc().toISOString()
                }
            })
            const result = await axiosInstance.post('/attendance/report-list', {
                employee_id: selectedEmp?._id,
                attendances: frmtAttendances
            })
            showToast("success", "Successfully Submitted Attendances")
        } catch (error) {
            if (error.response) {
                const errorDetails = error.response.data.error
                if(errorDetails) {
                    for (let index = 0; index < errorDetails.length; index++) {
                        showToast("error", errorDetails[index])
                    }
                } else {
                    const message = error.response.data.message
                    showToast("error", message)
                }
            } else {
                showToast("error", "Something Went Wrong")
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEmployeeOptions()
    }, [])

    useEffect(() => {
        console.log(attendances)
    }, [attendances])

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

            <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5 mb-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-[100px]">
                    <div>
                        <SelectBox
                            label="Employee Id"
                            name="employee_id"
                            options={empOptions.map(option => ({ label: option.employee_id, value: option._id }))}
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            value={selectedEmp ? selectedEmp._id : ''}
                            onChange={onSelectEmployee}
                            errorMessage={errors?.employee_id}
                        />

                        <Input
                            label="Name"
                            name="name"
                            containerClassName="mb-5"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                            value={selectedEmp ? selectedEmp.name : ''}
                            disabled={true}
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
                    </div>
                </div>
                <div className="flex justify-center">
                    <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2 mt-3" onClick={showAttendances}>Show</button>
                </div>
            </div>

            <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5">
                <div className="overflow-x-auto overflow-y-auto max-h-[300px] mx-auto">
                    <table className="table table-bordered border border-gray-300">
                        {/* thead */}
                        <thead>
                            <tr>
                                <th className="border border-gray-300 w-[15%]">Date</th>
                                <th className="border border-gray-300 w-[15%]">From Time</th>
                                <th className="border border-gray-300 w-[15%]">To Time</th>
                                <th className="border border-gray-300 w-[15%]">Status</th>
                                <th className="border border-gray-300">Note</th>
                                <th className="border border-gray-300 w-[15%]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendances.map((attendance, index) => (
                                <tr key={attendance.date}>
                                    <td className="border border-gray-300">{attendance.date}</td>
                                    <td className="border border-gray-300">
                                        <input
                                            className="input input-sm w-[150px] focus:outline-none focus:border-inherit"
                                            type="time"
                                            value={attendance.check_in}
                                            onChange={e => updateAttendance(index, { check_in: e.target.value })}
                                        />
                                    </td>
                                    <td className="border border-gray-300">
                                        <input
                                            className="input input-sm w-[150px] focus:outline-none focus:border-inherit"
                                            type="time"
                                            value={attendance.check_out}
                                            onChange={e => updateAttendance(index, { check_out: e.target.value })}
                                        />
                                    </td>
                                    <td className="border border-gray-300">
                                        <select
                                            className="select w-[150px] focus:outline-none focus:border-inherit"
                                            value={attendance.status}
                                            onChange={e => updateAttendance(index, { status: e.target.value })}
                                        >
                                            {ATTENDANCE_STATUS.map((status) => (
                                                <option key={status.value} value={status.value}>{status.key}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="border border-gray-300">
                                        <textarea className="input focus:outline-none focus:border-inherit" onChange={e => updateAttendance(index, { notes: e.target.value })} value={attendance.notes}>
                                        </textarea>
                                    </td>
                                    <td className="border border-gray-300">
                                        <button onClick={() => deleteAttendance(index)} className="flex space-x-1 text-[#f73643] cursor-pointer" >
                                            <RiDeleteBin5Line size={18} />
                                            <span>Delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center">
                    <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2 mt-3" onClick={submitAttendance}>Submit</button>
                </div>
            </div>
        </>
    )
}

export default AttendanceListReport