import { Routes, Route } from 'react-router-dom'

// pages
import AdminLogin from './pages/AdminLogin'
import EmployeeLogin from './pages/EmployeeLogin'

import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'

import ChangePassword from './pages/ChangePassword'

import Employee from './pages/employee/Employee'
import EmployeeCreate from './pages/employee/EmployeeCreate'
import EmployeeDetail from './pages/employee/EmployeeDetail'
import EmployeeEdit from './pages/employee/EmployeeEdit'

import Department from './pages/department/Department'

import AttendanceReport from './pages/attendance/AttendanceReport'
import AttendanceHistory from './pages/attendance/AttendanceHistory'
import AttendanceList from './pages/attendance/AttendanceList'

import EmployeeProfile from './pages/profile/EmployeeProfile'
import AdminProfile from './pages/profile/AdminProfile'

import SingleLeaveRequest from './pages/leave/SingleLeaveRequest'
import LeaveHistory from './pages/leave/LeaveHistory'
import LongTermLeaveRequest from './pages/leave/LongTermLeaveRequest'
import LeaveRequestList from './pages/leave/LeaveRequstList'
import LeaveDetail from './pages/leave/LeaveDetail'

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
							<Route path="/employees/edit/:id" element={<EmployeeEdit />} />
							<Route path="/employees/:id" element={<EmployeeDetail/>} />

							<Route path="/departments" element={<Department />} />

							<Route path="/attendanceReport" element={<AttendanceReport />} />
							<Route path="/attendanceHistory" element={<AttendanceHistory />} />
							<Route path="/attendanceList" element={<AttendanceList />} />

							<Route path='/employeeProfile' element={<EmployeeProfile />} />
							<Route path='/adminProfile' element={<AdminProfile />} />

							<Route path='/changePassword' element={<ChangePassword />} />

							<Route path='/singleleaveRequest' element={<SingleLeaveRequest />} />
							<Route path='/leaveHistory' element={<LeaveHistory />} />
							<Route path='/LongleaveRequest' element={<LongTermLeaveRequest />} />
							<Route path="/leaveRequestList" element={<LeaveRequestList />}/>
							<Route path="/leaveDetail/:id" element={<LeaveDetail />} />
						</Route>
					</Route>
				</Routes>
			</ThemeProvider>
		</AuthProvider>
	)
}

export default App
