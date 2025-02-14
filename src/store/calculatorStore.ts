import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalculatorState, CalculatorComponent } from '../types/calculator';

const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      components: [],
      displayValue: '0',
      previousValue: null,
      operator: null,
      isDarkMode: false,
      waitingForNewNumber: false,

      addComponent: (component) =>
        set((state) => ({
          components: [...state.components, component],
        })),

      removeComponent: (id) =>
        set((state) => ({
          components: state.components.filter((c) => c.id !== id),
        })),

      updateComponents: (components) =>
        set(() => ({
          components,
        })),

      setDisplayValue: (value) => {
        const state = get();
        if (state.waitingForNewNumber) {
          set({
            displayValue: value,
            waitingForNewNumber: false,
          });
        } else {
          set({ displayValue: value });
        }
      },

      setPreviousValue: (value) => set({ previousValue: value }),
      
      setOperator: (operator) => 
        set({ 
          operator,
          waitingForNewNumber: true,
        }),

      calculate: () => {
        const state = get();
        if (state.previousValue === null || state.operator === null) return;

        const prev = parseFloat(state.previousValue);
        const current = parseFloat(state.displayValue);
        let result = 0;

        switch (state.operator) {
          case '+':
            result = prev + current;
            break;
          case '-':
            result = prev - current;
            break;
          case '*':
            result = prev * current;
            break;
          case '/':
            if (current === 0) {
              set({ 
                displayValue: 'Error',
                previousValue: null,
                operator: null,
                waitingForNewNumber: true,
              });
              return;
            }
            result = prev / current;
            break;
        }

        set({
          displayValue: Number.isInteger(result) ? result.toString() : result.toFixed(2),
          previousValue: null,
          operator: null,
          waitingForNewNumber: true,
        });
      },

      clear: () =>
        set({
          displayValue: '0',
          previousValue: null,
          operator: null,
          waitingForNewNumber: false,
        }),

      toggleDarkMode: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        })),

      resetCalculator: () =>
        set({
          components: [],
          displayValue: '0',
          previousValue: null,
          operator: null,
          waitingForNewNumber: false,
        }),
    }),
    {
      name: 'calculator-storage',
    }
  )
);

export default useCalculatorStore;