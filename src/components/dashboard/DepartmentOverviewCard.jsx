import { useState, useEffect } from "react"

import axiosInstance from "../../api/axiosInstance"

const DepartmentOverviewCard = () => {
    const [departments, setDepartments] = useState([])

    const fetchDepartments = async () => {
        try {
            const { list } = await axiosInstance.post('/department', {
                page: 1,
                limit: 100,
            })
            setDepartments(list)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchDepartments()
    }, [])

    return (
        <>
            <h2 className="mb-2 font-semibold dark-blue">Department Overview</h2>
            <div className="max-h-[260px] overflow-y-auto">
                <table className="table">
                    <tr className="text-[#00836b] text-sm">
                        <th>No</th>
                        <th>Department Name</th>
                        <th>Total Employee</th>
                    </tr>
                    <tbody>
                        {departments.map((dept, index) => (
                            <tr key={dept._id}>
                                <th>{index+1}</th>
                                <td>{dept.name}</td>
                                <td>{dept.employeeCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default DepartmentOverviewCard