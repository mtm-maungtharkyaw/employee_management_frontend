import React, { useState } from 'react';

// Main calendar component
const CalendarApp = () => {
    // State to manage the current date displayed in the calendar
    const [currentDate, setCurrentDate] = useState(new Date());
    // New state to manage the selected day
    const [selectedDay, setSelectedDay] = useState(null);

    // Function to render the calendar header (month and year)
    const renderHeader = () => {
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();

        return (
            <div className="flex justify-between items-center p-4 bg-[#4cbd9b] text-white rounded-tl-sm rounded-tr-sm">
                <button
                    onClick={prevMonth}
                    className="p-2 rounded-full cursor-pointer"
                    aria-label="Previous Month"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-white">
                    {month} {year}
                </h2>
                <button
                    onClick={nextMonth}
                    className="p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
                    aria-label="Next Month"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        );
    };

    // Function to render the days of the week header
    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 py-2">
                {days.map(day => (
                    <div key={day} className="py-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    // Function to handle day selection
    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    // Function to render the calendar cells for each day
    const renderCells = () => {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDate = new Date(monthStart.setDate(monthStart.getDate() - monthStart.getDay()));
        const endDate = new Date(monthEnd.setDate(monthEnd.getDate() + (6 - monthEnd.getDay())));

        const rows = [];
        let day = new Date(startDate);
        let formattedDate = '';

        while (day <= endDate) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                formattedDate = day.getDate();
                const cloneDay = new Date(day);
                
                week.push(
                    <div
                        key={cloneDay}
                        className={`text-center py-3 rounded-sm cursor-pointer transition-colors ${
                            day.getMonth() !== currentDate.getMonth()
                                ? 'text-gray-400' // Days from previous/next month
                                : day.toDateString() === new Date().toDateString()
                                ? 'bg-[#4cbd9b] text-white font-bold' // Current day
                                : selectedDay && day.toDateString() === selectedDay.toDateString()
                                ? 'bg-blue-400 text-white font-bold' // Selected day
                                : 'hover:bg-gray-200' // Normal day
                        }`}
                    >
                        <span className="block">{formattedDate}</span>
                    </div>
                );
                day.setDate(day.getDate() + 1);
            }
            rows.push(
                <div key={day.toDateString()} className="grid grid-cols-7">
                    {week}
                </div>
            );
        }
        return <div className="p-2">{rows}</div>;
    };

    // Function to move to the next month
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Function to move to the previous month
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    return (
        // The outer div is the red container
        <div className="w-full flex justify-center items-center">
            <div className="w-full bg-white rounded-sm">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>
        </div>
    );
};

export default CalendarApp;
