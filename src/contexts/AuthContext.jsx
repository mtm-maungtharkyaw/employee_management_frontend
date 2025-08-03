import React, { useContext, useEffect, useState, createContext } from "react"
import axiosInstance from "../api/axiosInstance"

// Create context
export const AuthContext = createContext()

// Custom hook to access the context easily
export const useAuth = () => useContext(AuthContext)

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = JSON.parse(localStorage.getItem("authUser"))

    if (savedToken && savedUser) {
      setAuthUser(savedUser)
      setToken(savedToken)
    }

    axiosInstance.setLogoutHandler(logout)
    setIsCheckingAuth(false)
  }, [])

  const login = (user, token) => {
    setAuthUser(user)
    setToken(token)
    localStorage.setItem("authUser", JSON.stringify(user))
    localStorage.setItem("token", token)
  }

  const logout = () => {
    setAuthUser(null)
    setToken(null)
    localStorage.removeItem("authUser")
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider
      value={{
        isCheckingAuth,
        authUser,
        token,
        login,
        logout,
        isLoggedIn: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
