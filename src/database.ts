// Database Manager for LocalStorage with optimization
import { User, Employee, Inspection, ActivityLog } from './types';

const STORAGE_KEYS = {
  USERS: 'wgarage_users',
  EMPLOYEES: 'wgarage_employees',
  ACTIVITY_LOG: 'wgarage_activity_log',
  INITIALIZED: 'wgarage_initialized'
};

const defaultChecklist = [
  "Привітання клієнта",
  "Консультація за скриптом",
  "Оформлення документів",
  "Чистота та порядок",
  "Форма одягу",
  "Охайний вигляд",
  "Ввічливість",
  "Пунктуальність",
  "Правдиві звіти",
  "Дотримання техніки безпеки"
];

// Реальні користувачі W-Garage
const realUsers: User[] = [
  // Адміністратори
  { id: 96352, name: "Валерій Іванович", email: "dandali.v@gmail.com", password: "Boss2024", position: "Власник | Гендиректор", department: "Керівництво", role: "admin" },
  { id: 110635, name: "Вікторія Олександрівна", email: "viktoria.turuta@gmail.com", password: "Boss2024", position: "Власник | Інспектор", department: "Керівництво", role: "admin" },
  { id: 1, name: "Адміністратор", email: "admin@wgarage.com", password: "admin123", position: "Системний адміністратор", department: "Керівництво", role: "admin" },
  
  // Інспектори
  { id: 205493, name: "Пустовой Ігор", email: "7355797@gmail.com", password: "Inspector2024", position: "Нач. відділу |6|HR|", department: "Керівництво", role: "inspector" },
  { id: 259995, name: "Молода Юлія", email: "juliamolodaya@ukr.net", password: "Inspector2024", position: "Зам. дир. |РО1|РО3|", department: "Керівництво", role: "inspector" },
  { id: 274156, name: "Галянт Володимир", email: "gvv1510@gmail.com", password: "Inspector2024", position: "Зам. дір. |РО2|РО4|РО5|", department: "Керівництво", role: "inspector" },
  { id: 264682, name: "Щукін Володимир", email: "schukinvova@ukr.net", password: "Inspector2024", position: "Нач. відділу |7|РОМ|", department: "Керівництво", role: "inspector" },
  { id: 289175, name: "Вірченко Ігор", email: "ig.vir555@gmail.com", password: "Inspector2024", position: "Нач. відділу |2|РОП|", department: "Керівництво", role: "inspector" },
  
  // Топливщики Т|1|
  { id: 184469, name: "Борченко Костянтин", email: "konstantinborcenko@gmail.com", password: "Emp2024_001", position: "Топливщик", department: "Топливщик Т|1|", role: "employee" },
  { id: 190889, name: "Резниченко Сергій", email: "serhii53@gmail.com", password: "Emp2024_002", position: "Топливщик", department: "Топливщик Т|1|", role: "employee" },
  { id: 205433, name: "Шелест Анатолій", email: "shelest.tolya@gmail.com", password: "Emp2024_003", position: "Топливщик", department: "Топливщик Т|1|", role: "employee" },
  { id: 227509, name: "Топал Станіслав", email: "nakich30000@gmail.com", password: "Emp2024_004", position: "Топливщик", department: "Топливщик Т|1|", role: "employee" },
  { id: 248866, name: "Герасимов Артем", email: "gerasimov.artem01@icloud.com", password: "Emp2024_005", position: "Топливщик", department: "Топливщик Т|1|", role: "employee" },
  { id: 303315, name: "Борченко Артем", email: "artem.bohenko.228@gmail.com", password: "Emp2024_006", position: "Топливщик", department: "Топливщик Т|1|", role: "employee" },
  
  // Топливщики Т|2|
  { id: 185781, name: "Чернишов Євген", email: "jenyachernyshov@gmail.com", password: "Emp2024_007", position: "Топливщик", department: "Топливщик Т|2|", role: "employee" },
  { id: 221299, name: "Радченко Владислав", email: "vladrad.s8@gmail.com", password: "Emp2024_008", position: "Топливщик", department: "Топливщик Т|2|", role: "employee" },
  
  // Топливщики Т|3|
  { id: 185745, name: "Беденков Микола", email: "bedanikolai@gmail.com", password: "Emp2024_009", position: "Топливщик", department: "Топливщик Т|3|", role: "employee" },
  { id: 261160, name: "Усач Іван", email: "vanosvvd@gmail.com", password: "Emp2024_010", position: "Топливщик", department: "Топливщик Т|3|", role: "employee" },
  { id: 261576, name: "Давидов Сергій", email: "davydov19861987@gmail.com", password: "Emp2024_011", position: "Топливщик", department: "Топливщик Т|3|", role: "employee" },
  
  // Менеджери
  { id: 194988, name: "Маклашевський Сергій", email: "schvance@gmail.com", password: "Emp2024_012", position: "Менеджер з продажу", department: "Менеджери", role: "employee" },
  { id: 216644, name: "Трофименко Данило", email: "danil14148888@gmail.com", password: "Emp2024_013", position: "Менеджер з продажу", department: "Менеджери", role: "employee" },
  { id: 226335, name: "Сусленков Віктор", email: "turzvuk@gmail.com", password: "Emp2024_014", position: "Менеджер з продажу", department: "Менеджери", role: "employee" },
  
  // Склад
  { id: 193789, name: "Гузенко Даніїл", email: "genkfd@gmail.com", password: "Emp2024_015", position: "Приймальник агрегатів", department: "Склад", role: "employee" },
  { id: 243001, name: "Яковлєв Олег", email: "yakovlevoleg.odessa@gmail.com", password: "Emp2024_016", position: "Спеціаліст складу", department: "Склад", role: "employee" },
  
  // Автомеханіки
  { id: 266838, name: "Лисий Олег", email: "olegmakarov883@gmail.com", password: "Emp2024_017", position: "Автомеханік", department: "Автомеханіки", role: "employee" },
  { id: 274215, name: "Юрчак Олег", email: "oleg.alina1986@gmail.com", password: "Emp2024_018", position: "Автомеханік", department: "Автомеханіки", role: "employee" },
  { id: 277744, name: "Коринецький Євген", email: "glivero25@gmail.com", password: "Emp2024_019", position: "Автомеханік", department: "Автомеханіки", role: "employee" },
  { id: 277902, name: "Нікоаре Аурел", email: "nioareaurel@gmail.com", password: "Emp2024_020", position: "Автомеханік", department: "Автомеханіки", role: "employee" },
  
  // Бухгалтерія
  { id: 256869, name: "Смик Стефанія", email: "stefaniasmycok16@gmail.com", password: "Emp2024_021", position: "Бухгалтер-касир", department: "Бухгалтерія", role: "employee" },
  { id: 260042, name: "Алексєєва Валентина", email: "V_Alekceeva@i.ua", password: "Emp2024_022", position: "Бухгалтер ФОП", department: "Бухгалтерія", role: "employee" },
  { id: 273351, name: "Кортунова Тетяна", email: "tatanakortunova3@gmail.com", password: "Emp2024_023", position: "Бухгалтер ТОВ", department: "Бухгалтерія", role: "employee" },
  
  // Технічні спеціалісти
  { id: 254624, name: "Литвинов Олексій", email: "la_v@i.ua", password: "Emp2024_024", position: "Ремонтник електроніки", department: "Технічні спеціалісти", role: "employee" },
  { id: 254633, name: "Токар", email: "bordim.od@gmail.com", password: "Emp2024_025", position: "Токар-універсал", department: "Технічні спеціалісти", role: "employee" }
];

// Конвертуємо користувачів у співробітників
function convertUsersToEmployees(users: User[]): Employee[] {
  return users
    .filter(user => user.role === 'employee' || user.role === 'inspector')
    .map(user => ({
      id: user.id,
      name: user.name,
      position: user.position,
      department: user.department,
      checklist: [...defaultChecklist],
      inspections: []
    }));
}

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
      console.log('Ініціалізація бази даних W-Garage...');
      const users = realUsers;
      const employees = convertUsersToEmployees(realUsers);
      
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
