// Скрипт для швидкого додавання користувача
// Використання: npm run add-user

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const organizationId = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface NewUser {
  email: string;
  password: string;
  fullName: string;
  role: 'owner' | 'admin' | 'manager' | 'inspector' | 'sales' | 'support' | 'employee' | 'viewer';
}

async function addUser(userData: NewUser) {
  console.log(`\n🚀 Створення користувача: ${userData.fullName} (${userData.email})`);
  
  try {
    // 1. Створити користувача через Admin API
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.fullName
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`⚠️  Користувач вже існує: ${userData.email}`);
        
        // Знайти ID існуючого користувача
        const { data: users } = await supabase.auth.admin.listUsers();
        const existingUser = users?.users.find(u => u.email === userData.email);
        
        if (existingUser) {
          console.log(`ℹ️  Використовуємо існуючий ID: ${existingUser.id}`);
          
          // Додати до організації
          const { error: memberError } = await supabase
            .from('memberships')
            .upsert({
              organization_id: organizationId,
              user_id: existingUser.id,
              role: userData.role,
              is_active: true
            });

          if (memberError) {
            console.error(`❌ Помилка додавання до організації:`, memberError);
          } else {
            console.log(`✅ Користувач доданий до організації з роллю: ${userData.role}`);
          }
        }
        return;
      }
      
      throw authError;
    }

    if (!authUser?.user) {
      throw new Error('Не вдалося створити користувача');
    }

    console.log(`✅ Користувач створений: ${authUser.user.id}`);

    // 2. Створити/оновити профіль
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.user.id,
        full_name: userData.fullName,
        avatar_url: ''
      });

    if (profileError) {
      console.error('⚠️  Помилка створення профілю:', profileError.message);
    } else {
      console.log('✅ Профіль створений');
    }

    // 3. Додати до організації
    const { error: memberError } = await supabase
      .from('memberships')
      .insert({
        organization_id: organizationId,
        user_id: authUser.user.id,
        role: userData.role,
        is_active: true
      });

    if (memberError) {
      console.error('❌ Помилка додавання до організації:', memberError);
      throw memberError;
    }

    console.log(`✅ Доданий до організації W-Garage з роллю: ${userData.role}`);
    console.log(`\n🎉 Готово! Користувач може входити:`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Password: ${userData.password}`);
    console.log(`   Role: ${userData.role}`);
    
  } catch (error: any) {
    console.error('❌ Помилка:', error.message);
    throw error;
  }
}

// Приклад: додати програміста
const programmer: NewUser = {
  email: 'programmer@wgarage.ua',
  password: 'programmer123',
  fullName: 'Програміст W-Garage',
  role: 'admin' // або 'owner', 'manager', 'employee', etc.
};

addUser(programmer)
  .then(() => {
    console.log('\n✅ Скрипт завершено успішно');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Скрипт завершено з помилкою:', error);
    process.exit(1);
  });
