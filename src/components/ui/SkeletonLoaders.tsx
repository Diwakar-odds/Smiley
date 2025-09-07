import React from 'react';

// Base skeleton component
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
);

// Table skeleton loader
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
    <div className="p-6 border-b dark:border-gray-700">
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-3">
                <Skeleton className="h-4 w-full" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Chart skeleton loader
export const ChartSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-6 w-48" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex items-center justify-center">
        <Skeleton className="h-64 w-64 rounded-full" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Stats card skeleton loader
export const StatsCardSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    ))}
  </div>
);

// Generic content skeleton
export const ContentSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <TableSkeleton />
      </div>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;
