// react
import { useEffect, useState } from 'react'

// react router dom
import { useParams, useNavigate } from 'react-router-dom'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import Loading from '../../components/common/Loading'
import Input from '../../components/employee/Input'

// icons
import { BiSolidImageAdd } from "react-icons/bi"

// toastify
import { ToastContainer, toast } from 'react-toastify'

// moment
import moment from 'moment'

// axiosInstance
import axiosInstance from '../../api/axiosInstance'

const BREADCRUMB_ITEMS = [{ label: "Employee", to: "/employees" }, { label: "Detail" }]

const EmployeeDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [employee, setEmployee] = useState(null)
    const [fullAccess, setFullAccess] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const formatDate = (isoDate) => {
        if (!isoDate) return ""

        const formatted = moment(isoDate).format('DD/MM/YYYY')
        return formatted
    }

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const goBack = () => {
        navigate('/employees')
    }

    const fetchEmployee = async (emp_id) => {
        setIsLoading(true)
        try {
            const data = await axiosInstance.get(`/employee/${emp_id}`)
            setEmployee(data.employee)
            setFullAccess(data.fullDataAccess)
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", "Something went wrong")
            }
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchEmployee(id)
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

            {/* Limit Data Access View */}
            {(!isLoading && !fullAccess) && (
                <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5">
                    <div className="mb-3 flex space-x-5">
                        {/* Employee Image */}
                        <div className="w-[200px] border border-[#e6e5e5] p-3 flex items-center justify-center">
                            <BiSolidImageAdd size={100} />
                        </div>

                        <div className="flex-1 border border-[#e6e5e5] p-3">
                            <div className="grid grid-cols-2 gap-[50px]">
                                <div>
                                    {/* Employee Id */}
                                    <Input
                                        label="Employee Id" 
                                        name="employee_id"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={employee?.employee_id}
                                        readOnly={true}
                                    />
                                    {/* Employee Name */}
                                    <Input
                                        label="Name"
                                        name="employee_name"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={employee?.name}
                                        readOnly={true}
                                    />
                                    {/* Employee Join Date */}
                                    <Input
                                        label="Join Date"
                                        name="join_date"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={formatDate(employee?.join_date)}
                                        readOnly={true}
                                    />
                                    {/* Employee Position */}
                                    <Input
                                        label="Position"
                                        name="position"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={employee?.position?.name}
                                        readOnly={true}
                                    />
                                    {/* Employee Department */}
                                    <Input
                                        label="Department"
                                        name="department"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={employee?.department?.name}
                                        readOnly={true}
                                    />
                                </div>
                                <div>
                                    {/* Employee Gender */}
                                    <Input
                                        label="Gender"
                                        name="gender"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={employee?.personal?.gender}
                                        readOnly={true}
                                    />
                                    {/* Employee Language */}
                                    <Input
                                        label="Language"
                                        name="language"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={employee?.education?.language_skill}
                                        readOnly={true}
                                    />
                                    {/* Employee Graduated University */}
                                    <Input
                                        label="Graduated University"
                                        name="graduate_university"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={employee?.education?.graduate_university}
                                        readOnly={true}
                                    />
                                    {/* Employee Graduate Degree */}
                                    <Input
                                        label="Graduate Degree"
                                        name="graduate_degree"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={employee?.education?.graduate_degree}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Data Access View */}
            {(!isLoading && fullAccess) && (
                <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5">
                    <div className="mb-3 flex space-x-5">
                        {/* Employee Image */}
                        <div className="w-[200px] border border-[#e6e5e5] p-3 flex items-center justify-center">
                            <BiSolidImageAdd size={100} />
                        </div>

                        <div className="flex-1 border border-[#e6e5e5] p-3">
                            <h2 className="text-lg font-semibold mb-5">Office Information</h2>
                            <div className="grid grid-cols-2 gap-[50px]">
                                <div>
                                    {/* Employee Id */}
                                    <Input
                                        label="Employee Id"
                                        name="employee_id"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={employee?.employee_id}
                                        readOnly={true}
                                    />
                                    {/* Employee Name */}
                                    <Input
                                        label="Name"
                                        name="employee_name"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={employee?.name}
                                        readOnly={true}
                                    />
                                    {/* Employee Join Date */}
                                    <Input
                                        label="Join Date"
                                        name="join_date"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={formatDate(employee?.join_date)}
                                        readOnly={true}
                                    />
                                    {/* Employee Position */}
                                    <Input
                                        label="Position"
                                        name="position"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={employee?.position}
                                        readOnly={true}
                                    />
                                    {/* Employee Department */}
                                    <Input
                                        label="Department"
                                        name="department"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={employee?.department?.name}
                                        readOnly={true}
                                    />
                                </div>
                                <div>
                                    {/* Employee Job Type */}
                                    <Input
                                        label="Type"
                                        name="job-type"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={employee?.department?.name}
                                        readOnly={true}
                                    />
                                    {/* Employee Office Email */}
                                    <Input
                                        label="Office Email"
                                        name="office-email"
                                        containerClassName="mb-3"
                                        labelClassName="text-[#5c5c5c] text-sm"
                                        inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                        value={employee?.office_email}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Education Detail Information */}
                    <div className="border border-[#e6e5e5] p-3 mb-3">
                        <h2 className="text-lg font-semibold mb-5">Education Detail Information</h2>
                        <div className="grid grid-cols-2 gap-[100px]">
                            <div>
                                {/* Employee Language */}
                                <Input
                                    label="Language Skill"
                                    name="language"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.education?.language_skill}
                                    readOnly={true}
                                />
                                {/* Employee Language */}
                                <Input
                                    label="Programming Skill"
                                    name="programming"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.education?.programming_skill}
                                    readOnly={true}
                                />
                            </div>
                            <div>
                                {/* Employee Graduated University */}
                                <Input
                                    label="Graduated University"
                                    name="graduate_university"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.education?.graduate_university}
                                    readOnly={true}
                                />
                                {/* Employee Graduate Degree */}
                                <Input
                                    label="Graduate Degree"
                                    name="graduate_degree"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.education?.graduate_degree}
                                    readOnly={true}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Personal Detail Information */}
                    <div className="border border-[#e6e5e5] p-3 mb-3">
                        <h2 className="text-lg font-semibold mb-5">Personal Detail Information</h2>
                        <div className="grid grid-cols-2 gap-[100px]">
                            <div>
                                {/* Employee DOB */}
                                <Input
                                    label="DOB"
                                    name="dob"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={formatDate(employee?.personal?.dob)}
                                    readOnly={true}
                                />
                                {/* Employee Gender */}
                                <Input
                                    label="Gender"
                                    name="gender"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.personal?.gender}
                                    readOnly={true}
                                />
                                {/* Employee MaritalStatus */}
                                <Input
                                    label="Marital Status"
                                    name="marital"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.personal?.marital_status}
                                    readOnly={true}
                                />
                                {/* Employee NRC NO */}
                                <Input
                                    label="NRC NO"
                                    name="nrc-no"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.personal?.nrc_no}
                                    readOnly={true}
                                />
                                {/* Employee Phone */}
                                <Input
                                    label="Phone"
                                    name="phone"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.personal?.phone}
                                    readOnly={true}
                                />
                                {/* Employee Email */}
                                <Input
                                    label="Email"
                                    name="email"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.personal?.email}
                                    readOnly={true}
                                />
                                {/* Employee BankAccount */}
                                <Input
                                    label="Bank Account"
                                    name="bank-account"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.personal?.bank_account}
                                    readOnly={true}
                                />
                                {/* Employee Religion */}
                                <Input
                                    label="Religion"
                                    name="religion"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.personal?.religion}
                                    readOnly={true}
                                />
                            </div>
                            <div>
                                {/* Employee Contact Name */}
                                <Input
                                    label="Contact Name"
                                    name="contact-name"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.personal?.emergency_contact?.name}
                                    readOnly={true}
                                />
                                {/* Employee Contact Phone */}
                                <Input
                                    label="Contact Phone"
                                    name="contact-phone"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.personal?.emergency_contact?.phone}
                                    readOnly={true}
                                />
                                {/* Employee Contact Relation */}
                                <Input
                                    label="Relation"
                                    name="relation"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.personal?.emergency_contact?.relation}
                                    readOnly={true}
                                />
                                {/* Employee Address */}
                                <Input
                                    label="Address"
                                    name="address"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-0 border-b border-b-[#9c9c9c]"
                                    value={employee?.personal?.address}
                                    readOnly={true}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2" onClick={goBack}>Back</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default EmployeeDetail