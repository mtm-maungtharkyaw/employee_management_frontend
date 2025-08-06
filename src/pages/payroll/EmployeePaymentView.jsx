import { useState, useEffect, use } from "react"

// components
import Loading from "../../components/common/Loading"
import Breadcrumbs from "../../components/Breadcrumbs"

// toastify
import { ToastContainer, toast } from 'react-toastify'

// context
import { useAuth } from "../../contexts/AuthContext"
import { useOtp } from "../../contexts/OtpContext"

// axiosInstance
import axiosInstance from "../../api/axiosInstance"

// moment
import moment from "moment"

const BREADCRUMB_ITEMS = [{ label: "Single Payment Show" }]

const EmployeePaymentView = () => {
    const { authUser } = useAuth()
    const { paymentAccessToken, clearAccessToken } = useOtp()

    const [selectedYear, setSelectedYear] = useState('')
    const [selectedMonth, setSelectedMonth] = useState('')
    const [paymentRecord, setPaymentRecord] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => currentYear - i);
    const months = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const fetchPaymentRecord = async (year, month) => {
        setIsLoading(true)
        try {
            const record = await axiosInstance.post('/payment/get-payment-history-by-employee', {
                employeeId: authUser?._id,
                paymentAccessToken,
                year: Number(year),
                month: Number(month)
            })
            record.total_salary_paid = record.basic_salary + calculateTotalFromObject(record.skills)
            record.gross_salary = record.total_salary_paid + calculateTotalFromObject(record.allowances)
            record.total_deductions = calculateTotalFromObject(record.deductions)
            setPaymentRecord(record)
            showToast("Success", "Successfully Retrieved Payment Record")
        } catch (error) {
            if (error.response?.status === 403 && error.response?.data?.error?.code === 'INVALID_PAYMENT_ACCESS_TOKEN') {
                clearAccessToken()
            }
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

    const searchPaymentRecord = () => {
        if (selectedYear == '' || selectedMonth == '') return
        setPaymentRecord(null)
        fetchPaymentRecord(selectedYear, selectedMonth)
    }

    function formatAmount(amount) {
        const num = parseFloat(amount)

        if (isNaN(num) || num == 0) return '-'

        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    }

    function calculateTotalFromObject(obj) {
        if (!obj || typeof obj !== 'object') return 0;

        return Object.values(obj).reduce((sum, val) => {
            const num = parseFloat(val);
            return sum + (isNaN(num) ? 0 : num);
        }, 0);
    }

    useEffect(() => {
        const now = moment()
        const currentYear = now.year()
        const currentMonth = now.month() + 1
        fetchPaymentRecord(currentYear, currentMonth)
        setSelectedMonth(currentMonth)
        setSelectedYear(currentYear)
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

            {/* Bread Crumb */}
            <Breadcrumbs items={BREADCRUMB_ITEMS} />

            <div className="mb-5">
                <div className='filter flex items-end space-x-2'>
                    <div>
                        <label htmlFor="" className='block mb-1'>Year</label>
                        <select id='' className="select bg-white w-[200px]" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                            <option value="">All</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="" className='block mb-1'>Month</label>
                        <select id='' className="select bg-white w-[200px]" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                            <option value="">All</option>
                            {months.map((month) => (
                                <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                        </select>
                    </div>

                    <button className="btn bg-[#4caf93] text-white border-none" onClick={searchPaymentRecord}>Search</button>
                </div>
            </div>

            {(paymentRecord) && (
                <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5">
                    <div class="p-4">
                        <div class="border border-black p-4 w-full max-w-3xl mx-auto text-sm">
                            <h2 class="text-center font-bold underline text-lg mb-2">Salary Pay Slip</h2>
                            {/* <p class="text-center mb-1">{selectedYear} {selectedMonth ? months.filter(month => month.value == selectedMonth)[0].label : ''}</p> */}
                            <p className="text-center mb-1"><strong>{authUser?.name}</strong></p>
                            <p className="text-center mb-1">{authUser?.position?.name}</p>

                            <div class="mt-4">
                                <table class="table table-sm w-full border border-black">
                                    <tbody>
                                        <tr>
                                            <td class="border border-black font-semibold w-[300px]">Bank Details</td>
                                            <td class="border border-black">{authUser?.personal?.bank_account}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="mt-4">
                                <table class="table table-sm w-full border border-black">
                                    <thead>
                                        <tr>
                                            <th class="border border-black text-left w-[300px]">(+)&nbsp;Skill</th>
                                            <th class="border border-black text-right">Amount (MMK)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="border border-black">Basic Salary</td>
                                            <td class="border border-black text-right">{formatAmount(paymentRecord?.basic_salary)}</td>
                                        </tr>
                                        <tr>
                                            <td class="border border-black">Management Skill</td>
                                            <td class="border border-black text-right">{formatAmount(paymentRecord?.skills?.management_skill)}</td>
                                        </tr>
                                        <tr>
                                            <td class="border border-black">Technical Skill</td>
                                            <td class="border border-black text-right">{formatAmount(paymentRecord?.skills?.technical_skill)}</td>
                                        </tr>
                                        <tr>
                                            <td class="border border-black">Project Skill</td>
                                            <td class="border border-black text-right">{formatAmount(paymentRecord?.skills?.project_skill)}</td>
                                        </tr>
                                        <tr>
                                            <td class="border border-black">Japanese Skill</td>
                                            <td class="border border-black text-right">{formatAmount(paymentRecord?.skills?.japanese_skill)}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr class="font-bold">
                                            <td class="border border-black">Total Salary Paid</td>
                                            <td class="border border-black text-right">{formatAmount(paymentRecord?.total_salary_paid)} MMK</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div class="mt-4">
                                <table class="table table-sm w-full border border-black">
                                    <thead>
                                        <tr>
                                            <th class="border border-black text-left w-[300px]">(+)&nbsp;Other</th>
                                            <th class="border border-black text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="border border-black">Travelling Allowance</td>
                                            <td class="border border-black text-right">{paymentRecord?.allowances.travelling}</td>
                                        </tr>
                                        <tr>
                                            <td class="border border-black">Annual Bonus</td>
                                            <td class="border border-black text-right">{paymentRecord?.allowances.annual_bonus}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr class="font-bold">
                                            <td class="border border-black">Gross Salary</td>
                                            <td class="border border-black text-right">{formatAmount(paymentRecord?.gross_salary)} MMK</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div class="mt-4">
                                <table class="table table-sm w-full border border-black">
                                    <tbody>
                                        <tr>
                                            <td class="border border-black w-[300px]">(-) Social Security</td>
                                            <td class="border border-black text-right">{formatAmount(paymentRecord?.deductions?.socail_security)}</td>
                                        </tr>
                                        <tr>
                                            <td class="border border-black w-[300px]">(-) Leave Fine</td>
                                            <td class="border border-black text-right">{formatAmount(paymentRecord?.deductions?.leave_fine)}</td>
                                        </tr>
                                        <tr>
                                            <td class="border border-black">(-) Other Deduction</td>
                                            <td class="border border-black text-right">{formatAmount(paymentRecord?.deductions?.other_deduction)}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr class="font-bold">
                                            <td class="border border-black">Total Deductions</td>
                                            <td class="border border-black text-right">{formatAmount(paymentRecord?.total_deductions)} MMK</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="mt-4">
                                <table class="table table-sm w-full border border-black">
                                    <tfoot>
                                        <tr class="font-bold">
                                            <td class="border border-black w-[300px]">Net Salary</td>
                                            <td class="border border-black text-right">{formatAmount(paymentRecord?.net_salary)} MMK</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div class="mt-4">
                                <table class="table table-sm w-full border border-black">
                                    <thead>
                                        <tr>
                                            <th class="border border-black w-[300px]">Paid Leave</th>
                                            <th class="border border-black">Used</th>
                                            <th class="border border-black">Left</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="border border-black">Casual Leave</td>
                                            <td class="border border-black">{6 - authUser?.leave?.casual}</td>
                                            <td class="border border-black">{authUser?.leave?.casual}</td>
                                        </tr>
                                        <tr>
                                            <td class="border border-black">Sick Leave</td>
                                            <td class="border border-black">{30 - authUser?.leave?.sick}</td>
                                            <td class="border border-black">{authUser?.leave?.sick}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default EmployeePaymentView