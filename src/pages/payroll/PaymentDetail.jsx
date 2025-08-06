import { useState, useEffect } from "react"

// react router dom
import { useParams, useNavigate } from "react-router-dom"

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import Button from '../../components/common/Button'
import Loading from '../../components/common/Loading'
import Input from "../../components/payment/Input"
import SelectBox from "../../components/employee/SelectBox"

// toastify
import { ToastContainer, toast } from 'react-toastify'

// axios instance
import axiosInstance from "../../api/axiosInstance"

// joi
import Joi from "joi"

// moment
import moment from "moment"

// helper
import { validateData } from "../../utils/helper"

// constant
import { PAYROLL_STATUS } from "../../constants/constant"

const BREADCRUMB_ITEMS = [{
    label: "Payroll",
    to: "/payroll"
}, {
    label: "Payment Detail"
}]

const PaymentDetail = () => {
    const { employeeId } = useParams()
    const navigate = useNavigate()

    const [paymentDetail, setPaymentDetail] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState(null)

    const goBack = () => {
        navigate('/payroll')
    }

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const onChangePaymentDate = (date) => {
        const [year, month] = date.split("-")
        setPaymentDetail(prev => ({
            ...prev,
            year: Number(year),
            month: Number(month)
        }))
    }

    const onChangeSkill = (skill, amount) => {
        const numericAmount = Number(amount)
        if (isNaN(numericAmount) || numericAmount < 0) return

        setPaymentDetail(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [skill]: numericAmount
            }
        }))
    }

    const onChangeAllowance = (type, amount) => {
        const numericAmount = Number(amount)
        if (isNaN(numericAmount) || numericAmount < 0) return

        setPaymentDetail(prev => ({
            ...prev,
            allowances: {
                ...prev.allowances,
                [type]: numericAmount
            }
        }))
    }

    const onChangeDeductions = (type, amount) => {
        const numericAmount = Number(amount)
        if (isNaN(numericAmount) || numericAmount < 0) return

        setPaymentDetail(prev => ({
            ...prev,
            deductions: {
                ...prev.deductions,
                [type]: numericAmount
            }
        }))
    }

    const onChangePaymentStatus = (value) => {
        const selectedStatus = PAYROLL_STATUS.filter(status => status.value == value)[0]
        setPaymentDetail(prev => ({
            ...prev,
            status: selectedStatus ? selectedStatus.value : ''
        }))
    }

    const fetchPayment = async () => {
        setIsLoading(true)
        try {
            const payment = await axiosInstance.get(`/payment/detail/${employeeId}`)
            setPaymentDetail(payment)
        } catch (error) {
            console.error(error)
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

    const calculatePayment = async () => {
        setErrors(null)
        const validationSchema = Joi.object({
            paymentMonth: Joi.string().required()
        })

        const validationErrors = validateData(validationSchema, { paymentMonth: getFormattedMonth(paymentDetail?.year, paymentDetail?.month) })

        if (validationErrors) {
            setErrors(validationErrors)
            return
        }

        try {
            const updatedPayment = await axiosInstance.post('/payment/calculate', {
                employeeId: paymentDetail?.employee?._id,
                status: paymentDetail?.status,
                year: paymentDetail?.year,
                month: paymentDetail?.month,
                skills: paymentDetail?.skills,
                allowances: paymentDetail?.allowances,
                deductions: paymentDetail?.deductions
            })
            showToast("success", "Successfully Updated Payment")
            fetchPayment()
        } catch (error) {
            console.error(error)
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", "Something Went Wrong")
            }
        }
    }

    const getFormattedMonth = (year, month) => {
        if (year && month) {
            const formattedMonth = `${year}-${String(month).padStart(2, '0')}`
            return formattedMonth
        }

        return ''
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
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                value={paymentDetail?.employee?.employee_id}
                                disabled={true}
                            />
                            {/* Emplyee Name */}
                            <Input
                                label="Name"
                                name="name"
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={paymentDetail?.employee?.name}
                                disabled={true}
                            />
                        </div>
                        <div>
                            {/* Basic Salary */}
                            <Input
                                label="Basic Salary"
                                name="basic_salary"
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={paymentDetail?.basic_salary}
                                disabled={true}
                            />

                            {/* Payment Month */}
                            <Input
                                type="month"
                                label="Payment Month"
                                name="payment_month"
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={getFormattedMonth(paymentDetail?.year, paymentDetail?.month)}
                                onChange={(e) => onChangePaymentDate(e.target.value)}
                                errorMessage={errors?.paymentMonth}
                            />

                            {/* Status */}
                            <SelectBox
                                label="Payment Status"
                                options={PAYROLL_STATUS}
                                name="payroll_status"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={paymentDetail?.status ? paymentDetail.status : ''}
                                onChange={onChangePaymentStatus}
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
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={paymentDetail?.skills?.management_skill}
                                onChange={e => onChangeSkill('management_skill', e.target.value)}
                            />

                            {/* Technical Skill */}
                            <Input
                                type="number"
                                label="Technical Skill"
                                name="technical_skill"
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={paymentDetail?.skills?.technical_skill}
                                onChange={e => onChangeSkill('technical_skill', e.target.value)}
                            />
                        </div>
                        <div>
                            {/* Technical Skill */}
                            <Input
                                type="number"
                                label="Project Skill"
                                name="project_skill"
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={paymentDetail?.skills?.project_skill}
                                onChange={e => onChangeSkill('project_skill', e.target.value)}
                            />

                            {/* Japanese Skill */}
                            <Input
                                type="number"
                                label="Japanese Skill"
                                name="japanese_skill"
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={paymentDetail?.skills?.japanese_skill}
                                onChange={e => onChangeSkill('japanese_skill', e.target.value)}
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
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={paymentDetail?.allowances?.travelling}
                                onChange={e => onChangeAllowance('travelling', e.target.value)}
                            />
                        </div>
                        <div>
                            {/* Annual Bonus */}
                            <Input
                                type="number"
                                label="Annual Bonus"
                                name="annual_bonus"
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={paymentDetail?.allowances?.annual_bonus}
                                onChange={e => onChangeAllowance('annual_bonus', e.target.value)}
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
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={paymentDetail?.deductions?.socail_security}
                                onChange={e => onChangeDeductions('socail_security', e.target.value)}
                            />
                        </div>
                        <div>
                            {/* Annual Bonus */}
                            <Input
                                type="number"
                                label="Other Deduction"
                                name="other_deduction"
                                inputClassName="border-b border-b-[#9c9c9c] dark-blue"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={paymentDetail?.deductions?.other_deduction}
                                onChange={e => onChangeDeductions('other_deduction', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {(paymentDetail?.net_salary !== 0) && (
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
                                value={paymentDetail?.net_salary}
                                readOnly={true}
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2" onClick={calculatePayment}>Update</button>
                    <button className="bg-gray-500  btn text-white border-none w-[120px] py-2" onClick={goBack}>Cancel</button>
                </div>
            </div>
        </>
    )
}

export default PaymentDetail