
import { useState, useEffect, use } from "react"

// react router dom
import { useNavigate, useParams } from "react-router-dom"

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import Input from "../../components/payment/Input"
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
    label: "Histories",
    to: "/payroll/histories"
}, {
    label: "Detail"
}]

const PaymentHistoryDetail = () => {
    const { paymentId } = useParams()

    const navigate = useNavigate()
    const [payment, setPayment] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const getFormattedMonth = (year, month) => {
        if (year && month) {
            return moment(`${year}-${month}`, 'YYYY-M').format('MMMM YYYY')
        }
        return ''
    };

    const fetchPayment = async () => {
        setIsLoading(true)
        try {
            const result = await axiosInstance.get(`/payment/history/${paymentId}`)
            setPayment(result)
            console.log(result)
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

    const goBack = () => {
        navigate('/payroll/histories', {
            state: {
                searchOptions: {
                    year: payment?.year,
                    month: payment?.month
                }
            }
        })
    }

    useEffect(() => {
        fetchPayment()
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
                {/* Payment Information */}
                <div className="border border-[#e6e5e5] p-3 mb-3">
                    <h2 className="text-lg font-semibold mb-5">Payment Information</h2>
                    <div className="grid grid-cols-2 gap-[100px]">
                        <div>
                            {/* Employee Id */}
                            <Input
                                label="Employee Id"
                                name="employee_id"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                value={payment?.employee?.employee_id}
                                readOnly={true}
                            />

                            {/* Emplyee Name */}
                            <Input
                                label="Name"
                                name="employee_name"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                value={payment?.employee?.name}
                                readOnly={true}
                            />
                        </div>
                        <div>
                            {/* Basic Salary */}
                            <Input
                                label="Basic Salary"
                                name="basic_salary"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                value={payment?.basic_salary}
                                readOnly={true}
                            />

                            {/* Basic Salary */}
                            <Input
                                label="Payment Month"
                                name="payment_month"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                value={getFormattedMonth(payment?.year, payment?.month)}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="border border-[#e6e5e5] p-3 mb-3">
                    <h2 className="text-lg font-semibold mb-5">Skill +</h2>
                    <div className="grid grid-cols-2 gap-[100px]">
                        <div>
                            {/* Management Skill */}
                            <Input
                                type="number"
                                label="Management Skill"
                                name="management_skill"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                value={payment?.skills?.management_skill || '-'}
                                readOnly={true}
                            />

                            {/* Technical Skill */}
                            <Input
                                type="number"
                                label="Technical Skill"
                                name="technical_skill"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                value={payment?.skills?.technical_skill || '-'}
                                readOnly={true}
                            />
                        </div>
                        <div>
                            {/* Technical Skill */}
                            <Input
                                type="number"
                                label="Project Skill"
                                name="project_skill"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                value={payment?.skills?.project_skill || '-'}
                                readOnly={true}
                            />

                            {/* Japanese Skill */}
                            <Input
                                type="number"
                                label="Japanese Skill"
                                name="japanese_skill"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                value={payment?.skills?.japanese_skill || '-'}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Allowances */}
                <div className="border border-[#e6e5e5] p-3 mb-3">
                    <h2 className="text-lg font-semibold mb-5">Allowances</h2>
                    <div className="grid grid-cols-2 gap-[100px]">
                        <div>
                            {/* Travelling Allowance */}
                            <Input
                                type="number"
                                label="Travelling Allowance"
                                name="travelling_allowance"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                value={payment?.allowances?.travelling || '-'}
                                readOnly={true}
                            />
                        </div>
                        <div>
                            {/* Annual Bonus */}
                            <Input
                                type="number"
                                label="Annual Bonus"
                                name="annual_bonus"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                value={payment?.allowances?.annual_bonus || '-'}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </div>

                <div className="border border-[#e6e5e5] p-3 mb-3">
                    <h2 className="text-lg font-semibold mb-5">Deductions</h2>
                    <div className="grid grid-cols-2 gap-[100px]">
                        <div>
                            {/* Social Security */}
                            <Input
                                type="number"
                                label="Social Security"
                                name="social_security"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                value={payment?.deductions?.socail_security || '-'}
                                readOnly={true}
                            />
                        </div>
                        <div>
                            {/* Annual Bonus */}
                            <Input
                                type="number"
                                label="Other Deduction"
                                name="other_deduction"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                value={payment?.deductions?.other_deduction || '-'}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </div>

                <div className="border border-[#e6e5e5] p-3 mb-3">
                    <h2 className="text-lg font-semibold mb-5">Payment Result</h2>
                    <div className="grid grid-cols-2 gap-[100px]">
                        {/* Net Salary */}
                        <Input
                            label="Net Salary"
                            name="net_salary"
                            containerClassName="mb-3"
                            labelClassName="text-[#5c5c5c] text-sm"
                            inputClassName="border-0 border-b border-b-[#9c9c9c]"
                            value={payment?.net_salary || '-'}
                            readOnly={true}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2" onClick={goBack}>Back</button>
                </div>

            </div>

        </>
    )
}

export default PaymentHistoryDetail