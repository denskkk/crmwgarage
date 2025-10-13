// Types for Database
export interface User {
  id: string; // UUID в Supabase
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'manager' | 'inspector' | 'sales' | 'support' | 'employee' | 'viewer';
}

export interface Profile {
  id: string; // UUID
  email: string;
  full_name: string;
  position?: string;
  department?: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string; // UUID
  name: string;
  position: string;
  department: string;
  checklist: string[];
  inspections: Inspection[];
  userId?: string; // UUID
}

export interface Inspection {
  id: string; // UUID
  organization_id: string; // UUID
  employee_id: string; // UUID
  inspector_id: string; // UUID
  date: string;
  status: 'passed' | 'failed' | 'warning';
  score: number;
  notes?: string;
  items?: InspectionItem[];
  inspector?: string; // Ім'я інспектора (для відображення)
  inspectorRole?: string;
  created_at?: string;
  updated_at?: string;
  // Додаткові поля для сумісності зі старим кодом
  time?: string;
  checkedItems?: { [key: number]: boolean };
  errors?: string[];
  totalItems?: number;
  comments?: { [key: number]: string };
  photos?: { [key: number]: string };
}

export interface InspectionItem {
  id: string; // UUID
  inspection_id: string; // UUID
  item_name: string;
  is_checked: boolean;
  created_at?: string;
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

export interface Organization {
  id: string; // UUID
  name: string;
  created_at: string;
}

export interface Membership {
  id: string; // UUID
  organization_id: string; // UUID
  user_id: string; // UUID
  role: string;
  is_active: boolean;
}
