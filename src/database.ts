// Заглушка для старого database.ts - всі функції тепер в Supabase
// НЕ використовувати! Тільки для сумісності зі старим кодом
let cachedEmployees: any[] = [];

export const db = {
  getAllEmployees: () => cachedEmployees,
  getAllUsers: () => [],
  addEmployee: (emp: any) => {
    // Нічого не робимо - дані в Supabase
  },
  updateEmployee: (emp: any) => {
    // Оновлюємо тільки локальний кеш, щоб не скидати список
    const index = cachedEmployees.findIndex(e => e.id === emp.id);
    if (index !== -1) {
      cachedEmployees[index] = emp;
    }
  },
  deleteEmployee: (id: any) => {
    // Видаляємо з локального кешу
    cachedEmployees = cachedEmployees.filter(e => e.id !== id);
  },
  getStatistics: () => ({ total: 0, inspectors: 0, employees: 0 }),
  // Додаємо метод для оновлення кешу з Supabase
  _setEmployees: (employees: any[]) => {
    cachedEmployees = employees;
  }
};
