import { useState, useEffect, use } from "react"

// components
import Loading from "../../components/common/Loading"

// toastify
import { ToastContainer, toast } from 'react-toastify'

// context
import { useAuth } from "../../contexts/AuthContext"
import { useOtp } from "../../contexts/OtpContext"

import axiosInstance from "../../api/axiosInstance"

const EmployeePaymentView = () => {
    const { authUser } = useAuth()
    const { paymentAccessToken, clearAccessToken } = useOtp()

    const [paymentRecord, setPaymentRecord] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

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
            console.log(record)
            setPaymentRecord(record)
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
        fetchPaymentRecord(2025, 7)
        console.log(authUser)
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
            <div class="p-4">
                <div class="border border-black p-4 w-full max-w-2xl mx-auto text-sm">
                    <h2 class="text-center font-bold underline text-lg mb-2">Salary Pay Slip</h2>
                    <p class="text-center mb-1">July-2025 For (26-June-2025 ~ 25-July-2025)</p>
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
                                    <td class="border border-black text-right">{paymentRecord?.deductions?.social_security}</td>
                                </tr>
                                <tr>
                                    <td class="border border-black">(-) Other Deduction</td>
                                    <td class="border border-black text-right">{paymentRecord?.deductions?.other_deduction}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr class="font-bold">
                                    <td class="border border-black">Total Deductions</td>
                                    <td class="border border-black text-right">{formatAmount(paymentRecord?.deductions?.total_deductions)} MMK</td>
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
                                    <th class="border border-black">Paid Leave</th>
                                    <th class="border border-black">Note</th>
                                    <th class="border border-black">Used</th>
                                    <th class="border border-black">Left</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td class="border border-black">Annual Leave</td><td class="border border-black">Annual Leave</td><td class="border border-black text-center">0</td><td class="border border-black text-center">10</td></tr>
                                <tr><td class="border border-black">Sick Leave</td><td class="border border-black">Sick Leave</td><td class="border border-black text-center">0</td><td class="border border-black text-center">30</td></tr>
                                <tr><td class="border border-black">Casual Leave</td><td class="border border-black">Casual Leave</td><td class="border border-black text-center">1</td><td class="border border-black text-center">5</td></tr>
                                <tr><td class="border border-black">Special Leave</td><td class="border border-black">Special Leave</td><td class="border border-black text-center">0</td><td class="border border-black text-center">-</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <p class="mt-2 font-semibold">Lunch Fee_ 25200;</p>
                </div>
            </div>
        </>
    )
}

export default EmployeePaymentView