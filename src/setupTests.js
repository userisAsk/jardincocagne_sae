import '@testing-library/jest-dom';

// // Mock des fonctions de date-fns
// jest.mock('date-fns', () => ({
//   ...jest.requireActual('date-fns'),
//   format: jest.fn((date, formatStr, options) => '2025-01-20'),
//   isWithinInterval: jest.fn(() => true),
//   startOfWeek: jest.fn(() => new Date('2025-01-20')),
//   endOfWeek: jest.fn(() => new Date('2025-01-26')),
//   getWeek: jest.fn(() => 3),
//   getYear: jest.fn(() => 2025)
// }));

// // Mock des icônes Lucide
// jest.mock('lucide-react', () => ({
//   Calendar: () => null,
//   ChevronDown: () => null,
//   ChevronLeft: () => null,
//   ChevronRight: () => null
// }));