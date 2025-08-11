import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import axiosInstance from '../../api/axiosInstance';
import moment from 'moment';

const generatePastYears = (yearsToGoBack = 10) => {
    const years = []
    const currentYear = moment().year()

    for (let i = 0; i < yearsToGoBack; i++) {
        years.push(currentYear - i)
    }
    return years
}

const generateMonths = () => {
    const months = [];
    const startOfYear = moment().startOf('year');

    for (let i = 0; i < 12; i++) {
        const currentMonth = moment(startOfYear).add(i, 'months');
        months.push({
            label: currentMonth.format('MMM'),
            value: currentMonth.month() + 1
        });
    }

    return months;
}

const getOrdinalSuffix = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const AttendanceChartWithRecharts = () => {
    const [attendanceData, setAttendanceData] = useState([])
    const [selectedYear, setSelectedYear] = useState('')
    const [selectedMonth, setSelectedMonth] = useState('')
    const [error, setError] = useState(false);
    const years = generatePastYears()
    const months = generateMonths()

    const fetchAttendanceStatus = async (year, month) => {
        try {
            const { status } = await axiosInstance.get(`/attendance/${year}/${month}/status`);
            if (status) {
                const formatted_status = status.reduce((accumulator, item) => {
                    if (item && item.day && typeof item.total_attended === 'number') {
                        accumulator[item.day] = item.total_attended;
                    }
                    return accumulator;
                }, {})

                const attendances = [];
                const startOfMonth = moment({ year: year, month: month - 1 });
                const numberOfDays = startOfMonth.daysInMonth();
                for (let i = 1; i <= numberOfDays; i++) {
                    const currentDay = moment(startOfMonth).date(i);
                    const formattedDate = currentDay.format('DD/MM/YYYY');
                    if (formatted_status[formattedDate]) {
                        attendances.push({
                            date: getOrdinalSuffix(i),
                            attended_employees: formatted_status[formattedDate]
                        })
                    } else {
                        attendances.push({
                            date: getOrdinalSuffix(i),
                            attended_employees: 0
                        })
                    }
                }

                setAttendanceData(attendances)
            }
        } catch (error) {
            setError(true);
            console.error(error);
        }
    };

    const onChangeYear = (value) => {
        setSelectedYear(value)
        if (value && selectedMonth) {
            fetchAttendanceStatus(value, selectedMonth)
        }
    }

    const onChangeMonth = (value) => {
        setSelectedMonth(value)
        if (value && selectedYear) {
            fetchAttendanceStatus(selectedYear, value)
        }
    }

    const init = () => {
        const year = moment().year();
        const month = moment().month() + 1;
        fetchAttendanceStatus(year, month);
        setSelectedYear(year);
        setSelectedMonth(month);
    }

    useEffect(() => {
        init()
    }, []);

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
                        <h2 className='font-semibold dark-blue'>Monthly Attendance Status</h2>
                        <div className='flex space-x-2 items-center'>
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

                            <div>
                                <select
                                    name="month"
                                    id="month"
                                    value={selectedMonth}
                                    onChange={(e) => onChangeMonth(e.target.value)}
                                    className='select bg-white border border-b-[#9c9c9c] rounded-none focus:outline-none focus:border-inherit py-1'
                                >
                                    <option value="" disabled>Month</option>
                                    {months.map(month => <option key={month.value} value={month.value} >{month.label}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={265}>
                        <BarChart
                            data={attendanceData}
                            margin={{ top: 20, right: 20, left: 8, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis
                                label={{
                                    value: 'Number of Employees',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: {
                                        textAnchor: 'middle',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        letterSpacing: 1
                                    }
                                }}
                                domain={[0, 20]}

                            />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="attended_employees" name="Attended" fill="#4cbd9b" />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}
        </div>
    );
};

export default AttendanceChartWithRecharts;
