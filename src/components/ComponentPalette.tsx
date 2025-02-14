import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { CalculatorComponent } from '../types/calculator';

type DraggableComponentProps = {
  component: CalculatorComponent;
};

function DraggableComponent({ component }: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette-${component.id}`,
    data: component,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  const getButtonColor = (type: string) => {
    switch (type) {
      case 'number':
        return 'bg-indigo-500 hover:bg-indigo-600';
      case 'operator':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'equals':
        return 'bg-green-500 hover:bg-green-600';
      case 'clear':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`w-12 h-12 m-1 rounded-lg text-white transition-all transform hover:scale-105 ${getButtonColor(
        component.type
      )} shadow-md`}
    >
      {component.value}
    </button>
  );
}

const componentTemplates: CalculatorComponent[] = [
  { id: 'display', type: 'display', value: 'Display' },
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `num-${i}`,
    type: 'number',
    value: i.toString(),
  })),
  { id: 'add', type: 'operator', value: '+' },
  { id: 'subtract', type: 'operator', value: '-' },
  { id: 'multiply', type: 'operator', value: '*' },
  { id: 'divide', type: 'operator', value: '/' },
  { id: 'equals', type: 'equals', value: '=' },
  { id: 'clear', type: 'clear', value: 'C' },
];

export default function ComponentPalette() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl transition-all hover:shadow-2xl">
      <h2 className="text-xl font-bold mb-4 dark:text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        Component Palette
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Drag components to build your calculator. Different colors represent different types of buttons.
      </p>
      <div className="flex flex-wrap gap-2">
        {componentTemplates.map((component) => (
          <DraggableComponent key={component.id} component={component} />
        ))}
      </div>
    </div>
  );
}