// Types for Database
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  position: string;
  department: string;
  role: 'admin' | 'inspector' | 'employee' | 'viewer';
  employeeId?: number;
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  checklist: string[];
  inspections: Inspection[];
  userId?: number;
}

export interface Inspection {
  id: string;
  date: string;
  time: string;
  score: number;
  inspector: string;
  inspectorRole: string;
  checkedItems: { [key: number]: boolean };
  errors: string[];
  totalItems: number;
}

export interface ActivityLog {
  id: number;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
}

export interface Department {
  name: string;
  count: number;
}
