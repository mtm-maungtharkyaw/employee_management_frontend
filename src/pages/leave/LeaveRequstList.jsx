import { useEffect, useState } from "react"

// react router dom
import { useNavigate, NavLink } from "react-router-dom"

// components
import Breadcrumbs from "../../components/Breadcrumbs"
import Loading from "../../components/common/Loading"
import Pagination from '../../components/common/Pagination'
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal'

// icons
import { IoAddCircle } from "react-icons/io5"
import { FaEdit } from "react-icons/fa"
import { RiDeleteBin5Line } from "react-icons/ri"

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
import label from "daisyui/components/label"

const BREADCRUMB_ITEMS = [{
    label: "Leave Request List"
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

const STATUS_OPTIONS = [
    {
        label: 'Pending',
        value: 'pending'
    },
    {
        label: 'Approved',
        value: 'approved',
    },
    {
        label: 'Rejected',
        value: 'rejected'
    }
]

const SORT_OPTIONS = [
    {
        label: 'Created Date',
        value: 'createdAt'
    },
    {
        label: 'Status',
        value: 'status'
    },
    {
        label: 'Period',
        value: 'period'
    }
]

const LeaveRequestList = () => {
    const { authUser } = useAuth()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const [empOptions, setEmpOptions] = useState([])
    const [selectedEmp, setSelectedEmp] = useState('')
    const [selectedPeriod, setSelectedPeriod] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedSort, setSelectedSort] = useState('')

    const [leaveRequests, setLeaveRequests] = useState([])
    const [pagination, setPagination] = useState(null)

    const [deleteModalInfo, setDeleteModalInfo] = useState({
        visible: false,
        data: null
    })

    const clearSearchOptions = () => {
        setSelectedEmp('')
        setSelectedPeriod('')
        setSelectedSort('')
        setSelectedSort('')
    }

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message)
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const goToAddSingleLeaveRequestPage = () => {
        navigate('/singleleaveRequest')
    }

    const goToAddLongTermLeaveRequestPage = () => {
        navigate('/longleaveRequest')
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

    const fetchLeaveRequests = async ({
        employee_id = '',
        period = '',
        status = '',
        sort_by = '',
        sort_order = 'desc',
        page = 1,
        limit = 10
    } = {}) => {
        const payload = {}

        if (employee_id) {
            payload.employee_id = employee_id
        }

        if (period) {
            payload.period = period
        }

        if (status) {
            payload.status = status
        }

        if (sort_by) {
            payload.sortBy = sort_by
        }

        if (sort_order) {
            payload.sortOrder = sort_order
        }

        if (page) {
            payload.page = page
        }

        if (limit) {
            payload.limit = limit
        }

        setIsLoading(true)
        try {
            const { leaves, pagination } = await axiosInstance.post('/leave/getLeaveRequestList', payload)
            setLeaveRequests(leaves)
            setPagination(pagination)
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", "Something Went Wrong")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const onPageChange = (page) => {
        fetchLeaveRequests({
            page,
            limit: pagination.limit
        })
    }

    const onEditLeave = (index) => {
        if (index < 0 || index >= leaveRequests.length) return
        const leave = leaveRequests[index]
        navigate(`/leaveEdit/${leave._id}`)
    }

    const filterLeaveRequest = () => {
        fetchLeaveRequests({
            page: 1,
            employee_id: selectedEmp,
            period: selectedPeriod,
            status: selectedStatus,
            sort_by: selectedSort
        })
    }

    const closeDeleteModal = () => {
        setDeleteModalInfo(prev => ({
            ...prev,
            visible: false,
            data: null
        }))
    }

    const openDeleteModal = (index) => {
        if (index < 0 || index >= leaveRequests.length) return
        const leaveRequest = leaveRequests[index]

        console.log(leaveRequest)
        setDeleteModalInfo(prev => ({
            ...prev,
            visible: true,
            data: leaveRequest
        }))
    }

    const deleteLeaveRequest = async () => {
        const leaveId = deleteModalInfo.data._id
        closeDeleteModal()
        try {
            await axiosInstance.delete(`/leave/delete/${leaveId}`)
            showToast("success", "Successfully Deleted Leave Request")
            clearSearchOptions()
            fetchLeaveRequests({
                page: 1,
                limit: pagination.limit
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

    useEffect(() => {
        fetchEmployeeOptions()
        fetchLeaveRequests()
    }, [])
    return (
        <>
            {/* Confirm Modal */}
            {deleteModalInfo.visible && (
                <DeleteConfirmModal
                    cancel={closeDeleteModal}
                    confirm={deleteLeaveRequest}
                />
            )}

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
                        <label htmlFor="" className='block mb-1'>Employee</label>
                        <select id='' className="select bg-white w-[200px]" value={selectedEmp} onChange={(e) => setSelectedEmp(e.target.value)}>
                            <option value="">All</option>
                            {empOptions.map((option) => (
                                <option key={option._id} value={option._id}>{option.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="" className='block mb-1'>Period</label>
                        <select id='' className="select bg-white w-[200px]" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                            <option value="">All</option>
                            {PERIOD_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="" className='block mb-1'>Status</label>
                        <select id='' className="select bg-white w-[200px]" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                            <option value="">All</option>
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="" className='block mb-1'>Sort By</label>
                        <select id='' className="select bg-white w-[200px]" value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)}>
                            <option value="">All</option>
                            {SORT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn bg-[#4caf93] text-white border-none" onClick={filterLeaveRequest}>Search</button>
                </div>
                <div className=" flex items-end space-x-2">
                    <button className="btn bg-[#4caf93] text-white border-none" onClick={goToAddSingleLeaveRequestPage}>Single <IoAddCircle size={22} /></button>
                    <button className="btn bg-[#4caf93] text-white border-none" onClick={goToAddLongTermLeaveRequestPage}>Long Term <IoAddCircle size={22} /></button>
                </div>
            </div>
            {(!isLoading && leaveRequests.length == 0) && <h1>There is no leave request lists</h1>}
            {(!isLoading && leaveRequests.length > 0) && (
                <div>
                    <div className="overflow-x-auto rounded-sm border border-[#e6e5e5] bg-[#fefefe]">
                        <table className="table">
                            {/* head */}
                            <thead className="bg-gray-100 text-[#00836b] text-sm">
                                <tr>
                                    <th>No</th>
                                    <th>Employee Id</th>
                                    <th>Name</th>
                                    <th>Leave Date</th>
                                    <th>Period</th>
                                    <th>Status</th>
                                    <th>Reason</th>
                                    <th>Requested At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 font-normal">
                                {leaveRequests.map((leave, index) => {
                                    const period = PERIOD_OPTIONS.filter(option => option.value == leave.period)[0]
                                    const status = STATUS_OPTIONS.filter(option => option.value == leave.status)[0]
                                    return (
                                        <tr key={leave._id} className="hover:bg-gray-50 border-b border-[#e6e5e5] font-normal">
                                            <th>{(pagination.page - 1) * pagination.limit + index + 1}</th>
                                            <td>
                                                <NavLink to={`/leaveDetail/${leave._id}`} className="underline">{leave.employee?.employee_id}</NavLink>
                                            </td>
                                            <td>{leave.employee?.name}</td>
                                            <td>{moment(leave.date).format('DD/MM/YYYY')}</td>
                                            <td>{period.label}</td>
                                            <td>{status.label}</td>
                                            <td>{leave.reason}</td>
                                            <td>{moment(leave.createdAt).format('YYYY/MM/DD')}</td>
                                            <td>
                                                <div className='flex space-x-3'>
                                                    <button><FaEdit size={18} className='text-[#25a8fa] cursor-pointer' onClick={() => onEditLeave(index)} /></button>
                                                    <button><RiDeleteBin5Line size={18} className='text-[#f73643] cursor-pointer' onClick={() => openDeleteModal(index)}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
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

export default LeaveRequestList