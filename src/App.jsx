import React from 'react';
import { DndContext } from '@dnd-kit/core';
import CalculatorBuilder from './components/CalculatorBuilder';
import ComponentPalette from './components/ComponentPalette';
import useCalculatorStore from './store/calculatorStore';

function App() {
  const { isDarkMode } = useCalculatorStore();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && over.id === 'calculator-grid' && active.id.toString().startsWith('palette-')) {
      const calculatorBuilder = document.querySelector('#calculator-builder');
      if (calculatorBuilder) {
        const event = new CustomEvent('handleDragEnd', { 
          detail: { active, over } 
        });
        calculatorBuilder.dispatchEvent(event);
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
      <div className="container mx-auto p-4">
        <DndContext onDragEnd={handleDragEnd}>
          <CalculatorBuilder />
          <div className="mt-8">
            <ComponentPalette />
          </div>
        </DndContext>
      </div>
    </div>
  );
}

export default App;