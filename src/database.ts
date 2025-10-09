// Database Manager for LocalStorage with optimization
import { User, Employee, Inspection, ActivityLog } from './types';
import { generateUsers, generateEmployees } from './dataGenerator';

const STORAGE_KEYS = {
  USERS: 'wgarage_users',
  EMPLOYEES: 'wgarage_employees',
  ACTIVITY_LOG: 'wgarage_activity_log',
  INITIALIZED: 'wgarage_initialized'
};

class DatabaseManager {
  private usersCache: Map<number, User> = new Map();
  private employeesCache: Map<number, Employee> = new Map();
  private emailIndex: Map<string, User> = new Map();
  
  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    
    if (!isInitialized) {
      console.log('Ініціалізація бази даних з 1000 співробітників...');
      const users = generateUsers(1000);
      const employees = generateEmployees(users);
      
      this.saveToStorage(STORAGE_KEYS.USERS, users);
      this.saveToStorage(STORAGE_KEYS.EMPLOYEES, employees);
      this.saveToStorage(STORAGE_KEYS.ACTIVITY_LOG, []);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      
      console.log(`✅ База даних створена: ${users.length} користувачів, ${employees.length} співробітників`);
    }
    
    this.loadCaches();
  }

  private loadCaches() {
    const users = this.getFromStorage<User[]>(STORAGE_KEYS.USERS) || [];
    const employees = this.getFromStorage<Employee[]>(STORAGE_KEYS.EMPLOYEES) || [];
    
    users.forEach(user => {
      this.usersCache.set(user.id, user);
      this.emailIndex.set(user.email.toLowerCase(), user);
    });
    
    employees.forEach(emp => {
      this.employeesCache.set(emp.id, emp);
    });
  }

  private saveToStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Помилка збереження в LocalStorage:', e);
    }
  }

  private getFromStorage<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Помилка читання з LocalStorage:', e);
      return null;
    }
  }

  // User operations
  authenticateUser(email: string, password: string): User | null {
    const user = this.emailIndex.get(email.toLowerCase());
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  getAllUsers(): User[] {
    return Array.from(this.usersCache.values());
  }

  getUserById(id: number): User | undefined {
    return this.usersCache.get(id);
  }

  searchUsers(query: string): User[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllUsers().filter(user =>
      user.name.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery) ||
      user.department.toLowerCase().includes(lowerQuery)
    );
  }

  // Employee operations
  getAllEmployees(): Employee[] {
    return Array.from(this.employeesCache.values());
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.employeesCache.get(id);
  }

  getEmployeesByDepartment(department: string): Employee[] {
    return this.getAllEmployees().filter(emp => emp.department === department);
  }

  searchEmployees(query: string): Employee[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllEmployees().filter(emp =>
      emp.name.toLowerCase().includes(lowerQuery) ||
      emp.position.toLowerCase().includes(lowerQuery) ||
      emp.department.toLowerCase().includes(lowerQuery)
    );
  }

  updateEmployee(employee: Employee): void {
    this.employeesCache.set(employee.id, employee);
    this.saveEmployees();
  }

  addEmployee(employee: Employee): void {
    this.employeesCache.set(employee.id, employee);
    this.saveEmployees();
  }

  deleteEmployee(id: number): void {
    this.employeesCache.delete(id);
    this.saveEmployees();
  }

  private saveEmployees(): void {
    const employees = Array.from(this.employeesCache.values());
    this.saveToStorage(STORAGE_KEYS.EMPLOYEES, employees);
  }

  // Activity Log operations
  getActivityLog(): ActivityLog[] {
    return this.getFromStorage<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOG) || [];
  }

  addActivityLog(log: ActivityLog): void {
    const logs = this.getActivityLog();
    logs.unshift(log); // Додаємо на початок
    
    // Зберігаємо останні 500 записів для оптимізації
    if (logs.length > 500) {
      logs.splice(500);
    }
    
    this.saveToStorage(STORAGE_KEYS.ACTIVITY_LOG, logs);
  }

  // Statistics
  getDepartments(): string[] {
    const departments = new Set<string>();
    this.getAllEmployees().forEach(emp => departments.add(emp.department));
    return Array.from(departments).sort();
  }

  getStatistics() {
    const employees = this.getAllEmployees();
    const users = this.getAllUsers();
    
    return {
      totalEmployees: employees.length,
      totalUsers: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      inspectors: users.filter(u => u.role === 'inspector').length,
      employees: users.filter(u => u.role === 'employee').length,
      departments: this.getDepartments().length,
      totalInspections: employees.reduce((sum, emp) => sum + emp.inspections.length, 0)
    };
  }

  // Reset database
  resetDatabase(): void {
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOG);
    
    this.usersCache.clear();
    this.employeesCache.clear();
    this.emailIndex.clear();
    
    this.initializeDatabase();
  }

  // Export data
  exportData() {
    return {
      users: this.getAllUsers(),
      employees: this.getAllEmployees(),
      activityLog: this.getActivityLog(),
      timestamp: new Date().toISOString()
    };
  }
}

// Singleton instance
export const db = new DatabaseManager();
