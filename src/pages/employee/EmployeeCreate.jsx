import { useEffect, useState } from "react";

// components
import Breadcrumbs from "../../components/Breadcrumbs"
import Input from "../../components/employee/Input"
import SelectBox from "../../components/employee/SelectBox"
import Loading from "../../components/common/Loading"

// icons
import { BiSolidImageAdd } from "react-icons/bi";

// axios instance
import axiosInstance from "../../api/axiosInstance";

// helper
import { validateData } from "../../utils/helper";

// toastify
import { ToastContainer, toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom'

// validation
import Joi from "joi";

const BREADCRUMB_ITEMS = [{ label: "Employee", to: "/employees" }, { label: "Add" }]

const genderOptions = [
    {
        label: 'Male',
        value: 'male'
    },
    {
        label: 'Female',
        value: 'female'
    }
]

const maritalStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'separated', label: 'Separated' },
];

const EmployeeCreate = () => {
    const navigate = useNavigate();

    const [employeeId, setEmployeeId] = useState('')
    const [name, setName] = useState('')
    const [joinDate, setJoinDate] = useState('')
    const [officeEmail, setOfficeEmail] = useState('')
    const [languageSkill, setLanguageSkill] = useState('')
    const [programmingSkill, setProgrammingSkill] = useState('')
    const [graduateUniversity, setGraduateUniversity] = useState('')
    const [graduateDegree, setGraduateDegree] = useState('')
    const [dob, setDob] = useState('')
    const [nrcNo, setNrcNo] = useState('')
    const [gender, setGender] = useState('')
    const [maritalStatus, setMaritalStatus] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [bankAccount, setBankAccount] = useState('')
    const [religion, setReligion] = useState('')
    const [contactName, setContactName] = useState('')
    const [relation, setRelation] = useState('')
    const [contactPhone, setContactPhone] = useState('')
    const [address, setAddress] = useState('')
    const [errors, setErrors] = useState(null)

    const [isLoading, setIsLoading] = useState(false)

    const employeeCreateSchema = Joi.object({
        employeeId: Joi.string().required(),
        name: Joi.string().required(),
        joinDate: Joi.date().allow(null, ''),
        officeEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).allow(null, ''),
        languageSkill: Joi.string().allow(null, ''),
        programmingSkill: Joi.string().allow(null, ''),
        graduateUniversity: Joi.string().allow(null, ''),
        graduateDegree: Joi.string().allow(null, ''),
        dob: Joi.date().required(),
        nrcNo: Joi.string().allow(null, ''),
        gender: Joi.string().allow(null, ''),
        phone: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        bankAccount: Joi.string().allow(null, ''),
        religion: Joi.string().allow(null, ''),
        contactName: Joi.string().required(),
        contactPhone: Joi.string().required(),
        relation: Joi.string().allow(null, ''),
        address: Joi.string().allow(null, '')
    })

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const clearErrorMessages = () => {
        setErrors(null)
    }

    const createEmployee = async () => {
        clearErrorMessages()
        const validationErrors = validateData(employeeCreateSchema, {
            employeeId,
            name,
            joinDate,
            officeEmail,
            languageSkill,
            programmingSkill,
            graduateUniversity,
            graduateDegree,
            dob,
            nrcNo,
            gender,
            phone,
            email,
            bankAccount,
            religion,
            contactName,
            contactPhone,
            relation,
            address
        })

        if (validationErrors) {
            console.log(validationErrors)
            setErrors(validationErrors)
            return
        }

        const employeeData = {
            employee_id: employeeId,
            name: name,
            join_date: joinDate,
            office_email: officeEmail,
            education: {
                language_skill: languageSkill,
                programming_skill: programmingSkill,
                graduate_university: graduateUniversity,
                graduate_degree: graduateDegree,
            },
            personal: {
                dob: dob,
                gender: gender,
                address: address,
                marital_status: maritalStatus,
                nrc_no: nrcNo,
                phone: phone,
                email: email,
                bank_account: bankAccount,
                religion: religion,
                emergency_contact: {
                    name: contactName,
                    phone: contactPhone,
                    relation: relation
                }
            }
        }

        setIsLoading(true)
        const start = Date.now()

        try {
            await axiosInstance.post('/employee/create', employeeData)
            showToast("success", "Successfully Created Employee")
            const elapsed = Date.now() - start
            const delay = Math.max(1000 - elapsed, 0)
            setTimeout(() => {
                setIsLoading(false)
                navigate('/employees')
            }, delay);
        } catch (error) {
            setIsLoading(false)
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", error.message)
            }
        }
    }

    useEffect(() => {
        console.log(joinDate)
    }, [joinDate])
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
                                    placeholder="Enter Employee Id"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    value={employeeId}
                                    onChange={setEmployeeId}
                                    errorMessage={errors?.employeeId}
                                />
                                {/* Emplyee Name */}
                                <Input
                                    label="Name"
                                    name="name"
                                    placeholder="Enter Employee Name"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    value={name}
                                    onChange={setName}
                                    errorMessage={errors?.name}
                                />
                                {/* Employee Join Date */}
                                <Input
                                    label="Join Date"
                                    name="join_date"
                                    placeholder="Enter Join Ddate"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    value={joinDate}
                                    onChange={setJoinDate}
                                    type="date"
                                    errorMessage={errors?.joinDate}
                                />
                            </div>
                            <div>
                                {/* Employee Office Email */}
                                <Input
                                    label="Office Email"
                                    name="office_email"
                                    placeholder="Enter Office Email"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    value={officeEmail}
                                    onChange={setOfficeEmail}
                                    type="email"
                                    errorMessage={errors?.officeEemail}
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
                            {/* Employee Language Skill */}
                            <Input
                                label="Language Skill"
                                name="language-skill"
                                placeholder="Enter Language Skill"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={languageSkill}
                                onChange={setLanguageSkill}
                                errorMessage={errors?.languageSkill}
                            />
                            {/* Employee Programming Skill */}
                            <Input
                                label="Programming Skill"
                                name="programming-skill"
                                placeholder="Enter Programming Skill"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={programmingSkill}
                                onChange={setProgrammingSkill}
                                errorMessage={errors?.programmingSkill}
                            />
                        </div>
                        <div>
                            {/* Employee Graduate University */}
                            <Input
                                label="Graduate University"
                                name="graduate-university"
                                placeholder="Enter Graduate University"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={graduateUniversity}
                                onChange={setGraduateUniversity}
                                errorMessage={errors?.graduateUniversity}
                            />
                            {/* Employee Graduate Degree */}
                            <Input
                                label="Graduate Degree"
                                name="graduate-degree"
                                placeholder="Enter Graduate Degree"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={graduateDegree}
                                onChange={setGraduateDegree}
                                errorMessage={errors?.graduateDegree}
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
                                placeholder="Enter Date of Birth"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                type="date"
                                value={dob}
                                onChange={setDob}
                                errorMessage={errors?.dob}
                            />
                            {/* Employee Gender */}
                            <SelectBox
                                label="Select Gender"
                                options={genderOptions}
                                name="gender"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={gender}
                                onChange={setGender}
                                errorMessage={errors?.gender}
                            />
                            {/* Employee MaritalStatus */}
                            <SelectBox
                                label="Select Marital Status"
                                options={maritalStatusOptions}
                                name="marital"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={maritalStatus}
                                onChange={setMaritalStatus}
                                errorMessage={errors?.maritalStatus}
                            />
                            {/* Employee NRC NO */}
                            <Input
                                label="NRC NO"
                                name="nrc-no"
                                placeholder="Enter Nrc No"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={nrcNo}
                                onChange={setNrcNo}
                                errorMessage={errors?.nrcNO}
                            />
                            {/* Employee Phone */}
                            <Input
                                label="Phone"
                                name="phone"
                                placeholder="Enter Phone"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={phone}
                                onChange={setPhone}
                                errorMessage={errors?.phone}
                            />
                            {/* Employee Email */}
                            <Input
                                label="Email"
                                name="email"
                                placeholder="Enter Email"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={email}
                                onChange={setEmail}
                                errorMessage={errors?.email}
                            />
                            {/* Employee BankAccount */}
                            <Input
                                label="Bank Account"
                                name="bank-account"
                                placeholder="Enter Bank Account"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={bankAccount}
                                onChange={setBankAccount}
                                errorMessage={errors?.bankAccount}
                            />
                            {/* Employee Religion */}
                            <Input
                                label="Religion"
                                name="religion"
                                placeholder="Enter Religion"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={religion}
                                onChange={setReligion}
                                errorMessage={errors?.religion}
                            />
                        </div>
                        <div>
                            <Input
                                label="Contact Name"
                                name="contact-name"
                                placeholder="Enter Contact Name"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={contactName}
                                onChange={setContactName}
                                errorMessage={errors?.contactName}
                            />
                            <Input
                                label="Contact Phone"
                                name="contact-phone"
                                placeholder="Enter Contact Phone"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={contactPhone}
                                onChange={setContactPhone}
                                errorMessage={errors?.contactPhone}
                            />
                            <Input
                                label="Relation"
                                name="relation"
                                placeholder="Enter Relation"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={relation}
                                onChange={setRelation}
                                errorMessage={errors?.relation}
                            />
                            <Input
                                label="Address"
                                name="address"
                                placeholder="Enter Address"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                value={address}
                                onChange={setAddress}
                                errorMessage={errors?.address}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2" onClick={createEmployee}>Add</button>
                    <button className="bg-soft-green btn text-white border-none w-[120px] py-2">Cancel</button>
                </div>
            </div>
        </>
    )
}

export default EmployeeCreate