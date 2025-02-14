import React, { useEffect, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Moon, Sun, Trash2, RotateCcw, Calculator } from 'lucide-react';
import useCalculatorStore from '../store/calculatorStore';

function CalculatorButton({ component, onClick, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: component.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    <div className="relative group">
      <button
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={onClick}
        className={`w-16 h-16 m-1 rounded-xl text-white transition-all transform hover:scale-105 ${getButtonColor(
          component.type
        )} shadow-lg hover:shadow-xl active:scale-95 font-semibold text-lg relative`}
      >
        {component.value}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 scale-75"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </button>
    </div>
  );
}

export default function CalculatorBuilder() {
  const calculatorRef = useRef(null);
  const {
    components,
    displayValue,
    expression,
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
    const handleDragEnd = (event) => {
      const { active } = event.detail;
      const component = { ...active.data.current };
      component.id = `calc-${Date.now()}`;
      addComponent(component);
    };

    const element = calculatorRef.current;
    if (element) {
      element.addEventListener('handleDragEnd', handleDragEnd);
    }

    return () => {
      if (element) {
        element.removeEventListener('handleDragEnd', handleDragEnd);
      }
    };
  }, [addComponent]);

  const handleInternalDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const oldIndex = components.findIndex((c) => c.id === active.id);
    const newIndex = components.findIndex((c) => c.id === over.id);

    if (oldIndex !== newIndex) {
      const newComponents = arrayMove(components, oldIndex, newIndex);
      updateComponents(newComponents);
    }
  };

  const handleComponentClick = (component) => {
    if (displayValue === 'Error' && component.type !== 'clear') {
      return;
    }

    switch (component.type) {
      case 'number':
        setDisplayValue(component.value);
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
    <div id="calculator-builder" ref={calculatorRef} className="max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Calculator className="w-8 h-8 text-indigo-500" />
          <h1 className="text-3xl font-bold dark:text-white bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Calculator Builder
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetCalculator}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Reset Calculator"
          >
            <RotateCcw className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
        className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all hover:shadow-2xl border border-gray-100 dark:border-gray-700"
      >
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl mb-4 shadow-inner">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-500 dark:text-gray-400 text-right h-6 font-mono">
              {expression !== displayValue ? expression : ''}
            </div>
            <input
              type="text"
              value={displayValue}
              readOnly
              className="w-full text-right text-3xl p-4 rounded-xl bg-white dark:bg-gray-800 dark:text-white font-mono shadow-sm border border-gray-200 dark:border-gray-600"
            />
          </div>
        </div>
        <SortableContext
          items={components.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-4 gap-2">
            {components.map((component) => (
              <CalculatorButton
                key={component.id}
                component={component}
                onClick={() => handleComponentClick(component)}
                onDelete={() => removeComponent(component.id)}
              />
            ))}
          </div>
        </SortableContext>
        {components.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Drag components here to build your calculator</p>
            <p className="text-sm mt-2 text-gray-400">Start by dragging numbers and operators from below</p>
          </div>
        )}
      </div>
    </div>
  );
}