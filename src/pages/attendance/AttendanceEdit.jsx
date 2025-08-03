import { useState, useEffect } from "react"

// Auth Context
import { useAuth } from "../../contexts/AuthContext"

// constants
import { AUTH_ROLES } from "../../constants/role"

// axios instance
import axiosInstance from './../../api/axiosInstance'

// components
import Breadcrumbs from "../../components/Breadcrumbs"
import Loading from "../../components/common/Loading"

// toastify
import { ToastContainer, toast } from 'react-toastify'

const AttendanceEdit = () => {
    const { authUser } = useAuth()

    const [isLoading, setIsLoading] = useState(false)
    const [breadcrumbItems, setBreadcrumbItems] = useState([])

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }


    useEffect(() => {
        if (authUser.role === AUTH_ROLES.ADMIN) {
            setBreadcrumbItems([{
                label: "Attendance",
                to: "/attendanceList"
            }, {
                label: "Edit"
            }])
        } else {
            setBreadcrumbItems([{
                label: "Attendance Edit"
            }])
        }
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

            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} />
        </>
    )
}

export default AttendanceEdit