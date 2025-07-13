import { Routes, Route } from 'react-router-dom'

// pages
import AdminLogin from './pages/AdminLogin'
import EmployeeLogin from './pages/EmployeeLogin'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import Employee from './pages/employee/Employee'
import EmployeeCreate from './pages/employee/EmployeeCreate'
import Department from './pages/department/Department'

// layout
import AuthLayout from './components/AuthLayout'

// guard
import AuthGuard from './utils/AuthGuard'
import GuestGuard from './utils/GuestGuard'

import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

// css
import './App.css'

const App = () => {
	return (
		<AuthProvider>
			<ThemeProvider>
				<Routes>
					{/* Public Routes */}
					<Route element={<GuestGuard />}>
						<Route path='/employee-login' element={<EmployeeLogin />} />
						<Route path='/admin-login' element={<AdminLogin />} />
						<Route path="*" element={<NotFound />} />
					</Route>

					{/* Private Routes */}
					<Route element={<AuthGuard />}>
						<Route element={<AuthLayout />}>
							<Route path='/' element={<Dashboard />} />
							<Route path="/employees" element={<Employee />} />
							<Route path="/employees/create" element={<EmployeeCreate />} />

							<Route path="/departments" element={<Department />} />
						</Route>
					</Route>
				</Routes>
			</ThemeProvider>
		</AuthProvider>
	)
}

export default App
