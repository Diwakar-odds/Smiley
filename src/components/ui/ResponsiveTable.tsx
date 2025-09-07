import React from 'react';
import { motion } from 'framer-motion';

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  mobileLabel?: string; // Label to show on mobile stacked view
}

interface ResponsiveTableProps {
  data: any[];
  columns: Column[];
  onRowClick?: (row: any) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  stickyHeader?: boolean;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  columns,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available',
  className = '',
  stickyHeader = true
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-700"></div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-16 bg-gray-100 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700"></div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden ${className}`}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className={`bg-gray-50 dark:bg-gray-700 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked View */}
      <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((row, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 space-y-3 ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''} transition-colors`}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((column) => (
              <div key={column.key} className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-0 flex-1">
                  {column.mobileLabel || column.header}:
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100 text-right ml-2">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Sticky Action Bar for mobile
interface StickyActionBarProps {
  children: React.ReactNode;
  isVisible?: boolean;
  className?: string;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  children,
  isVisible = true,
  className = ''
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-50 md:hidden ${className}`}
    >
      <div className="flex space-x-3 justify-center">
        {children}
      </div>
    </motion.div>
  );
};
