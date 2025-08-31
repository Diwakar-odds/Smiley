import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { FiCalendar, FiBarChart2 } from 'react-icons/fi';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SalesData {
    labels: string[];
    values: number[];
}

interface AnalyticsChartsProps {
    topItems: {
        _id: string;
        name: string;
        count: number;
    }[];
    timeRange?: 'daily' | 'weekly' | 'monthly';
    onTimeRangeChange?: (range: 'daily' | 'weekly' | 'monthly') => void;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
    topItems,
    timeRange = 'weekly',
    onTimeRangeChange
}) => {
    const [salesData, setSalesData] = useState<SalesData>({
        labels: [],
        values: [],
    });

    // Sample data for demonstration - replace with real API data
    useEffect(() => {
        const generateSampleSalesData = () => {
            let labels: string[] = [];
            let values: number[] = [];

            if (timeRange === 'daily') {
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                values = [4200, 3800, 5100, 4900, 6200, 7500, 6800];
            } else if (timeRange === 'weekly') {
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                values = [28000, 32000, 34000, 38500];
            } else {
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                values = [120000, 145000, 135000, 160000, 148000, 172000];
            }

            setSalesData({
                labels,
                values
            });
        };

        generateSampleSalesData();
    }, [timeRange]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pie Chart - Menu Items Sold */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white shadow-lg rounded-xl p-6"
            >
                <h2 className="text-xl font-bold text-gray-800 mb-4">Menu Items Sold</h2>

                {topItems.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500">No sales data available</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-xs">
                            <Pie
                                data={{
                                    labels: topItems.map(item => item.name),
                                    datasets: [
                                        {
                                            data: topItems.map(item => item.count),
                                            backgroundColor: [
                                                'rgba(255, 99, 132, 0.7)',
                                                'rgba(54, 162, 235, 0.7)',
                                                'rgba(255, 206, 86, 0.7)',
                                                'rgba(75, 192, 192, 0.7)',
                                                'rgba(153, 102, 255, 0.7)',
                                                'rgba(255, 159, 64, 0.7)',
                                            ],
                                            borderColor: [
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                boxWidth: 12,
                                                padding: 15,
                                            },
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function (context) {
                                                    return `${context.label}: ${context.parsed} sold`;
                                                }
                                            }
                                        }
                                    },
                                }}
                            />
                        </div>

                        <div className="w-full mt-4">
                            <h3 className="text-md font-semibold text-gray-700 mb-2">Top Selling Items</h3>
                            <ul className="space-y-1">
                                {topItems.map((item, index) => (
                                    <li key={item._id} className="flex justify-between items-center text-sm">
                                        <span>{index + 1}. {item.name}</span>
                                        <span className="font-semibold">{item.count} sold</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Bar Chart - Sales Performance */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white shadow-lg rounded-xl p-6"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <FiBarChart2 className="mr-2" /> Sales Performance
                    </h2>

                    <div className="flex items-center space-x-2">
                        <label htmlFor="time-range" className="sr-only">Select Time Range</label>
                        <FiCalendar className="text-gray-500" aria-hidden="true" />
                        <select
                            id="time-range"
                            value={timeRange}
                            onChange={(e) => onTimeRangeChange && onTimeRangeChange(e.target.value as any)}
                            className="text-sm border rounded px-2 py-1"
                            aria-label="Select Time Range"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                </div>

                <div className="h-64">
                    <Bar
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            return `₹${context.parsed.y.toLocaleString()}`;
                                        }
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function (value) {
                                            return '₹' + value.toLocaleString();
                                        }
                                    }
                                }
                            }
                        }}
                        data={{
                            labels: salesData.labels,
                            datasets: [
                                {
                                    label: 'Revenue',
                                    data: salesData.values,
                                    backgroundColor: 'rgba(79, 70, 229, 0.6)',
                                    borderColor: 'rgba(79, 70, 229, 1)',
                                    borderWidth: 1
                                }
                            ]
                        }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default AnalyticsCharts;
