import { useState, useEffect } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

// axiosInstance
import axiosInstance from '../../api/axiosInstance'

// moment
import moment from 'moment'

const generatePastYears = (yearsToGoBack = 10) => {
    const years = []
    const currentYear = moment().year()

    for (let i = 0; i < yearsToGoBack; i++) {
        years.push(currentYear - i)
    }
    return years
}

/**
 * Renders a bar chart for an employee's monthly working hours.
 * This component is intended for the employee dashboard to show their personal hours.
 */
const EmployeeWorkingHoursChart = () => {
    // State to hold the monthly working hours data
    const [workingHoursData, setWorkingHoursData] = useState([])
    const [selectedYear, setSelectedYear] = useState('')
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const years = generatePastYears()

    const fetchWorkingHours = async (year) => {
        setIsLoading(true)
        try {
            const { monthlySummary } = await axiosInstance.get(`/employee/get-monthly-working-hours/${year}`)
            setWorkingHoursData(monthlySummary)
        } catch (error) {
            setError(true)
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const init = () => {
        setError(false)
        const currentYear = moment().year()
        fetchWorkingHours(currentYear)
        setSelectedYear(currentYear)
    }

    const onChangeYear = (value) => {
        if (isLoading) return
        setSelectedYear(value)
        fetchWorkingHours(value)
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <div className="bg-white mx-auto">
            {error && (
                <h2 className="text-red-500 text-center py-4">
                    Something went wrong. Please try again.
                </h2>
            )}
            {!error && (
                <>
                    <div className='flex justify-between'>
                        <h2>Your Monthly Working Hours</h2>
                        <div className='flex space-x-2 items-center'>
                            <div>
                                <label htmlFor="year" className='label'>
                                    <span className='label-text text-black'>Year</span>
                                </label>
                            </div>
                            <div>
                                <select
                                    name="year"
                                    id="year"
                                    value={selectedYear}
                                    onChange={(e) => onChangeYear(e.target.value)}
                                    className='select bg-white border border-b-[#9c9c9c] rounded-none focus:outline-none focus:border-inherit py-1'
                                >
                                    <option value="" disabled>Year</option>
                                    {years.map(year => <option key={year} value={year} >{year}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={265}>
                        <BarChart
                            data={workingHoursData}
                            margin={{ top: 20, right: 20, left: 8, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis
                                label={{
                                    value: 'Total Hours',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: {
                                        textAnchor: 'middle',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        letterSpacing: 1
                                    }
                                }}
                                domain={[0, 'auto']} // Let Recharts auto-scale based on data, or set a max like [0, 200]
                            />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total_hours" name="Working Hours" fill="#4cbd9b" /> {/* Green color */}
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}
        </div>
    );
};

export default EmployeeWorkingHoursChart;
