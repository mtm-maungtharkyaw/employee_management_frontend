import { useState, useEffect } from "react"

// react router dom
import { useNavigate, Link, useLocation } from "react-router-dom"

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import Pagination from '../../components/common/Pagination'
import Loading from '../../components/common/Loading'

// toastify
import { ToastContainer, toast } from 'react-toastify'

// axios instance
import axiosInstance from "../../api/axiosInstance"

// moments
import moment from "moment"

const BREADCRUMB_ITEMS = [{
    label: "Payroll",
    to: "/payroll"
}, {
    label: "Histories"
}]

const PaymentHistories = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [paymentHistories, setPaymentHistories] = useState([])
    const [selectedMonth, setSelectedMonth] = useState('')

    const [pagination, setPagination] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const fetchHistories = async ({
        year = '',
        month = '',
        page = 1,
        limit = 10
    }) => {
        setIsLoading(true)

        let payload = {
            page,
            limit
        }
        if (year) {
            payload.year = year
        }
        if (month) {
            payload.month = month
        }
        try {
            const { list, pagination } = await axiosInstance.post('/payment/get-payment-histories', payload)
            setPaymentHistories(list)
            setPagination(pagination)
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

    const onChangePage = (page) => {
        const filterOptions = { page }

        if (selectedMonth) {
            const [yearStr, monthStr] = selectedMonth.split('-')
            const year = Number(yearStr)
            const month = Number(monthStr)
            filterOptions.year = year
            filterOptions.month = month
        }

        fetchHistories(filterOptions)
    }

    const searchPaymentHistories = () => {
        if (!selectedMonth) return
        const [yearStr, monthStr] = selectedMonth.split('-')
        const year = Number(yearStr)
        const month = Number(monthStr)
        fetchHistories({
            year,
            month,
        })
    }

    useEffect(() => {
        const searchOptions = location.state?.searchOptions
        if (searchOptions) {
            const year = searchOptions.year
            const month = searchOptions.month
            fetchHistories({
                year: year,
                month: month
            })
            setSelectedMonth(`${year}-${String(month).padStart(2, '0')}`)
        } else {
            const now = moment()
            const currentYear = now.year()
            const currentMonth = now.month() + 1
            fetchHistories({
                year: currentYear,
                month: currentMonth
            })
            setSelectedMonth(now.format('YYYY-MM'))
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
            <Breadcrumbs items={BREADCRUMB_ITEMS} />

            <div className='filter flex items-end space-x-2 mb-5'>
                <div>
                    <label htmlFor="" className='block mb-1'>Payment Month</label>
                    <input
                        type="month"
                        placeholder="Payment Month"
                        className="input bg-white w-[200px]"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                </div>

                <button className="btn bg-[#4caf93] text-white border-none" onClick={searchPaymentHistories}>Search</button>
            </div>

            {(!isLoading && paymentHistories.length == 0) && (
                <h1>There is no Payroll Histories lists</h1>
            )}

            {(!isLoading && paymentHistories.length > 0) && (
                <div>
                    <div className="overflow-x-auto rounded-sm border border-[#e6e5e5] bg-[#fefefe]">
                        <table className='table'>
                            <thead className="bg-gray-100 text-[#00836b] text-sm font-bold">
                                <tr>
                                    <th>No</th>
                                    <th>Employee Id</th>
                                    <th>Employee Name</th>
                                    <th>Net Salary</th>
                                    <th>Payment Month</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {paymentHistories.map((payment, index) => (
                                    <tr key={payment._id} className="hover:bg-gray-50 border-b border-[#e6e5e5]">
                                        <th>{(pagination.page - 1) * pagination.limit + index + 1}</th>
                                        <td className="underline"><Link to={`/payroll/histories/${payment._id}`}>{payment.employee.employee_id}</Link></td>
                                        <td>{payment.employee.name}</td>
                                        <td>{payment.net_salary}</td>
                                        <td>{moment(`${payment.year}-${payment.month}`, 'YYYY-M').format('YYYY MMMM')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* pagination */}
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={onChangePage}
                    />
                </div>
            )}
        </>
    )
}

export default PaymentHistories