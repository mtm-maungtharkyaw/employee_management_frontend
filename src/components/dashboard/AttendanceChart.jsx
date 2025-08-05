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

/**
 * Renders a grouped bar chart for monthly attendance and absence data.
 * It uses a mock data set to demonstrate the structure.
 */
const AttendanceChartWithRecharts = () => {
    // State to hold the attendance and absence data
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        // --- MOCK DATA ---
        // This is a placeholder for your API call.
        // Replace this with a fetch call to your actual backend.
        const mockData = [
            { date: '1st', attended_employees: 18, absent_employees: 2 },
            { date: '2nd', attended_employees: 20, absent_employees: 0 },
            { date: '3rd', attended_employees: 19, absent_employees: 1 },
            { date: '4th', attended_employees: 15, absent_employees: 5 },
            { date: '5th', attended_employees: 18, absent_employees: 2 },
            { date: '6th', attended_employees: 20, absent_employees: 0 },
            { date: '7th', attended_employees: 19, absent_employees: 1 },
            { date: '8th', attended_employees: 20, absent_employees: 0 },
            { date: '9th', attended_employees: 20, absent_employees: 0 },
            { date: '10th', attended_employees: 18, absent_employees: 2 },
            { date: '11th', attended_employees: 17, absent_employees: 3 },
            { date: '12th', attended_employees: 20, absent_employees: 0 },
            { date: '13th', attended_employees: 19, absent_employees: 1 },
            { date: '14th', attended_employees: 20, absent_employees: 0 },
            { date: '15th', attended_employees: 16, absent_employees: 4 },
            { date: '16th', attended_employees: 18, absent_employees: 2 },
            { date: '17th', attended_employees: 20, absent_employees: 0 },
            { date: '18th', attended_employees: 19, absent_employees: 1 },
            { date: '19th', attended_employees: 15, absent_employees: 5 },
            { date: '20th', attended_employees: 18, absent_employees: 2 },
            { date: '21st', attended_employees: 20, absent_employees: 0 },
            { date: '22nd', attended_employees: 19, absent_employees: 1 },
            { date: '23rd', attended_employees: 20, absent_employees: 0 },
            { date: '24th', attended_employees: 20, absent_employees: 0 },
            { date: '25th', attended_employees: 18, absent_employees: 2 },
            { date: '26th', attended_employees: 17, absent_employees: 3 },
            { date: '27th', attended_employees: 20, absent_employees: 0 },
            { date: '28th', attended_employees: 19, absent_employees: 1 },
            { date: '29th', attended_employees: 20, absent_employees: 0 },
            { date: '30th', attended_employees: 16, absent_employees: 4 },
        ];

        setTimeout(() => {
            setAttendanceData(mockData);
        }, 1000)
    }, [])

    return (
        <div className="bg-white mx-auto">
            <div className='flex'>
                <h2>Monthly Attendance Status</h2>
                <div></div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
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
                        domain={[0, 20]} // Set a fixed domain for consistent scaling
                    />
                    <Tooltip />
                    <Legend />
                    {/* Grouped bars are created by using multiple <Bar> components */}
                    <Bar dataKey="attended_employees" name="Attended" fill="#4cbd9b" />
                    <Bar dataKey="absent_employees" name="Absent" fill="#eb5252" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AttendanceChartWithRecharts;
