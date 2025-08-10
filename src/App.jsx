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

import Position from './pages/position/Position'

import AttendanceReport from './pages/attendance/AttendanceReport'
import AttendanceHistory from './pages/attendance/AttendanceHistory'
import AttendanceList from './pages/attendance/AttendanceList'
import AttendanceListReport from './pages/attendance/AttendanceListReport'
import AttendanceEdit from './pages/attendance/AttendanceEdit'

import EmployeeProfile from './pages/profile/EmployeeProfile'
import AdminProfile from './pages/profile/AdminProfile'

import SingleLeaveRequest from './pages/leave/SingleLeaveRequest'
import LeaveHistory from './pages/leave/LeaveHistory'
import LongTermLeaveRequest from './pages/leave/LongTermLeaveRequest'
import LeaveRequestList from './pages/leave/LeaveRequstList'
import LeaveDetail from './pages/leave/LeaveDetail'
import LeaveEdit from './pages/leave/LeaveEdit'

import Announcement from './pages/announcement/Announcement'
import AnnouncementCreate from './pages/announcement/AnnouncementCreate'

import PayrollOverview from './pages/payroll/PayrollOverview'
import PaymentDetail from './pages/payroll/PaymentDetail'
import EmployeePaymentView from './pages/payroll/EmployeePaymentView'
import OtpVerification from './pages/otp/OtpVerificiation'
import PaymentHistories from './pages/payroll/PaymentHistories'
import PaymentHistoryDetail from './pages/payroll/PyamentHistoryDetail'

// layout
import AuthLayout from './components/AuthLayout'

// guard
import AuthGuard from './utils/AuthGuard'
import GuestGuard from './utils/GuestGuard'
import VerifiedPaymentAccessGuard from './utils/VerifiedPaymentAccessGuard'
import UnVerifiedPaymentAccessGuard from './utils/unVerifiedPaymentAccessGuard'

import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { OtpProvider } from './contexts/OtpContext'

// css
import './App.css'

const App = () => {
	return (
		<AuthProvider>
			<ThemeProvider>
				<OtpProvider>
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
								<Route path="/employees/:id" element={<EmployeeDetail />} />

								<Route path="/departments" element={<Department />} />

								<Route path="/positions" element={<Position />} />

								<Route path="/attendanceReport" element={<AttendanceReport />} />
								<Route path="/attendanceHistory" element={<AttendanceHistory />} />
								<Route path="/attendanceList" element={<AttendanceList />} />
								<Route path="/attendanceListReport" element={<AttendanceListReport />} />
								<Route path="/attendanceEdit/:attendanceId" element={<AttendanceEdit />} />

								<Route path='/employeeProfile' element={<EmployeeProfile />} />
								<Route path='/adminProfile' element={<AdminProfile />} />

								<Route path='/changePassword' element={<ChangePassword />} />

								<Route path='/singleleaveRequest' element={<SingleLeaveRequest />} />
								<Route path='/leaveHistory' element={<LeaveHistory />} />
								<Route path='/LongleaveRequest' element={<LongTermLeaveRequest />} />
								<Route path="/leaveRequestList" element={<LeaveRequestList />} />
								<Route path="/leaveDetail/:id" element={<LeaveDetail />} />
								<Route path="/leaveEdit/:id" element={<LeaveEdit />} />

								<Route path="/announcement" element={<Announcement />} />
								<Route path="/announcement/create" element={<AnnouncementCreate />} />

								<Route element={<UnVerifiedPaymentAccessGuard />}>
									<Route path='/otpVerification' element={<OtpVerification />} />
								</Route>

								<Route path="/payroll" element={<PayrollOverview />} />
								<Route path="/payroll/detail/:employeeId" element={<PaymentDetail />} />
								<Route path="/payroll/histories" element={<PaymentHistories />} />
								<Route path="/payroll/histories/:paymentId" element={<PaymentHistoryDetail />} />

								<Route element={<VerifiedPaymentAccessGuard />}>
									<Route path="/employeePaymentShow" element={<EmployeePaymentView />} />
								</Route>
							</Route>
						</Route>
					</Routes>
				</OtpProvider>
			</ThemeProvider>
		</AuthProvider>
	)
}

export default App
