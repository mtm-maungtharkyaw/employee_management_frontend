import React, { useEffect, useState } from 'react'

// icons
import { IoAddCircle } from "react-icons/io5"
import { FaChevronLeft } from "react-icons/fa"
import { FaChevronRight } from "react-icons/fa"

// react-router-dom
import { useNavigate } from "react-router-dom"

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import Loading from '../../components/common/Loading'
import Pagination from '../../components/common/Pagination'

import axiosInstance from "../../api/axiosInstance"

export default function Employee() {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({
        limit: 10,
        page: 1,
        total: 1,
        totalPages: 1
    })

    const navigate = useNavigate()

    const breadcrumb_items = [{
        label: "Employee"
    }]

    const goToEmployeeCreatePage = () => {
        navigate("/employees/create")
    }

    const fetchEmployee = async (page = 1, limit = 10) => {
        setLoading(true)
        const start = Date.now()
        let emp_data = null
        try {
            emp_data = await axiosInstance.post('/employee/', {
                page,
                limit
            })
        } catch (error) {
            console.log(error.response?.data)
        } finally {
            const elapsed = Date.now() - start
            const delay = Math.max(600 - elapsed, 0)
            setTimeout(() => {
                if(emp_data) {
                    setEmployees(emp_data.list)
                    setPagination(emp_data.pagination)
                }
                setLoading(false)
            }, delay)
        }
    }

    const onPageChange = async (page) => {
        fetchEmployee(page, pagination.limit)
    }

    useEffect(() => {
        fetchEmployee()
        // console.log(employees)
    }, [])

    return (
        <>
            {loading && <Loading />}
            <Breadcrumbs items={breadcrumb_items} />
            <div className='flex justify-between items-end mb-2'>
                <div className='filter flex items-end space-x-2'>
                    <div>
                        <label htmlFor="" className='block mb-1'>Department</label>
                        <select id='' defaultValue="" className="select bg-white w-[200px]">
                            <option disabled={true}></option>
                            <option>Dev 01</option>
                            <option>Dev 02</option>
                            <option>Dev 03</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="" className='block mb-1'>Position</label>
                        <select id='' defaultValue="" className="select bg-white w-[200px]">
                            <option disabled={true}></option>
                            <option>Junior</option>
                            <option>Senior</option>
                            <option>Manager</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="" className='block mb-1'>Employee Id</label>
                        <input type="text" placeholder="neutral" className="input bg-white w-[200px]" />
                    </div>

                    <button className="btn bg-[#4caf93] text-white border-none">Search</button>
                </div>
                <div>
                    <button className="btn bg-[#4caf93] text-white border-none" onClick={goToEmployeeCreatePage}>Add <IoAddCircle size={22} /></button>
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
                                    <tr className="hover:bg-gray-50 border-b border-[#e6e5e5]">
                                        <th>{index + 1}</th>
                                        <td>{employee.employee_id}</td>
                                        <td>{employee.name}</td>
                                        <td>{employee.department}</td>
                                        <td>{employee.position}</td>
                                        <td>{employee.join_date}</td>
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
