import { useEffect, useState } from "react"

// react router dom
import { useNavigate, useParams } from "react-router-dom"

// components
import Breadcrumbs from "../../components/Breadcrumbs"
import Loading from "../../components/common/Loading"
import Input from "../../components/employee/Input"

// axios instance
import axiosInstance from '../../api/axiosInstance'

// toastify
import { ToastContainer, toast } from 'react-toastify'

// moment
import moment from 'moment'

// Joi
import Joi from "joi"

// helper
import { validateData } from "../../utils/helper"

// constants
import { AUTH_ROLES } from "../../constants/role"

import { useAuth } from "../../contexts/AuthContext"



const LeaveDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { authUser } = useAuth()

    const [leaveDetail, setLeaveDetail] = useState(null)

    const [isLoading, setIsLoading] = useState(false)
    const [breadcrumbItems, setBreadcrumbItems] = useState([])

    const fetchLeaveDetail = async () => {

    }

    useEffect(() => {
        console.log(id)
        fetchLeaveDetail()
    })

    useEffect(() => {
        if(authUser.role === AUTH_ROLES.ADMIN) {
            setBreadcrumbItems([
                {
                    label: "Leave",
                    to: "/leaveRequestList"
                },
                {
                    label: "Leave Detail"
                }
            ])
        } else if(authUser.role === AUTH_ROLES.EMPLOYEE) {
            setBreadcrumbItems([{
                label: "Leave Detail"
            }])
        }
    }, [authUser.role])

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

export default LeaveDetail