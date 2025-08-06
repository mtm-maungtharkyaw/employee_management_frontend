import { useState, useEffect } from "react"

// axios instance
import axiosInstance from "../../api/axiosInstance"

// components
import Pagination from "../common/Pagination"

const DepartmentListCard = () => {
    const [departments, setDepartments] = useState([])
    const [pagination, setPagination] = useState({
        limit: 10,
        page: 1,
        total: 1,
        totalPages: 1
    })

    const fetchDepartments = async (page = 1, limit = 100) => {
        try {
            const dep_data = await axiosInstance.post('/department', {
                page,
                limit,
            })
            setDepartments(dep_data.list)
            setPagination(dep_data.pagination)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchDepartments()
    }, [])

    return (
        <>
            <h2 className="mb-2 font-semibold dark-blue">Department List</h2>
            <div className="max-h-[260px] overflow-y-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className="text-[#00836b] text-sm">
                            <th>No</th>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((department, index) => (
                            <tr key={department._id}>
                                <th>{index + 1}</th>
                                <td>{department.name}</td>
                                <td>{department.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default DepartmentListCard