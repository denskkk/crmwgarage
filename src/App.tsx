import React, { useState, useEffect } from 'react';
import { UserCircle, Plus, CheckCircle2, Circle, Calendar, TrendingUp, X, Edit2, Trash2, Save, LogIn, LogOut, Clock, Filter, Shield, Eye, Database } from 'lucide-react';
import { db } from './database';

export default function EmployeeInspectionSystem() {
  // Завантаження даних з бази
  const [employees, setEmployees] = useState(() => db.getAllEmployees());
  const stats = db.getStatistics();
  
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

  // Користувачі системи з паролями та ролями
  const [users] = useState([
    { username: "admin", password: "admin123", role: "admin", name: "Адміністратор" },
    { username: "dandali.v@gmail.com", password: "Boss2024", role: "admin", name: "Валерій Іванович" },
    { username: "viktoria.turuta@gmail.com", password: "Boss2024", role: "admin", name: "Вікторія Олександрівна" },
    { username: "inspector1", password: "inspect123", role: "inspector", name: "Інспектор 1" },
    { username: "inspector2", password: "inspect456", role: "inspector", name: "Інспектор 2" },
    { username: "viewer", password: "view123", role: "viewer", name: "Глядач" }
  ]);

  // Відновлення сесії користувача з LocalStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showActivityLog, setShowActivityLog] = useState(false);

  const [activityLog, setActivityLog] = useState([]);

  // Збереження сесії користувача при зміні
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);
  const [activeView, setActiveView] = useState('list');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentInspection, setCurrentInspection] = useState({});
  const [showEmployeeHistory, setShowEmployeeHistory] = useState(false);
  const [showAccessManagement, setShowAccessManagement] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Редагування перевірки
  const [editingInspection, setEditingInspection] = useState(null);
  const [editingInspectionIndex, setEditingInspectionIndex] = useState(null);
  
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeePosition, setNewEmployeePosition] = useState("");
  const [newEmployeeDepartment, setNewEmployeeDepartment] = useState("");
  const [newEmployeeChecklist, setNewEmployeeChecklist] = useState("");
  
  const [editingChecklist, setEditingChecklist] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const departments = [...new Set(employees.map(e => e.department))].sort();

  const filteredEmployees = selectedDepartment === "all" 
    ? employees 
    : employees.filter(e => e.department === selectedDepartment);

  const canEdit = currentUser?.role === "admin" || currentUser?.role === "inspector";
  const canViewOnly = currentUser?.role === "viewer";

  const addToActivityLog = (action, details) => {
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: currentUser?.name || currentUser?.username,
      role: currentUser?.role,
      action: action,
      details: details
    };
    setActivityLog(prev => [logEntry, ...prev]);
  };

  const handleLogin = () => {
    setLoginError("");
    // Використовуємо базу даних замість масиву users
    const user = db.authenticateUser(loginUsername, loginPassword);
    
    if (user) {
      setCurrentUser(user);
      addToActivityLog("Вхід", `${user.name} (${user.role}) увійшов у систему`);
      setLoginUsername("");
      setLoginPassword("");
    } else {
      setLoginError("Невірний email або пароль!");
    }
  };

  const handleLogout = () => {
    addToActivityLog("Вихід", `${currentUser.name} вийшов з системи`);
    setCurrentUser(null);
    setActiveView('list');
  };

  const calculateOverallScore = (employee) => {
    if (employee.inspections.length === 0) return 100;
    const sum = employee.inspections.reduce((acc, insp) => acc + insp.score, 0);
    return Math.round(sum / employee.inspections.length);
  };

  const calculateCurrentScore = () => {
    if (!selectedEmployee) return 100;
    const total = selectedEmployee.checklist.length;
    const errors = Object.values(currentInspection).filter(Boolean).length;
    return total > 0 ? Math.round(((total - errors) / total) * 100) : 100;
  };

  const getSpeedometerColor = (score) => {
    if (score < 30) return '#ef4444';
    if (score < 60) return '#f59e0b';
    if (score < 80) return '#eab308';
    return '#22c55e';
  };

  const getSpeedometerRotation = (score) => {
    return (score / 100) * 180 - 90;
  };

  const getRoleBadgeColor = (role) => {
    if (role === "admin") return "bg-red-500";
    if (role === "inspector") return "bg-blue-500";
    return "bg-gray-500";
  };

  const getRoleLabel = (role) => {
    if (role === "admin") return "Адмін";
    if (role === "inspector") return "Інспектор";
    return "Глядач";
  };

  const toggleInspectionItem = (index) => {
    setCurrentInspection(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const startInspection = (employee) => {
    if (!canEdit) {
      alert("У вас немає прав для проведення перевірок!");
      return;
    }
    setSelectedEmployee(employee);
    setCurrentInspection({});
    setActiveView('inspection');
    addToActivityLog("Початок перевірки", `Розпочато перевірку ${employee.name} (${employee.position})`);
  };

  const viewEmployeeHistory = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeHistory(true);
  };

  const saveInspection = () => {
    const score = calculateCurrentScore();
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('uk-UA');
    
    const errors = [];
    Object.keys(currentInspection).forEach(index => {
      if (currentInspection[index]) {
        errors.push(selectedEmployee.checklist[index]);
      }
    });
    
    const updatedEmployee = {
      ...selectedEmployee,
      inspections: [
        ...selectedEmployee.inspections,
        {
          id: `${Date.now()}`,
          date: today,
          time: time,
          score: score,
          inspector: currentUser.name,
          inspectorRole: currentUser.role,
          checkedItems: { ...currentInspection },
          errors: errors,
          totalItems: selectedEmployee.checklist.length
        }
      ]
    };
    
    // Оновлюємо в базі даних
    db.updateEmployee(updatedEmployee);
    setEmployees(db.getAllEmployees());

    addToActivityLog("Завершено перевірку", `${selectedEmployee.name}: ${score}% (${errors.length} помилок, перевіряв: ${currentUser.name})`);

    setActiveView('list');
    setSelectedEmployee(null);
    setCurrentInspection({});
  };

  const addEmployee = () => {
    if (!canEdit) {
      alert("У вас немає прав для додавання співробітників!");
      return;
    }
    
    if (!newEmployeeName.trim() || !newEmployeePosition.trim() || !newEmployeeDepartment.trim()) {
      alert("Заповніть всі обов'язкові поля!");
      return;
    }

    let checklist = [...defaultChecklist];
    if (newEmployeeChecklist.trim()) {
      const customItems = newEmployeeChecklist.split('\n').filter(item => item.trim());
      if (customItems.length > 0) {
        checklist = customItems;
      }
    }

    const newEmployee = {
      id: Date.now(),
      name: newEmployeeName,
      position: newEmployeePosition,
      department: newEmployeeDepartment,
      checklist: checklist,
      inspections: []
    };

    db.addEmployee(newEmployee);
    setEmployees(db.getAllEmployees());
    addToActivityLog("Додано співробітника", `${newEmployeeName} (${newEmployeePosition}) - додав: ${currentUser.name}`);
    
    setNewEmployeeName("");
    setNewEmployeePosition("");
    setNewEmployeeDepartment("");
    setNewEmployeeChecklist("");
    setActiveView('list');
  };

  const openEditChecklist = (employee) => {
    if (!canEdit) {
      alert("У вас немає прав для редагування чек-листів!");
      return;
    }
    setSelectedEmployee(employee);
    setEditingChecklist([...employee.checklist]);
    setActiveView('edit-checklist');
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setEditingChecklist(prev => [...prev, newChecklistItem.trim()]);
      setNewChecklistItem("");
    }
  };

  const removeChecklistItem = (index) => {
    setEditingChecklist(prev => prev.filter((_, i) => i !== index));
  };

  const saveChecklist = () => {
    if (editingChecklist.length === 0) {
      alert("Чек-лист не може бути порожнім!");
      return;
    }

    const updatedEmployee = {
      ...selectedEmployee,
      checklist: [...editingChecklist]
    };
    
    db.updateEmployee(updatedEmployee);
    setEmployees(db.getAllEmployees());

    addToActivityLog("Оновлено чек-лист", `${selectedEmployee.name}: ${editingChecklist.length} пунктів - оновив: ${currentUser.name}`);

    setActiveView('list');
    setSelectedEmployee(null);
    setEditingChecklist([]);
  };

  const deleteEmployee = (employeeId, employeeName) => {
    if (currentUser?.role !== "admin") {
      alert("Тільки адміністратор може видаляти співробітників!");
      return;
    }
    
    const confirmed = confirm(`Ви впевнені, що хочете видалити ${employeeName}?`);
    if (confirmed) {
      db.deleteEmployee(employeeId);
      setEmployees(db.getAllEmployees());
      addToActivityLog("Видалено співробітника", `${employeeName} - видалив: ${currentUser.name}`);
    }
  };

  // Редагування перевірки
  const startEditInspection = (inspection, index) => {
    if (!canEdit) {
      alert("У вас немає прав для редагування перевірок!");
      return;
    }
    setEditingInspection({ ...inspection });
    setEditingInspectionIndex(index);
  };

  const toggleEditInspectionItem = (itemIndex) => {
    setEditingInspection(prev => ({
      ...prev,
      checkedItems: {
        ...prev.checkedItems,
        [itemIndex]: !prev.checkedItems[itemIndex]
      }
    }));
  };

  const calculateEditingScore = () => {
    if (!editingInspection) return 100;
    const total = editingInspection.totalItems;
    const errors = Object.values(editingInspection.checkedItems).filter(Boolean).length;
    return total > 0 ? Math.round(((total - errors) / total) * 100) : 100;
  };

  const saveEditedInspection = () => {
    const newScore = calculateEditingScore();
    const errors = [];
    
    Object.keys(editingInspection.checkedItems).forEach(index => {
      if (editingInspection.checkedItems[index]) {
        errors.push(selectedEmployee.checklist[index]);
      }
    });

    const updatedInspection = {
      ...editingInspection,
      score: newScore,
      errors: errors
    };

    const updatedInspections = [...selectedEmployee.inspections];
    const realIndex = selectedEmployee.inspections.length - 1 - editingInspectionIndex;
    updatedInspections[realIndex] = updatedInspection;

    const updatedEmployee = {
      ...selectedEmployee,
      inspections: updatedInspections
    };

    db.updateEmployee(updatedEmployee);
    setEmployees(db.getAllEmployees());
    setSelectedEmployee(updatedEmployee);
    
    addToActivityLog("Відредаговано перевірку", `${selectedEmployee.name}: оновлено до ${newScore}% - редагував: ${currentUser.name}`);
    
    setEditingInspection(null);
    setEditingInspectionIndex(null);
  };

  const deleteInspection = (index) => {
    if (!canEdit) {
      alert("У вас немає прав для видалення перевірок!");
      return;
    }

    const confirmed = confirm("Ви впевнені, що хочете видалити цю перевірку?");
    if (confirmed) {
      const realIndex = selectedEmployee.inspections.length - 1 - index;
      const updatedInspections = selectedEmployee.inspections.filter((_, i) => i !== realIndex);

      const updatedEmployee = {
        ...selectedEmployee,
        inspections: updatedInspections
      };

      db.updateEmployee(updatedEmployee);
      setEmployees(db.getAllEmployees());
      setSelectedEmployee(updatedEmployee);
      
      addToActivityLog("Видалено перевірку", `${selectedEmployee.name} - видалив: ${currentUser.name}`);
    }
  };

  const clearAllInspections = () => {
    if (currentUser?.role !== "admin") {
      alert("Тільки адміністратор може очистити всю історію!");
      return;
    }

    const confirmed = confirm(`Ви впевнені, що хочете видалити ВСІ ${selectedEmployee.inspections.length} перевірок для ${selectedEmployee.name}?`);
    if (confirmed) {
      const updatedEmployee = {
        ...selectedEmployee,
        inspections: []
      };

      db.updateEmployee(updatedEmployee);
      setEmployees(db.getAllEmployees());
      setSelectedEmployee(updatedEmployee);
      
      addToActivityLog("Очищено всю історію", `${selectedEmployee.name} - очистив: ${currentUser.name}`);
    }
  };

  const SpeedometerDisplay = ({ score, size = "large" }) => {
    const dimensions = size === "large" ? { w: 240, h: 120 } : { w: 120, h: 60 };
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: dimensions.w, height: dimensions.h }}>
          <svg className="w-full h-full" viewBox="0 0 200 100">
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={size === "large" ? "20" : "15"}
              strokeLinecap="round"
            />
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke={getSpeedometerColor(score)}
              strokeWidth={size === "large" ? "20" : "15"}
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 251.2} 251.2`}
              style={{ transition: 'all 0.5s ease' }}
            />
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="30"
              stroke="#1e293b"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${getSpeedometerRotation(score)} 100 90)`}
              style={{ transition: 'transform 0.5s ease' }}
            />
            <circle cx="100" cy="90" r="6" fill="#1e293b" />
          </svg>
        </div>
        <div className={`font-black ${size === "large" ? "text-5xl" : "text-2xl"}`} 
             style={{ color: getSpeedometerColor(score) }}>
          {score}%
        </div>
      </div>
    );
  };

  // Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">Вхід у систему</h1>
            <p className="text-slate-600">W-Garage Inspection System</p>
            <p className="text-sm text-blue-600 mt-2 font-semibold flex items-center justify-center gap-2">
              <Database className="w-4 h-4" />
              База: {stats.totalUsers} користувачів, {stats.totalEmployees} співробітників
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Введіть email"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-lg"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Пароль
              </label>
              <input
                type="password"
                placeholder="Введіть пароль"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-lg"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm font-semibold">
                {loginError}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
            >
              Увійти
            </button>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-600 mb-2 font-semibold">Акаунти для входу:</p>
            <div className="space-y-1 text-xs text-slate-500">
              <p>• admin@wgarage.com / admin123 (адмін)</p>
              <p>• dandali.v@gmail.com / Boss2024 (Валерій)</p>
              <p>• viktoria.turuta@gmail.com / Boss2024 (Вікторія)</p>
              <p className="text-blue-600 font-semibold mt-2">Всього {stats.totalUsers} користувачів в системі</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Access Management Modal (Admin Only)
  if (showAccessManagement) {
    const allUsers = db.getAllUsers();

    const filteredUsers = searchQuery
      ? allUsers.filter(u =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.department.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allUsers;

    const userStats = {
      admin: allUsers.filter(u => u.role === "admin").length,
      inspector: allUsers.filter(u => u.role === "inspector").length,
      employee: allUsers.filter(u => u.role === "employee").length,
      total: allUsers.length
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">🔐 Управління доступами</h2>
                <p className="text-slate-600">Система ролей та прав користувачів W-Garage</p>
              </div>
              <button
                onClick={() => setShowAccessManagement(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-xl">
                <div className="text-3xl font-black">{userStats.admin}</div>
                <div className="text-sm opacity-90">Адміністратори</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl">
                <div className="text-3xl font-black">{userStats.inspector}</div>
                <div className="text-sm opacity-90">Інспектори</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl">
                <div className="text-3xl font-black">{userStats.employee}</div>
                <div className="text-sm opacity-90">Співробітники</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl">
                <div className="text-3xl font-black">{userStats.total}</div>
                <div className="text-sm opacity-90">Всього</div>
              </div>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="🔍 Пошук за ім'ям, email або відділом..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 mb-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
            />

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="p-3 text-left text-sm">№</th>
                    <th className="p-3 text-left text-sm">Ім'я</th>
                    <th className="p-3 text-left text-sm">Email (логін)</th>
                    <th className="p-3 text-left text-sm">Пароль</th>
                    <th className="p-3 text-left text-sm">Посада</th>
                    <th className="p-3 text-left text-sm">Відділ</th>
                    <th className="p-3 text-left text-sm">Роль</th>
                    <th className="p-3 text-left text-sm">Права</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className="border-b hover:bg-slate-50">
                      <td className="p-3 text-sm">{index + 1}</td>
                      <td className="p-3 text-sm font-bold">{user.name}</td>
                      <td className="p-3 text-xs text-slate-600">{user.email}</td>
                      <td className="p-3">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded">{user.password}</code>
                      </td>
                      <td className="p-3 text-xs">{user.position}</td>
                      <td className="p-3 text-xs text-purple-600 font-semibold">{user.department}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getRoleBadgeColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-slate-600">
                        {user.role === "admin" && "Повний доступ"}
                        {user.role === "inspector" && "Перевірки, редагування"}
                        {user.role === "employee" && "Тільки свій профіль"}
                        {user.role === "viewer" && "Тільки перегляд"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-6 p-6 bg-slate-50 rounded-xl">
              <h3 className="text-lg font-bold text-slate-800 mb-4">📖 Легенда ролей</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getRoleBadgeColor("admin")}`}>
                    Admin
                  </span>
                  <p className="flex-1 text-slate-700">
                    <strong>Адміністратор:</strong> Повний доступ до всіх функцій. Може проводити перевірки, додавати/видаляти користувачів, змінювати ролі, редагувати чек-листи.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getRoleBadgeColor("inspector")}`}>
                    Inspector
                  </span>
                  <p className="flex-1 text-slate-700">
                    <strong>Інспектор:</strong> Може проводити перевірки всіх співробітників, бачити всю історію, редагувати чек-листи. НЕ може видаляти користувачів.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getRoleBadgeColor("employee")}`}>
                    Employee
                  </span>
                  <p className="flex-1 text-slate-700">
                    <strong>Співробітник:</strong> Бачить ТІЛЬКИ свій профіль та історію своїх перевірок. Може коментувати свої порушення. НЕ бачить інших.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getRoleBadgeColor("viewer")}`}>
                    Viewer
                  </span>
                  <p className="flex-1 text-slate-700">
                    <strong>Глядач:</strong> Може тільки переглядати всіх співробітників та історію. НЕ може проводити перевірки або редагувати.
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="text-sm text-slate-700">
                  <strong>⚠️ Важливо:</strong> Кожен співробітник входить через свій email і бачить ТІЛЬКИ свою інформацію. 
                  Адміністратор може змінювати ролі через систему управління.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Employee History Modal
  if (showEmployeeHistory && selectedEmployee) {
    // Якщо редагуємо перевірку
    if (editingInspection !== null) {
      const editingScore = calculateEditingScore();
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Редагування перевірки</h2>
                  <p className="text-slate-600">{selectedEmployee.name} - {editingInspection.date}</p>
                </div>
                <button
                  onClick={() => {
                    setEditingInspection(null);
                    setEditingInspectionIndex(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              <div className="mb-6">
                <SpeedometerDisplay score={editingScore} />
                <div className="text-center mt-4">
                  <p className="text-slate-600">
                    {Object.values(editingInspection.checkedItems).filter(Boolean).length} помилок з {editingInspection.totalItems} пунктів
                  </p>
                  <p className="text-sm text-red-500 font-semibold mt-1">
                    ⚠️ Галочка = помилка = мінус бали
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Перевірка параметрів</h3>
                <div className="space-y-2">
                  {selectedEmployee.checklist.map((item, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-all group"
                    >
                      <input
                        type="checkbox"
                        checked={editingInspection.checkedItems[index] || false}
                        onChange={() => toggleEditInspectionItem(index)}
                        className="hidden"
                      />
                      {editingInspection.checkedItems[index] ? (
                        <CheckCircle2 className="w-6 h-6 text-red-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-green-300 group-hover:text-green-400 flex-shrink-0" />
                      )}
                      <span className="text-slate-400 font-semibold text-sm min-w-[2rem]">
                        {index + 1}
                      </span>
                      <span className={`flex-1 font-medium ${
                        editingInspection.checkedItems[index] ? 'text-red-600 font-bold' : 'text-slate-700'
                      }`}>
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveEditedInspection}
                  className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Зберегти зміни ({editingScore}%)
                </button>
                <button
                  onClick={() => {
                    setEditingInspection(null);
                    setEditingInspectionIndex(null);
                  }}
                  className="px-6 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition"
                >
                  Скасувати
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Звичайний перегляд історії
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <UserCircle className="w-12 h-12 text-blue-500" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedEmployee.name}</h2>
                  <p className="text-slate-600">{selectedEmployee.position}</p>
                  <p className="text-sm text-blue-600 font-semibold">{selectedEmployee.department}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {currentUser?.role === "admin" && selectedEmployee.inspections.length > 0 && (
                  <button
                    onClick={clearAllInspections}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Очистити всі
                  </button>
                )}
                <button
                  onClick={() => setShowEmployeeHistory(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Середній бал</p>
                  <p className="text-3xl font-black" style={{ color: getSpeedometerColor(calculateOverallScore(selectedEmployee)) }}>
                    {calculateOverallScore(selectedEmployee)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Всього перевірок</p>
                  <p className="text-3xl font-black text-slate-800">
                    {selectedEmployee.inspections.length}
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-4">Історія перевірок</h3>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {selectedEmployee.inspections.length === 0 ? (
                <p className="text-center text-slate-500 py-8">Перевірок ще не було</p>
              ) : (
                selectedEmployee.inspections.slice().reverse().map((inspection, idx) => (
                  <div key={idx} className="border-2 border-slate-200 rounded-xl p-4 hover:border-blue-300 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <Calendar className="w-5 h-5 text-slate-400" />
                          <span className="font-bold text-slate-800">{inspection.date}</span>
                          <span className="text-slate-500">{inspection.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Shield className="w-4 h-4" />
                          <span>Перевіряв: {inspection.inspector}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${getRoleBadgeColor(inspection.inspectorRole)}`}>
                            {getRoleLabel(inspection.inspectorRole)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-3xl font-black mb-1" style={{ color: getSpeedometerColor(inspection.score) }}>
                            {inspection.score}%
                          </div>
                          <div className="text-xs text-slate-500">
                            {inspection.errors?.length || 0} з {inspection.totalItems}
                          </div>
                        </div>
                        {canEdit && (
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => startEditInspection(inspection, idx)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                              title="Редагувати"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteInspection(idx)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                              title="Видалити"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {inspection.errors && inspection.errors.length > 0 ? (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-sm font-bold text-red-600 mb-2">
                          ❌ Виявлені порушення ({inspection.errors.length}):
                        </p>
                        <div className="space-y-1">
                          {inspection.errors.map((error, errorIdx) => (
                            <div key={errorIdx} className="flex items-start gap-2 text-sm">
                              <span className="text-red-500 font-bold min-w-[1.5rem]">{errorIdx + 1}.</span>
                              <span className="text-slate-700">{error}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-sm font-bold text-green-600 text-center">
                          ✅ Порушень не виявлено! Відмінна робота!
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Activity Log Modal
  if (showActivityLog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-bold text-slate-800">Стрічка подій</h2>
              </div>
              <button
                onClick={() => setShowActivityLog(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {activityLog.length === 0 ? (
                <p className="text-center text-slate-500 py-8">Поки немає подій</p>
              ) : (
                activityLog.map(log => (
                  <div key={log.id} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-800">{log.action}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${getRoleBadgeColor(log.role)}`}>
                            {getRoleLabel(log.role)}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(log.timestamp).toLocaleString('uk-UA')}
                          </span>
                        </div>
                        <p className="text-slate-600">{log.details}</p>
                        <p className="text-xs text-slate-400 mt-1">Користувач: {log.user}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit Checklist View
  if (activeView === 'edit-checklist') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Редагувати чек-лист</h2>
                <p className="text-slate-600">{selectedEmployee.name} - {selectedEmployee.position}</p>
              </div>
              <button
                onClick={() => setActiveView('list')}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Додати новий пункт:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Назва пункту..."
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                  className="flex-1 p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none"
                />
                <button
                  onClick={addChecklistItem}
                  className="px-6 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-sm font-semibold text-slate-600 mb-3">
                Пунктів у чек-листі: {editingChecklist.length}
              </p>
              {editingChecklist.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition group"
                >
                  <span className="text-slate-400 font-semibold text-sm min-w-[2rem]">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-slate-700 font-medium">{item}</span>
                  <button
                    onClick={() => removeChecklistItem(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveChecklist}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Зберегти чек-лист
              </button>
              <button
                onClick={() => setActiveView('list')}
                className="px-6 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition"
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add Employee View
  if (activeView === 'add') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Додати співробітника</h2>
              <button
                onClick={() => setActiveView('list')}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ім'я та прізвище *
                </label>
                <input
                  type="text"
                  placeholder="Іван Петренко"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Посада *
                </label>
                <input
                  type="text"
                  placeholder="Механік"
                  value={newEmployeePosition}
                  onChange={(e) => setNewEmployeePosition(e.target.value)}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Відділ *
                </label>
                <input
                  type="text"
                  placeholder="Топливщик Т|1|"
                  value={newEmployeeDepartment}
                  onChange={(e) => setNewEmployeeDepartment(e.target.value)}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Індивідуальний чек-лист (необов'язково)
                </label>
                <textarea
                  placeholder="Пункт 1&#10;Пункт 2&#10;Пункт 3..."
                  value={newEmployeeChecklist}
                  onChange={(e) => setNewEmployeeChecklist(e.target.value)}
                  rows={6}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none font-mono text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={addEmployee}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition"
                >
                  ✅ Додати співробітника
                </button>
                <button
                  onClick={() => setActiveView('list')}
                  className="px-6 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition"
                >
                  Скасувати
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inspection View
  if (activeView === 'inspection') {
    const currentScore = calculateCurrentScore();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <UserCircle className="w-12 h-12 text-blue-500" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedEmployee.name}</h2>
                  <p className="text-slate-600">{selectedEmployee.position}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <p className="text-xs text-slate-500">Перевіряє: {currentUser.name}</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${getRoleBadgeColor(currentUser.role)}`}>
                      {getRoleLabel(currentUser.role)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveView('list')}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <SpeedometerDisplay score={currentScore} />
            
            <div className="text-center mt-4">
              <p className="text-slate-600">
                {Object.values(currentInspection).filter(Boolean).length} помилок з {selectedEmployee.checklist.length} пунктів
              </p>
              <p className="text-sm text-red-500 font-semibold mt-1">
                ⚠️ Галочка = помилка = мінус бали
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Перевірка параметрів</h3>
            <div className="space-y-2">
              {selectedEmployee.checklist.map((item, index) => (
                <label
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-all group"
                >
                  <input
                    type="checkbox"
                    checked={currentInspection[index] || false}
                    onChange={() => toggleInspectionItem(index)}
                    className="hidden"
                  />
                  {currentInspection[index] ? (
                    <CheckCircle2 className="w-6 h-6 text-red-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-green-300 group-hover:text-green-400 flex-shrink-0" />
                  )}
                  <span className="text-slate-400 font-semibold text-sm min-w-[2rem]">
                    {index + 1}
                  </span>
                  <span className={`flex-1 font-medium ${
                    currentInspection[index] ? 'text-red-600 font-bold' : 'text-slate-700'
                  }`}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={saveInspection}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            ✅ Зберегти перевірку ({currentScore}%)
          </button>
        </div>
      </div>
    );
  }

  // Main List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black">👥 W-Garage Inspection</h1>
                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${getRoleBadgeColor(currentUser.role)}`}>
                  {getRoleLabel(currentUser.role)}
                </span>
              </div>
              <p className="text-blue-100">
                {canEdit ? "Контроль якості" : "Тільки перегляд"} • {filteredEmployees.length} співробітників • {currentUser.name}
              </p>
            </div>
            <div className="flex gap-2">
              {canViewOnly && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">Режим перегляду</span>
                </div>
              )}
              {currentUser.role === "admin" && (
                <button
                  onClick={() => setShowAccessManagement(true)}
                  className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl font-bold hover:bg-white/30 transition flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Доступи
                </button>
              )}
              <button
                onClick={() => setShowActivityLog(true)}
                className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl font-bold hover:bg-white/30 transition flex items-center gap-2"
              >
                <Clock className="w-5 h-5" />
                Події
              </button>
              {canEdit && (
                <button
                  onClick={() => setActiveView('add')}
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Додати
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-red-600 transition flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4" />
            <span className="font-semibold">Відділ:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-lg font-semibold outline-none cursor-pointer [&>option]:text-slate-800 [&>option]:bg-white"
            >
              <option value="all">Всі відділи</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map(employee => {
            const overallScore = calculateOverallScore(employee);
            
            return (
              <div key={employee.id} className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <UserCircle className="w-10 h-10 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-800 truncate">{employee.name}</h3>
                    <p className="text-xs text-slate-600 truncate">{employee.position}</p>
                    <p className="text-xs text-blue-600 font-semibold mt-1">{employee.department}</p>
                  </div>
                  {currentUser.role === "admin" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEmployee(employee.id, employee.name);
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <SpeedometerDisplay score={overallScore} size="small" />

                <div className="mt-3 p-2 bg-slate-50 rounded-lg text-xs">
                  <div className="flex items-center gap-2 text-slate-600 mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>Перевірок: {employee.inspections.length}</span>
                  </div>
                  {employee.inspections.length > 0 && (
                    <div className="text-slate-500 truncate">
                      Остання: {employee.inspections[employee.inspections.length - 1].date}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  {canEdit && (
                    <button
                      onClick={() => startInspection(employee)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                    >
                      🔍 Перевірка
                    </button>
                  )}
                  {canEdit && (
                    <button
                      onClick={() => openEditChecklist(employee)}
                      className="p-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition"
                      title="Редагувати чек-лист"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {employee.inspections.length > 0 && (
                    <button
                      onClick={() => viewEmployeeHistory(employee)}
                      className="p-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition"
                      title="Історія перевірок"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}