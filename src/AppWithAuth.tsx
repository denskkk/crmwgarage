import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function AppWithAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Перевірка сесії при завантаженні
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Вхід
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('✅ Успішний вхід:', data.user?.email);
    } catch (error: any) {
      console.error('❌ Помилка входу:', error);
      setError(error.message || 'Невірний email або пароль');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Вихід
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setEmail('');
    setPassword('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Якщо користувач не авторизований - показати форму входу
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">W-Garage CRM</h1>
            <p className="text-gray-600 mt-2">Увійдіть до системи</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@wgarage.ua"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoggingIn}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoggingIn}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Вхід...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Увійти
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">
              Тестові облікові записи:
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <strong>Owner:</strong> dandali.v@gmail.com / admin123
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <strong>Inspector:</strong> 7355797@gmail.com / pustovoi123
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <strong>Admin:</strong> failarm13@gmail.com / programmer123
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Якщо користувач авторизований - показати дашборд
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Вітаємо в W-Garage CRM!</h1>
              <p className="text-gray-600 mt-2">Email: {user.email}</p>
              <p className="text-sm text-gray-500">ID: {user.id}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Вийти
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              ✅ Авторизація працює!
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Що працює:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>✅ Підключення до Supabase</li>
                <li>✅ Авторизація через email/password</li>
                <li>✅ Збереження сесії</li>
                <li>✅ 34 користувачі в базі даних</li>
              </ul>
              
              <p className="mt-4"><strong>Наступні кроки:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Імпортувати старий App.tsx функціонал</li>
                <li>Підключити таблиці companies, contacts, deals</li>
                <li>Додати створення інспекцій через Supabase</li>
                <li>Налаштувати ролі (owner/admin/inspector/employee)</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">User Metadata:</h3>
            <pre className="text-xs bg-white p-3 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
