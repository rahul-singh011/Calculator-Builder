import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCalculatorStore = create(
  persist(
    (set, get) => ({
      components: [],
      displayValue: '0',
      previousValue: null,
      operator: null,
      isDarkMode: false,
      waitingForNewNumber: false,
      expression: '',

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
            expression: state.expression + ' ' + value,
          });
        } else {
          if (value === '.' && state.displayValue.includes('.')) {
            return;
          }
          if (state.displayValue.length >= 12 && !state.waitingForNewNumber) {
            return;
          }
          const newValue = state.displayValue === '0' && value !== '.' ? value : state.displayValue + value;
          set({ 
            displayValue: newValue,
            expression: state.expression === '' ? newValue : state.expression + value,
          });
        }
      },

      setPreviousValue: (value) => set({ previousValue: value }),
      
      setOperator: (operator) => {
        const state = get();
        if (state.previousValue !== null && !state.waitingForNewNumber) {
          get().calculate();
        }
        set({ 
          operator,
          previousValue: state.displayValue,
          waitingForNewNumber: true,
          expression: state.expression + ' ' + operator + ' ',
        });
      },

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
                expression: 'Error',
              });
              return;
            }
            result = prev / current;
            break;
        }

        const resultString = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, '');
        set({
          displayValue: resultString,
          previousValue: null,
          operator: null,
          waitingForNewNumber: true,
          expression: resultString,
        });
      },

      clear: () =>
        set({
          displayValue: '0',
          previousValue: null,
          operator: null,
          waitingForNewNumber: false,
          expression: '',
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
          expression: '',
        }),
    }),
    {
      name: 'calculator-storage',
    }
  )
);
export default useCalculatorStore;