import React, { useEffect, useState } from 'react'

// icons
import { IoAddCircle } from "react-icons/io5"
import { FaChevronLeft } from "react-icons/fa"
import { FaChevronRight } from "react-icons/fa"

// react-router-dom
import { useNavigate, NavLink } from "react-router-dom"

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import Loading from '../../components/common/Loading'
import Pagination from '../../components/common/Pagination'

// axios instance
import axiosInstance from "../../api/axiosInstance"

// context
import { useAuth } from "../../contexts/AuthContext"

// constants
import { AUTH_ROLES } from "../../constants/role"

// moment
import moment from 'moment'

export default function Employee() {
    const authCtx = useAuth()
    const [employees, setEmployees] = useState([])
    const [departmentOptions, setDepartmentOptions] = useState([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({
        limit: 10,
        page: 1,
        total: 1,
        totalPages: 1
    })
    const [filterOptions, setFilterOptions] = useState({
        department_id: '',
        name: ''
    })

    const navigate = useNavigate()

    const breadcrumb_items = [{
        label: "Employee"
    }]

    const goToEmployeeCreatePage = () => {
        navigate("/employees/create")
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

    const fetchEmployee = async (page = 1, limit = 10, filter = {department_id: '', name: ''}) => {
        setLoading(true)
        try {
            const emp_data = await axiosInstance.post('/employee/', {
                page,
                limit,
                department_id: filter.department_id,
                name: filter.name
            })
            setEmployees(emp_data.list)
            setPagination(emp_data.pagination)
        } catch (error) {
            console.log(error.response?.data)
        } finally {
            setLoading(false)
        }
    }

    const onChangeSearchName = (name) => {
        setFilterOptions(prev => ({
            ...prev,
            name
        }))
    }

    const onChangeSearchDepartment = (department_id) => {
        setFilterOptions(prev => ({
            ...prev,
            department_id
        }))
    }

    const searchEmployee = () => {
        fetchEmployee(1, pagination.limit, filterOptions)
    }

    const onPageChange = async (page) => {
        fetchEmployee(page, pagination.limit, filterOptions)
    }

    const formatDate = (isoDate) => {
        if (!isoDate) return ""
        
        const formatted = moment(isoDate).format('DD/MM/YYYY')
        return formatted
    }

    useEffect(() => {
        fetchEmployee(pagination.page, pagination.limit)
        fetchDepartmentOptions()
    }, [])

    return (
        <>
            {loading && <Loading />}
            <Breadcrumbs items={breadcrumb_items} />

            <div className='flex justify-between items-end mb-5'>
                {/* Filter Options */}
                <div className='filter flex items-end space-x-2'>
                    <div>
                        <label htmlFor="" className='block mb-1'>Department</label>
                        <select id='' className="select bg-white w-[200px]" onChange={(e) => onChangeSearchDepartment(e.target.value)}>
                            <option value="">All</option>
                            {departmentOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="" className='block mb-1'>Employee Name</label>
                        <input 
                            type="text" 
                            placeholder="Employee Name" 
                            className="input bg-white w-[200px]"
                            value={filterOptions.name}
                            onChange={(e) => onChangeSearchName(e.target.value)}
                        />
                    </div>

                    <button className="btn bg-[#4caf93] text-white border-none" onClick={searchEmployee}>Search</button>
                </div>
                <div>
                    {authCtx.authUser?.role === AUTH_ROLES.ADMIN && (
                        <button className="btn bg-[#4caf93] text-white border-none" onClick={goToEmployeeCreatePage}>Add <IoAddCircle size={22} /></button>
                    )}
                </div>
            </div>
            {(!loading && employees.length == 0) && <h1>There is no employee lists</h1>}
            {(!loading && employees.length > 0) && (
                <div>
                    <div className="overflow-x-auto rounded-sm border border-[#e6e5e5] bg-[#fefefe]">
                        <table className="table">
                            {/* head */}
                            <thead className="bg-gray-100 text-[#00836b] text-sm font-bold">
                                <tr>
                                    <th>No</th>
                                    <th>Employee Id</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Position</th>
                                    <th>Join Date</th>
                                    <th>Gender</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {employees.map((employee, index) => (
                                    <tr key={employee._id} className="hover:bg-gray-50 border-b border-[#e6e5e5]">
                                        <th>{index + 1}</th>
                                        <td><NavLink to={employee.employee_id} className="underline">{employee.employee_id}</NavLink></td>
                                        <td>{employee.name}</td>
                                        <td>{employee?.department?.name}</td>
                                        <td>{employee.position}</td>
                                        <td>{formatDate(employee.join_date)}</td>
                                        <td>{employee.personal?.gender}</td>
                                    </tr>
                                ))}
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
