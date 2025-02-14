export type CalculatorComponent = {
  id: string;
  type: 'number' | 'operator' | 'display' | 'equals' | 'clear';
  value: string;
};

export type CalculatorState = {
  components: CalculatorComponent[];
  displayValue: string;
  previousValue: string | null;
  operator: string | null;
  isDarkMode: boolean;
  waitingForNewNumber: boolean;
  addComponent: (component: CalculatorComponent) => void;
  removeComponent: (id: string) => void;
  updateComponents: (components: CalculatorComponent[]) => void;
  calculate: () => void;
  setDisplayValue: (value: string) => void;
  setPreviousValue: (value: string | null) => void;
  setOperator: (operator: string | null) => void;
  clear: () => void;
  toggleDarkMode: () => void;
  resetCalculator: () => void;
};