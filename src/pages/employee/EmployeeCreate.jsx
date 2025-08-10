import { useEffect, useState, useRef } from "react"

// components
import Breadcrumbs from "../../components/Breadcrumbs"
import Input from "../../components/employee/Input"
import SelectBox from "../../components/employee/SelectBox"
import Loading from "../../components/common/Loading"

// icons
import { FiX } from 'react-icons/fi'
import { FaEdit } from "react-icons/fa"

// axios instance
import axiosInstance from "../../api/axiosInstance"

// helper
import { validateData } from "../../utils/helper"

// toastify
import { ToastContainer, toast } from 'react-toastify'

// react router dom
import { useNavigate } from 'react-router-dom'

// validation
import Joi from "joi"

// constants
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from "../../constants/constant"

const BREADCRUMB_ITEMS = [{ label: "Employee", to: "/employees" }, { label: "Add" }]

const EmployeeCreate = () => {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)

    const [departmentOptions, setDepartmentOptions] = useState([])
    const [jobTypeOptions, setJobTypeOptions] = useState([])
    const [positionOptions, setPositionOptions] = useState([])

    const [employeeId, setEmployeeId] = useState('')
    const [name, setName] = useState('')
    const [joinDate, setJoinDate] = useState('')
    const [department, setDepartment] = useState('')
    const [position, setPosition] = useState('')
    const [jobType, setJobType] = useState('')
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
    const [profile, setProfile] = useState({
        selectedFile: null,
        previewUrl: null
    })


    const [errors, setErrors] = useState(null)

    const [isLoading, setIsLoading] = useState(false)

    const employeeCreateSchema = Joi.object({
        employeeId: Joi.string().required(),
        name: Joi.string().required(),
        joinDate: Joi.date().allow(null, ''),
        officeEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).allow(null, ''),
        department: Joi.string().required(),
        position: Joi.string().required(),
        jobType: Joi.string().required(),
        dob: Joi.date().required(),
        phone: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        contactName: Joi.string().required(),
        contactPhone: Joi.string().required(),
    }).unknown();

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message)
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const clearErrorMessages = () => {
        setErrors(null)
    }

    const goToEmployeeListPage = () => {
        navigate('/employees')
    }

    const uploadFile = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = (event) => {
        setErrors(prev => ({
            ...prev,
            profile: ''
        }))
        const file = event.target.files[0]

        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    profile: "Please select an image file (e.g., JPG, PNG, GIF)"
                }))
                setProfile({
                    selectedFile: null,
                    previewUrl: null
                })
                return
            }

            if (file.size > 5 * 1024 * 1024) { // 5 MB in bytes
                setErrors(prev => ({
                    ...prev,
                    profile: 'Image size should not exceed 5MB.'
                }))
                setProfile({
                    selectedFile: null,
                    previewUrl: null
                })
                return;
            }

            setProfile({
                selectedFile: file,
                previewUrl: URL.createObjectURL(file)
            })
        }
    }

    const removeFileSelect = () => {
        setProfile({
            selectedFile: null,
            previewUrl: null
        })

        setErrors(prev => ({
            ...prev,
            profile: ''
        }))

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    };


    const createEmployee = async () => {
        clearErrorMessages()
        const validationErrors = validateData(employeeCreateSchema, {
            employeeId,
            name,
            joinDate,
            officeEmail,
            department,
            position,
            jobType,
            dob,
            phone,
            email,
            contactName,
            contactPhone
        })

        if (validationErrors) {
            setErrors(validationErrors)
            return
        }

        const formData = new FormData();

        // 3. Append simple string fields directly
        formData.append('employee_id', employeeId)
        formData.append('name', name)
        formData.append('join_date', joinDate)
        formData.append('office_email', officeEmail)
        formData.append('department', department)
        formData.append('position', position)
        formData.append('job_type', jobType)

        formData.append('education', JSON.stringify({
            language_skill: languageSkill,
            programming_skill: programmingSkill,
            graduate_university: graduateUniversity,
            graduate_degree: graduateDegree,
        }))

        formData.append('personal', JSON.stringify({
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
        }))

        if (profile.selectedFile) {
            formData.append('profile', profile.selectedFile)
        }

        setIsLoading(true)
        const start = Date.now()

        try {
            const data = await axiosInstance.post('/employee/create', formData)
            showToast("success", "Successfully Created Employee")
            const elapsed = Date.now() - start
            const delay = Math.max(1000 - elapsed, 0)
            setTimeout(() => {
                setIsLoading(false)
                goToEmployeeListPage()
            }, delay)
        } catch (error) {
            console.error(error)
            setIsLoading(false)
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", "Something Went Wrong")
            }
        }
    }

    const fetchDepartmentOptions = async () => {
        try {
            const { options } = await axiosInstance.get('/department/options')
            if (options.length > 0) {
                setDepartmentOptions(options.map(data => ({ label: data.name, value: data._id })))
            }
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", "Something Went Wrong")
            }
        }
    }

    const fetchJobTypeOptions = async () => {
        try {
            const { options } = await axiosInstance.get('/job-type/options')
            if (options.length > 0) {
                setJobTypeOptions(options)
            }
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", "Something Went Wrong")
            }
        }
    }

    const fetchPostionOptions = async () => {
        try {
            const { options } = await axiosInstance.get('/position/options')
            if (options.length > 0) {
                setPositionOptions(options.map(data => ({ label: data.name, value: data._id })))
            }
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", "Something Went Wrong")
            }
        }
    }

    useEffect(() => {
        fetchDepartmentOptions()
        fetchJobTypeOptions()
        fetchPostionOptions()
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

            <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5">
                <div className="mb-3 flex space-x-5">
                    {/* Employee Image */}
                    <div className="w-[300px] border border-[#e6e5e5] p-3 flex items-center justify-center relative">
                        {profile.previewUrl ? (
                            <>
                                <img
                                    src={profile.previewUrl}
                                    alt="Profile Preview"
                                    className="w-full h-auto"
                                />
                                <div className="absolute top-5 right-5 space-x-2">
                                    <button className=" btn bg-[#6366f1] text-white border-none" onClick={uploadFile}>
                                        <FaEdit size={16} className="font-semibold" />
                                    </button>
                                    <button className=" btn bg-[#f97373] text-white border-none" onClick={removeFileSelect}>
                                        <FiX size={16} className="font-semibold" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button className="btn bg-[#4caf93] text-white border-none" onClick={uploadFile}>Upload Profile</button>
                        )}
                        {errors?.profile && <small className="text-[#fc1303] absolute bottom-3">{errors.profile}</small>}
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
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
                                    inputClassName="border-b border-b-[#9c9c9c]"
                                    value={employeeId}
                                    onChange={setEmployeeId}
                                    errorMessage={errors?.employeeId}
                                />
                                {/* Emplyee Name */}
                                <Input
                                    label="Name"
                                    name="name"
                                    placeholder="Enter Employee Name"
                                    inputClassName="border-b border-b-[#9c9c9c]"
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
                                    inputClassName="border-b border-b-[#9c9c9c]"
                                    value={joinDate}
                                    onChange={setJoinDate}
                                    type="date"
                                    errorMessage={errors?.joinDate}
                                />
                                {/* Employee Position */}
                                <SelectBox
                                    label="Select Position"
                                    options={positionOptions}
                                    name="Position"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    value={position}
                                    onChange={setPosition}
                                    errorMessage={errors?.position}
                                />
                                {/* Employee Departments */}
                                <SelectBox
                                    label="Select Department"
                                    options={departmentOptions}
                                    name="department"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    value={department}
                                    onChange={setDepartment}
                                    errorMessage={errors?.department}
                                />
                            </div>
                            <div>
                                <SelectBox
                                    label="Select Job Type"
                                    options={jobTypeOptions}
                                    name="Type"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    value={jobType}
                                    onChange={setJobType}
                                    errorMessage={errors?.jobType}
                                />
                                {/* Employee Office Email */}
                                <Input
                                    label="Office Email"
                                    name="office_email"
                                    placeholder="Enter Office Email"
                                    containerClassName="mb-3"
                                    labelClassName="text-[#5c5c5c] text-sm"
                                    inputClassName="border-b border-b-[#9c9c9c]"
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
                                inputClassName="border-b border-b-[#9c9c9c]"
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
                                inputClassName="border-b border-b-[#9c9c9c]"
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
                                inputClassName="border-b border-b-[#9c9c9c]"
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
                                inputClassName="border-b border-b-[#9c9c9c]"
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
                                inputClassName="border-b border-b-[#9c9c9c]"
                                type="date"
                                value={dob}
                                onChange={setDob}
                                errorMessage={errors?.dob}
                            />
                            {/* Employee Gender */}
                            <SelectBox
                                label="Select Gender"
                                options={GENDER_OPTIONS}
                                name="gender"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-b border-b-[#9c9c9c]"
                                value={gender}
                                onChange={setGender}
                                errorMessage={errors?.gender}
                            />
                            {/* Employee MaritalStatus */}
                            <SelectBox
                                label="Select Marital Status"
                                options={MARITAL_STATUS_OPTIONS}
                                name="marital"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-b border-b-[#9c9c9c]"
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
                                inputClassName="border-b border-b-[#9c9c9c]"
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
                                inputClassName="border-b border-b-[#9c9c9c]"
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
                                inputClassName="border-b border-b-[#9c9c9c]"
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
                                inputClassName="border-b border-b-[#9c9c9c]"
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
                                inputClassName="border-b border-b-[#9c9c9c]"
                                value={religion}
                                onChange={setReligion}
                                errorMessage={errors?.religion}
                            />
                        </div>
                        <div>
                            {/* Employee Contact Name */}
                            <Input
                                label="Contact Name"
                                name="contact-name"
                                placeholder="Enter Contact Name"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-b border-b-[#9c9c9c]"
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
                                inputClassName="border-b border-b-[#9c9c9c]"
                                value={contactPhone}
                                onChange={setContactPhone}
                                errorMessage={errors?.contactPhone}
                            />
                            {/* Employee Contact Relation */}
                            <Input
                                label="Relation"
                                name="relation"
                                placeholder="Enter Relation"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-b border-b-[#9c9c9c]"
                                value={relation}
                                onChange={setRelation}
                                errorMessage={errors?.relation}
                            />
                            {/* Employee Address */}
                            <Input
                                label="Address"
                                name="address"
                                placeholder="Enter Address"
                                containerClassName="mb-3"
                                labelClassName="text-[#5c5c5c] text-sm"
                                inputClassName="border-b border-b-[#9c9c9c]"
                                value={address}
                                onChange={setAddress}
                                errorMessage={errors?.address}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="bg-gray-500  btn text-white border-none w-[120px] py-2" onClick={goToEmployeeListPage}>Cancel</button>
                    <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2" onClick={createEmployee}>Add</button>
                </div>
            </div>
        </>
    )
}

export default EmployeeCreate