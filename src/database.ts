// Заглушка для старого database.ts - всі функції тепер в Supabase
export const db = {
  getAllEmployees: () => [],
  getAllUsers: () => [],
  addEmployee: (emp: any) => {},
  updateEmployee: (emp: any) => {},
  deleteEmployee: (id: any) => {},
  getStatistics: () => ({ total: 0, inspectors: 0, employees: 0 })
};
