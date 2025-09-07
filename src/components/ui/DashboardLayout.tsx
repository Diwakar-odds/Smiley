import React, { useState, useCallback } from 'react';
import { motion, Reorder } from 'framer-motion';
import { FiGrip, FiSettings, FiEye, FiEyeOff } from 'react-icons/fi';
import { useToast } from '../../contexts/ToastContext';

export interface DashboardWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: any;
  size: 'small' | 'medium' | 'large' | 'full';
  visible: boolean;
  order: number;
}

interface DashboardLayoutProps {
  widgets: DashboardWidget[];
  onLayoutChange: (widgets: DashboardWidget[]) => void;
  isCustomizing?: boolean;
  onToggleCustomize?: () => void;
}

const getSizeClasses = (size: DashboardWidget['size']) => {
  switch (size) {
    case 'small':
      return 'col-span-1 lg:col-span-1';
    case 'medium':
      return 'col-span-1 lg:col-span-2';
    case 'large':
      return 'col-span-1 lg:col-span-3';
    case 'full':
      return 'col-span-1 lg:col-span-4';
    default:
      return 'col-span-1 lg:col-span-2';
  }
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  widgets,
  onLayoutChange,
  isCustomizing = false,
  onToggleCustomize
}) => {
  const { showToast } = useToast();
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const visibleWidgets = widgets
    .filter(widget => widget.visible)
    .sort((a, b) => a.order - b.order);

  const handleReorder = useCallback((newOrder: DashboardWidget[]) => {
    const updatedWidgets = widgets.map(widget => {
      const newWidget = newOrder.find(w => w.id === widget.id);
      return newWidget ? { ...widget, order: newOrder.indexOf(newWidget) } : widget;
    });
    onLayoutChange(updatedWidgets);
  }, [widgets, onLayoutChange]);

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    );
    onLayoutChange(updatedWidgets);
    
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      showToast('success', `${widget.title} ${widget.visible ? 'hidden' : 'shown'}`);
    }
  }, [widgets, onLayoutChange, showToast]);

  const resetLayout = useCallback(() => {
    const resetWidgets = widgets.map((widget, index) => ({
      ...widget,
      visible: true,
      order: index
    }));
    onLayoutChange(resetWidgets);
    showToast('success', 'Dashboard layout reset to default');
  }, [widgets, onLayoutChange, showToast]);

  if (isCustomizing) {
    return (
      <div className="space-y-6">
        {/* Customization Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Customize Dashboard Layout
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={resetLayout}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Reset to Default
              </button>
              <button
                onClick={onToggleCustomize}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Done Customizing
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Drag widgets to reorder them, or toggle their visibility. Changes are saved automatically.
          </p>

          {/* Widget List */}
          <Reorder.Group values={widgets} onReorder={handleReorder} className="space-y-3">
            {widgets.map((widget) => (
              <Reorder.Item
                key={widget.id}
                value={widget}
                className={`flex items-center p-4 rounded-lg border-2 border-dashed transition-all ${
                  widget.visible 
                    ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                }`}
                whileDrag={{ scale: 1.02, rotate: 1 }}
                onDragStart={() => setDraggedWidget(widget.id)}
                onDragEnd={() => setDraggedWidget(null)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <FiGrip size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium ${widget.visible ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {widget.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Size: {widget.size} • Order: {widget.order + 1}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    widget.visible
                      ? 'text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-800'
                      : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={widget.visible ? 'Hide widget' : 'Show widget'}
                >
                  {widget.visible ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customize Button */}
      {onToggleCustomize && (
        <div className="flex justify-end">
          <button
            onClick={onToggleCustomize}
            className="flex items-center space-x-2 px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <FiSettings size={16} />
            <span>Customize Layout</span>
          </button>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {visibleWidgets.map((widget, index) => {
          const Component = widget.component;
          return (
            <motion.div
              key={widget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={getSizeClasses(widget.size)}
            >
              <Component {...(widget.props || {})} />
            </motion.div>
          );
        })}
      </div>

      {visibleWidgets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No widgets are currently visible.
          </p>
          {onToggleCustomize && (
            <button
              onClick={onToggleCustomize}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Customize Layout
            </button>
          )}
        </div>
      )}
    </div>
  );
};
