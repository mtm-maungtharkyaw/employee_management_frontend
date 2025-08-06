import { useState, useEffect } from "react"

import axiosInstance from "../../api/axiosInstance"

const PositionCard = () => {
    const [positions, setPositions] = useState([])

    const fetchPosition = async () => {
        try {
            const { list } = await axiosInstance.post('/position', {
                page: 1,
                limit: 10
            })
            setPositions(list)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchPosition()
    }, [])

    return (
        <>
            <h2 className="mb-2 font-semibold dark-blue">Position List</h2>
            <div className="max-h-[260px] overflow-y-auto">
                <table className="table">
                    <thead>
                        <tr className="text-[#00836b] text-sm">
                            <th>No</th>
                            <th>Position Name</th>
                            <th>Basic Salary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map((position, index) => (
                            <tr key={position._id}>
                                <th>{index+1}</th>
                                <td>{position.name}</td>
                                <td>{position.basic_salary.toLocaleString()} MMK</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default PositionCard