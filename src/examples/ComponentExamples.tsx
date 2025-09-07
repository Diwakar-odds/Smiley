// Example usage of the new components in AdminDashboard

import React, { useState } from 'react';
import { DashboardLayout, DashboardWidget } from '../components/ui/DashboardLayout';
import { ResponsiveTable, StickyActionBar } from '../components/ui/ResponsiveTable';
import { InlineEdit } from '../components/ui/InlineEdit';
import { useToast } from '../contexts/ToastContext';
import AdminStats from '../components/admin/AdminStats';
import OrdersTable from '../components/admin/OrdersTable';
import AnalyticsCharts from '../components/admin/AnalyticsCharts';

// Example of how to integrate the new features:

// 1. Dashboard Layout with Drag & Drop
const ExampleDashboardTab = () => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: 'stats',
      title: 'Statistics Overview',
      component: AdminStats,
      props: { totalRevenue: 15000, totalOrders: 125, totalUsers: 500, repeatCustomers: 80 },
      size: 'full',
      visible: true,
      order: 0
    },
    {
      id: 'recent-orders',
      title: 'Recent Orders',
      component: OrdersTable,
      props: { orders: [], onSelectOrder: () => {}, onRefresh: () => {} },
      size: 'large',
      visible: true,
      order: 1
    },
    {
      id: 'analytics',
      title: 'Analytics Charts',
      component: AnalyticsCharts,
      props: { topItems: [], timeRange: 'weekly', onTimeRangeChange: () => {} },
      size: 'medium',
      visible: true,
      order: 2
    }
  ]);

  const handleLayoutChange = (newWidgets: DashboardWidget[]) => {
    setWidgets(newWidgets);
    // Save to localStorage or API
    localStorage.setItem('dashboardLayout', JSON.stringify(newWidgets));
  };

  return (
    <DashboardLayout
      widgets={widgets}
      onLayoutChange={handleLayoutChange}
      isCustomizing={isCustomizing}
      onToggleCustomize={() => setIsCustomizing(!isCustomizing)}
    />
  );
};

// 2. Responsive Table with Mobile Support
const ExampleOrdersTable = () => {
  const { showToast } = useToast();
  
  const sampleOrders = [
    { id: '1', customer: 'John Doe', status: 'pending', total: '$45.99', date: '2025-09-07' },
    { id: '2', customer: 'Jane Smith', status: 'completed', total: '$32.50', date: '2025-09-06' },
    { id: '3', customer: 'Bob Johnson', status: 'processing', total: '$78.25', date: '2025-09-06' }
  ];

  const columns = [
    { key: 'id', header: 'Order ID', mobileLabel: 'ID' },
    { key: 'customer', header: 'Customer', mobileLabel: 'Customer' },
    {
      key: 'status',
      header: 'Status',
      mobileLabel: 'Status',
      render: (value: string, row: any) => (
        <InlineEdit
          value={value}
          type="select"
          options={['pending', 'processing', 'completed', 'cancelled']}
          onSave={async (newValue) => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            showToast('success', `Order ${row.id} status updated to ${newValue}`);
          }}
        />
      )
    },
    { key: 'total', header: 'Total', mobileLabel: 'Amount' },
    { key: 'date', header: 'Date', mobileLabel: 'Date' }
  ];

  return (
    <div className="space-y-4">
      <ResponsiveTable
        data={sampleOrders}
        columns={columns}
        onRowClick={(row) => console.log('Row clicked:', row)}
        stickyHeader={true}
      />
      
      {/* Mobile Action Bar */}
      <StickyActionBar>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
          Add Order
        </button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg">
          Export
        </button>
      </StickyActionBar>
    </div>
  );
};

// 3. Inline Editing Example
const ExampleInlineEdit = () => {
  const { showToast } = useToast();
  
  return (
    <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-xl">
      <h3 className="text-lg font-semibold">Inline Editing Examples</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <span className="w-24 text-sm font-medium">Product Name:</span>
          <InlineEdit
            value="Delicious Pizza"
            onSave={async (newValue) => {
              await new Promise(resolve => setTimeout(resolve, 500));
              showToast('success', `Product name updated to: ${newValue}`);
            }}
            placeholder="Enter product name..."
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="w-24 text-sm font-medium">Status:</span>
          <InlineEdit
            value="active"
            type="select"
            options={['active', 'inactive', 'discontinued']}
            onSave={async (newValue) => {
              await new Promise(resolve => setTimeout(resolve, 500));
              showToast('success', `Status updated to: ${newValue}`);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export { ExampleDashboardTab, ExampleOrdersTable, ExampleInlineEdit };
