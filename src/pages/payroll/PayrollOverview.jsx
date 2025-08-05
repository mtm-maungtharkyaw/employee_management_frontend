import { useState, useEffect } from "react"

// react router dom
import { useNavigate } from "react-router-dom"

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import Pagination from '../../components/common/Pagination'
import Button from '../../components/common/Button'
import Loading from '../../components/common/Loading'

// icons
import { FaEdit } from "react-icons/fa"

// toastify
import { ToastContainer, toast } from 'react-toastify'

// axios instance
import axiosInstance from "../../api/axiosInstance"

// constants
import { PAYROLL_STATUS } from "../../constants/constant"

// moments
import moment from "moment"
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal"

const BREADCRUMB_ITEMS = [{
    label: "Payroll Overview"
}]

const PayrollOverview = () => {
    const navigate = useNavigate()

    const [payrolls, setPayrolls] = useState([])

    const [pagination, setPagination] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const [deleteModalInfo, setDeleteModalInfo] = useState({
        visible: false
    })

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const openDeleteModal = () => {
        setDeleteModalInfo(prev => ({
            ...prev,
            visible: true
        }))
    }

    const closeDeleteModal = ()=> {
        setDeleteModalInfo(prev => ({
            ...prev,
            visible: false
        }))
    }

    const goToPaymentDetail = (employeeId) => {
        navigate(`/payroll/detail/${employeeId}`)
    }

    const goToPayRollHistories = () => {
        navigate("/payroll/histories")
    }

    const resetPayment = async () => {
        closeDeleteModal()
        setIsLoading(true)
        try {
            await axiosInstance.post('/payment/reset')
            showToast("success", "Successfully Reset Payments")
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", error.message)
            }
        } finally {
            setIsLoading(false)
            fetchPaymentList()
        }
    }

    const fetchPaymentList = async (page = 1, limit = 10) => {
        setIsLoading(true)
        try {
            const { payments, pagination } = await axiosInstance.post('/payment/get-current-list', {
                page,
                limit
            })
            if (payments.length > 0) {
                setPayrolls(payments)
                setPagination(pagination)
            }
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
        fetchPaymentList()
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

            {/* Confirm Modal */}
            {deleteModalInfo.visible && (
                <DeleteConfirmModal
                    title="Are you sure to reset ?"
                    cancel={closeDeleteModal}
                    confirm={resetPayment}
                    comfirmLabel="Reset"
                />
            )}

            {/* Breadcrumbs */}
            <Breadcrumbs items={BREADCRUMB_ITEMS} />

            <div className='flex justify-end space-x-2 mb-5'>
                <button className="btn bg-[#4caf93] text-white border-none" onClick={goToPayRollHistories}>View History</button>
                <button className="btn bg-red-500 text-white border-none" onClick={openDeleteModal}>Reset Payment</button>
            </div>

            {(!isLoading && payrolls.length == 0) && (
                <h1>There is no Payroll lists</h1>
            )}

            {(!isLoading && payrolls.length > 0) && (
                <div>
                    <div className="overflow-x-auto rounded-sm border border-[#e6e5e5] bg-[#fefefe]">
                        <table className='table'>
                            <thead className="bg-gray-100 text-[#00836b] text-sm font-bold">
                                <tr>
                                    <th>No</th>
                                    <th>Employee Name</th>
                                    <th>Employee Id</th>
                                    <th>Net Salary</th>
                                    <th>Payment Month</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {payrolls.map((payroll, index) => (
                                    <tr key={payroll._id} className="hover:bg-gray-50 border-b border-[#e6e5e5]">
                                        <th>{(pagination.page - 1) * pagination.limit + index + 1}</th>
                                        <td>{payroll.employee.name}</td>
                                        <td>{payroll.employee.employee_id}</td>
                                        <td>{payroll?.net_salary || 0}</td>
                                        <td>{payroll?.month && payroll?.year ? moment(`${payroll.year}-${payroll.month}`, 'YYYY-M').format('YYYY MMMM') : ''}</td>
                                        <td>{PAYROLL_STATUS.filter(status => status.value === payroll.status)[0].label}</td>
                                        <td>
                                            <div className='flex space-x-3'>
                                                <button onClick={() => goToPaymentDetail(payroll.employee._id)}><FaEdit size={18} className='text-[#25a8fa] cursor-pointer' /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    )
}

export default PayrollOverview