import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `http://localhost:3000/api`,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    },
    withCredentials: true
})

let logoutHandler = null;

// Function to set the logout handler form AuthProvider
axiosInstance.setLogoutHandler = (handler) => {
    logoutHandler = handler
}

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        if (response.data && response.data.success) {
            // return only the payload
            return response.data.data
        }

        // If the response format doesn't match expected, reject
        return Promise.reject(new Error("Invalid response format"))
    },
    async (error) => {
        const originalRequest = error.config
        console.log(error)
        console.log(error.response)
        console.log(error.response.status)
        if (error.response?.status === 403 && error.response?.data?.error?.code === "TOKEN_EXPIRED") {
            if (logoutHandler) {
                logoutHandler()
                console.log("successfully deleted both auth global state and localstorage")
            } else {
                localStorage.removeItem('authToken');
                delete axiosInstance.defaults.headers.common['Authorization']
                console.warn("No logout handler set in axiosInstance, manually clearing token.")
            }
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
)

export default axiosInstance

