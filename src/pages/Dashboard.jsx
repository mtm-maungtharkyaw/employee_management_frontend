import React, { useEffect, useState } from 'react'

// components
import Breadcrumbs from '../components/Breadcrumbs'
import CalendarApp from '../components/common/CalendarApp'
import AttendanceChart from '../components/dashboard/AttendanceChart'
import EmployeeWorkingHoursChart from '../components/dashboard/EmployeeWorkingHoursChart'
import DepartmentListCard from '../components/dashboard/DepartmentListCard'
import PendingLeaveCard from '../components/dashboard/PendingLeaveCard'
import PositionCard from '../components/dashboard/PositionCard'
import DepartmentOverviewCard from '../components/dashboard/DepartmentOverviewCard'

// icons
import { FaUsers, FaUserCheck, FaUserTimes, FaHospitalAlt } from "react-icons/fa"
import { MdEventAvailable } from 'react-icons/md'
import { BsBarChartFill } from 'react-icons/bs'

// context
import { useAuth } from '../contexts/AuthContext'

// constants
import { AUTH_ROLES } from '../constants/role'

import axiosInstance from '../api/axiosInstance'

import moment from 'moment'


export default function Dashboard() {
    const breadcrumb_items = [{ label: 'Dashboard' }]

    const { authUser } = useAuth()
    const [totalEmp, setTotalEmp] = useState(0)
    const [attendancePercent, setAttendancePercent] = useState(0)
    const [absentPercent, setAbsentPercent] = useState(0)
    const [leave, setLeave] = useState(null)
    const [totalWorkedHour, setTotalWorkedHour] = useState(0)

    const getTotalEmployee = async () => {
        try {
            const { total } = await axiosInstance.get('/employee/total')
            setTotalEmp(total)
        } catch (error) {
            console.error(error)
        }
    }

    const getTodayAttendancePercent = async () => {
        try {
            const { todayAttendancePercent } = await axiosInstance.get('/attendance/get-today-attendance')
            const absentPercent = 100 - todayAttendancePercent
            setAttendancePercent(todayAttendancePercent)
            setAbsentPercent(absentPercent)
        } catch (error) {
            console.error(error)
        }
    }

    const getRemainingLeaves = async () => {
        try {
            const data = await axiosInstance.get(`/employee/${authUser?._id}/leaves`)
            setLeave(data.leave)
        } catch (error) {
            console.error(error)
        }
    }

    const getTotalWorkingHours = async () => {
        try {
            const year = moment().year()
            const month = moment().month() + 1
            const { totalWorkedHour } = await axiosInstance.get(`/employee/${authUser._id}/working-hours/${year}/${month}`)
            setTotalWorkedHour(totalWorkedHour)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (authUser?.role === AUTH_ROLES.ADMIN) {
            getTotalEmployee()
            getTodayAttendancePercent()
        } else {
            getRemainingLeaves()
            getTotalWorkingHours()
        }
    }, [])

    return (
        <>
            <Breadcrumbs items={breadcrumb_items} />

            <div className='grid grid-cols-6 gap-3'>
                <div className='col-span-4'>
                    <div className='grid grid-cols-3 gap-3 mb-3'>
                        {authUser?.role === AUTH_ROLES.ADMIN && (
                            <>
                                <div className='rounded-sm bg-[#fefefe] py-5 flex justify-center items-center space-x-8'>
                                    <div className='bg-[#6366f1] w-[60px] h-[60px] rounded-full flex justify-center items-center'>
                                        <FaUsers size={25} className="text-white" />
                                    </div>
                                    <div>
                                        <p>Total Employee</p>
                                        <span className='text-lg font-semibold'>{totalEmp}</span>
                                    </div>
                                </div>
                                <div className='rounded-sm bg-[#fefefe] py-5 flex justify-center items-center space-x-8'>
                                    <div className='bg-[#4cbd9b] w-[60px] h-[60px] rounded-full flex justify-center items-center'>
                                        <FaUserCheck size={25} className="text-white" />
                                    </div>
                                    <div>
                                        <p>Today Attendance</p>
                                        <span className='text-lg font-semibold'>{attendancePercent} %</span>
                                    </div>
                                </div>
                                <div className='rounded-sm bg-[#fefefe] py-5 flex justify-center items-center space-x-8'>
                                    <div className='bg-[#f97373] w-[60px] h-[60px] rounded-full flex justify-center items-center'>
                                        <FaUserTimes size={25} className="text-white" />
                                    </div>
                                    <div>
                                        <p>Today Absent</p>
                                        <span className='text-lg font-semibold'>{absentPercent} %</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {authUser?.role === AUTH_ROLES.EMPLOYEE && (
                            <>
                                <div className='rounded-sm bg-[#fefefe] py-5 flex justify-center items-center space-x-8'>
                                    <div className='bg-[#4cbd9b] w-[60px] h-[60px] rounded-full flex justify-center items-center'>
                                        <MdEventAvailable size={25} className="text-white" />
                                    </div>
                                    <div>
                                        <p>Available Casual Leave</p>
                                        <span className='text-lg font-semibold'>{leave?.casual}</span>
                                    </div>
                                </div>
                                <div className='rounded-sm bg-[#fefefe] py-5 flex justify-center items-center space-x-8'>
                                    <div className='bg-[#f97373] w-[60px] h-[60px] rounded-full flex justify-center items-center'>
                                        <FaHospitalAlt size={25} className="text-white" />
                                    </div>
                                    <div>
                                        <p>Available Sick Leave</p>
                                        <span className='text-lg font-semibold'>{leave?.sick}</span>
                                    </div>
                                </div>
                                <div className='rounded-sm bg-[#fefefe] py-5 flex justify-center items-center space-x-8'>
                                    <div className='bg-[#6366f1] w-[60px] h-[60px] rounded-full flex justify-center items-center'>
                                        <BsBarChartFill size={25} className="text-white" />
                                    </div>
                                    <div>
                                        <p>Total Working Hours</p>
                                        <span className='text-lg font-semibold'>{totalWorkedHour}</span>
                                    </div>
                                </div>
                            </>
                        )}


                    </div>
                    <div className='mb-3'>
                        <div className='rounded-sm  bg-[#fefefe] p-2 h-[320px]'>
                            {authUser?.role === AUTH_ROLES.ADMIN ? <AttendanceChart /> : <EmployeeWorkingHoursChart />}
                        </div>
                    </div>
                    <div>
                        <div className='rounded-sm  bg-[#fefefe] p-2 h-[320px]'>
                            {authUser?.role === AUTH_ROLES.ADMIN ? <PendingLeaveCard /> : <DepartmentListCard />}
                        </div>
                    </div>
                </div>
                <div className='col-span-2 bg-white h-[430px] rounder-sm'>
                    <CalendarApp />
                    <div className='mt-3'>
                        <div className='rounded-sm  bg-[#fefefe] p-2 h-[320px]'>
                            {authUser?.role === AUTH_ROLES.ADMIN ? <DepartmentOverviewCard /> : <PositionCard />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
