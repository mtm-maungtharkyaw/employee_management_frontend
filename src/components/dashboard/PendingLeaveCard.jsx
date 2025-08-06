import { useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"

import axiosInstance from "../../api/axiosInstance"

import moment from "moment"

const PendingLeaveCard = () => {
    const navigate = useNavigate()
    const [pendingLeaves, setPendingLeaves] = useState([])
    const [isFetched, setIsFetched] = useState(false)

    const navigateToLeaveDetailPage = () => {
        navigate('/leaveRequestList', {
            state: { status: 'pending' }
        })
    }

    const fetchPendingLeaves = async () => {
        try {
            const { leaves } = await axiosInstance.post('/leave/getLeaveRequestList', {
                page: 1,
                limit: 10,
                status: 'pending'
            })
            setPendingLeaves(leaves)
            setIsFetched(true)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchPendingLeaves()
    }, [])
    return (
        <>
            <h2 className="mb-2">Pending Leaves</h2>
            <div className="max-h-[260px] overflow-y-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className="text-[#00836b] text-sm">
                            <th>No</th>
                            <th>Employee Id</th>
                            <th>Employee Name</th>
                            <th>Leave Date</th>
                            <th>Period</th>
                            <th>Leave Type</th>
                            <th>Leave Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingLeaves.map((leave, index) => (
                            <tr key={leave._id}>
                                <th>{index + 1}</th>
                                <td>{leave.employee?.employee_id}</td>
                                <td>{leave.employee?.name}</td>
                                <td>{moment(leave.date).format('DD/MM/YYYY')}</td>
                                <td>{leave.period}</td>
                                <td>{leave.type}</td>
                                <td>{leave.reason}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isFetched && pendingLeaves.length > 0 ? (
                <div className="flex justify-end">
                    <span
                        className="text-[#6366f1] cursor-pointer"
                        onClick={navigateToLeaveDetailPage}
                    >see more</span>
                </div>
            ) : (
                <p className="text-center mt-3">There is no pending leaves</p>
            )}
        </>
    )
}

export default PendingLeaveCard