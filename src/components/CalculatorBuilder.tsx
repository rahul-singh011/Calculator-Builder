import React, { useEffect, useRef } from 'react';
import {
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Moon, Sun, Trash2, RotateCcw } from 'lucide-react';
import { CalculatorComponent } from '../types/calculator';
import useCalculatorStore from '../store/calculatorStore';

function CalculatorButton({
  component,
  onClick,
  onDelete,
}: {
  component: CalculatorComponent;
  onClick: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: component.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    <div className="relative group pointer-events-auto">
      <button
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onClick={onClick} // Ensure click is detected
        className={`w-16 h-16 m-1 rounded-lg text-white transition-all transform hover:scale-105 ${getButtonColor(
          component.type
        )} shadow-md`}
      >
        {component.value}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function CalculatorBuilder() {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const {
    components,
    displayValue,
    isDarkMode,
    addComponent,
    removeComponent,
    updateComponents,
    setDisplayValue,
    setPreviousValue,
    setOperator,
    calculate,
    clear,
    toggleDarkMode,
    resetCalculator,
  } = useCalculatorStore();

  const { setNodeRef } = useDroppable({
    id: 'calculator-grid',
  });

  useEffect(() => {
    const handleDragEnd = (event: CustomEvent<{ active: any; over: any }>) => {
      const { active } = event.detail;
      const component = { ...active.data.current } as CalculatorComponent;
      component.id = `calc-${Date.now()}`;
      addComponent(component);
    };

    const element = calculatorRef.current;
    if (element) {
      element.addEventListener('handleDragEnd', handleDragEnd as EventListener);
    }

    return () => {
      if (element) {
        element.removeEventListener('handleDragEnd', handleDragEnd as EventListener);
      }
    };
  }, [addComponent]);

  const handleInternalDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const oldIndex = components.findIndex((c) => c.id === active.id);
    const newIndex = components.findIndex((c) => c.id === over.id);

    if (oldIndex !== newIndex) {
      const newComponents = arrayMove(components, oldIndex, newIndex);
      updateComponents(newComponents);
    }
  };

  const handleComponentClick = (component: CalculatorComponent) => {
    if (displayValue === 'Error' && component.type !== 'clear') {
      return;
    }

    switch (component.type) {
      case 'number':
        setDisplayValue(
          displayValue === '0' || displayValue === 'Error' ? component.value : displayValue + component.value
        );
        break;
      case 'operator':
        if (displayValue !== 'Error') {
          setPreviousValue(displayValue);
          setOperator(component.value);
        }
        break;
      case 'equals':
        if (displayValue !== 'Error') {
          calculate();
        }
        break;
      case 'clear':
        clear();
        break;
    }
  };

  return (
    <div id="calculator-builder" ref={calculatorRef}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold dark:text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Calculator Builder
        </h1>
        <div className="flex gap-2">
          <button
            onClick={resetCalculator}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Reset Calculator"
          >
            <RotateCcw className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl transition-all hover:shadow-2xl"
      >
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4 shadow-inner">
          <input
            type="text"
            value={displayValue}
            readOnly
            className="w-full text-right text-3xl p-4 rounded-lg bg-white dark:bg-gray-800 dark:text-white font-mono shadow-sm"
          />
        </div>
        <SortableContext
          items={components.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-4 gap-2">
            {components.map((component) => (
              <div key={component.id} className="pointer-events-auto">
                <CalculatorButton
                  component={component}
                  onClick={() => handleComponentClick(component)}
                  onDelete={() => removeComponent(component.id)}
                />
              </div>
            ))}
          </div>
        </SortableContext>
        {components.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Drag components here to build your calculator
          </div>
        )}
      </div>
    </div>
  );
}
