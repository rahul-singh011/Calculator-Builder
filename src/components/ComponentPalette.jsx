import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Calculator } from 'lucide-react';

function DraggableComponent({ component }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette-${component.id}`,
    data: component,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  const getButtonColor = (type) => {
    switch (type) {
      case 'number':
        return 'bg-gradient-to-br from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700';
      case 'operator':
        return 'bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700';
      case 'equals':
        return 'bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700';
      case 'clear':
        return 'bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700';
      default:
        return 'bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700';
    }
  };

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`w-12 h-12 m-1 rounded-xl text-white transition-all transform hover:scale-105 ${getButtonColor(
        component.type
      )} shadow-lg hover:shadow-xl active:scale-95 font-semibold`}
    >
      {component.value}
    </button>
  );
}

const componentTemplates = [
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `num-${i}`,
    type: 'number',
    value: i.toString(),
  })),
  { id: 'decimal', type: 'number', value: '.' },
  { id: 'add', type: 'operator', value: '+' },
  { id: 'subtract', type: 'operator', value: '-' },
  { id: 'multiply', type: 'operator', value: '*' },
  { id: 'divide', type: 'operator', value: '/' },
  { id: 'equals', type: 'equals', value: '=' },
  { id: 'clear', type: 'clear', value: 'C' },
];

export default function ComponentPalette() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all hover:shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold dark:text-white bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Component Palette
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Drag components to build your calculator. Different colors represent different types of buttons.
        </p>
        <div className="flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          {componentTemplates.map((component) => (
            <DraggableComponent key={component.id} component={component} />
          ))}
        </div>
      </div>
    </div>
  );
}