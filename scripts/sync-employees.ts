import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://joxayhsnchiijuhxvfli.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveGF5aHNuY2hpaWp1aHh2ZmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzgzMDI4MywiZXhwIjoyMDQ5NDA2MjgzfQ.eBH88YjZ_SWb85eNhHJqHKf5nzFhQfT6w0lHMn1Mldk';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ORGANIZATION_ID = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';

// Дані співробітників з позиціями та відділами
const employeesData = [
  { email: 'dandali.v@gmail.com', name: 'Валерій Іванович', position: 'Власник | Гендиректор', department: 'Керівництво' },
  { email: 'viktoria.turuta@gmail.com', name: 'Вікторія Олександрівна', position: 'Власник | Інспектор', department: 'Керівництво' },
  { email: 'admin@wgarage.com', name: 'Адміністратор', position: 'Системний адміністратор', department: 'IT' },
  { email: '7355797@gmail.com', name: 'Пустовой Ігор', position: 'Нач. відділу [6|НR]', department: 'HR' },
  { email: 'juliamolodaya@ukr.net', name: 'Молода Юлія', position: 'Зам. дир. [РО1|РО3]', department: 'Продажі' },
  { email: 'gvv1510@gmail.com', name: 'Галант Володимир', position: 'Зам. дір. [РО2|РО4|РО5]', department: 'Продажі' },
  { email: 'schukinvova@ukr.net', name: 'Щукін Володимир', position: 'Нач. відділу [7|РОМ]', department: 'Продажі' },
  { email: 'leanorkach@gmail.com', name: 'Качковський Леонард', position: 'Нач. відділу [8|ЕСО]', department: 'Економіка' },
  { email: 'ponomarencko.katerina@gmail.com', name: 'Пономаренко Катерина', position: 'Зам. дир. [СС|ОК]', department: 'Підтримка' },
  { email: '2003alinka2023@gmail.com', name: 'Жукова Аліна', position: 'Фін. контролер [9|FK]', department: 'Фінанси' },
  { email: 'anna.baliura.00@gmail.com', name: 'Балюра Анна', position: 'Кер. підготов. [РО1]', department: 'Продажі' },
  { email: 'kryuchkovanataliyaleonidovna@gmail.com', name: 'Крючкова Наталія', position: 'Кер. підготов. [РО2]', department: 'Продажі' },
  { email: 'julia12111980@gmail.com', name: 'Богуш Юлія', position: 'Кер. підготов. [РО3]', department: 'Продажі' },
  { email: 'gnatenkokristina76@gmail.com', name: 'Гнатенко Кристина', position: 'Кер. підготов. [РО4]', department: 'Продажі' },
  { email: 'sologubovaolena@gmail.com', name: 'Согубова Олена', position: 'Кер. підготов. [РО5]', department: 'Продажі' },
  { email: 'katyabutyrska90@gmail.com', name: 'Бутирська Катерина', position: 'Консультант [CC]', department: 'Підтримка' },
  { email: 'darinamarinchuk@gmail.com', name: 'Марінчук Дарина', position: 'Консультант [CC]', department: 'Підтримка' },
  { email: 'alisatara34@gmail.com', name: 'Боднарук Аліса', position: 'Консультант [CC]', department: 'Підтримка' },
  { email: 'milochka011105@gmail.com', name: 'Хрустальова Людмила', position: 'Консультант [CC]', department: 'Підтримка' },
  { email: 'shevchuk.n.i.2016@gmail.com', name: 'Шевчук Наталія', position: 'Оператор [ОК]', department: 'Підтримка' },
  { email: 'bohdana.martynenko@gmail.com', name: 'Мартиненко Богдана', position: 'Оператор [ОК]', department: 'Підтримка' },
  { email: 'violetta16052000@gmail.com', name: 'Мілько Віолетта', position: 'Оператор [ОК]', department: 'Підтримка' },
  { email: 'raya.chorna@gmail.com', name: 'Чорна Раїса', position: 'Менеджер [РО1]', department: 'Продажі' },
  { email: 'a.zubkova2108@gmail.com', name: 'Зубкова Анастасія', position: 'Менеджер [РО1]', department: 'Продажі' },
  { email: 'podubinska1980@gmail.com', name: 'Подубінська Галина', position: 'Менеджер [РО2]', department: 'Продажі' },
  { email: 'serebriakovaelen@gmail.com', name: 'Серебрякова Олена', position: 'Менеджер [РО2]', department: 'Продажі' },
  { email: 'ek.samylicheva@gmail.com', name: 'Самиличева Катерина', position: 'Менеджер [РО3]', department: 'Продажі' },
  { email: 'marinasmiyan02@gmail.com', name: 'Сміян Марина', position: 'Менеджер [РО3]', department: 'Продажі' },
  { email: 'luzinaosnach18@gmail.com', name: 'Луніна Олеся', position: 'Менеджер [РО4]', department: 'Продажі' },
  { email: 'lubov230680@gmail.com', name: 'Ільченко Любов', position: 'Менеджер [РО4]', department: 'Продажі' },
  { email: 'marinnekipelova85@gmail.com', name: 'Кіпелова Марина', position: 'Менеджер [РО5]', department: 'Продажі' },
  { email: 'nataliiabondar00@gmail.com', name: 'Бондар Наталія', position: 'Менеджер [РО5]', department: 'Продажі' },
  { email: 'katyabondarchukk@gmail.com', name: 'Бондарчук Катерина', position: 'HR [6|НR]', department: 'HR' }
];

async function syncEmployees() {
  console.log('🔄 Починаємо синхронізацію співробітників...');
  
  let updated = 0;
  let created = 0;
  let errors = 0;

  for (const emp of employeesData) {
    try {
      // Знайти користувача по email
      const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error(`❌ Помилка отримання користувачів:`, authError);
        continue;
      }

      const user = authUser.users.find(u => u.email === emp.email);
      
      if (!user) {
        console.log(`⚠️ Користувач не знайдений: ${emp.email}`);
        errors++;
        continue;
      }

      // Оновити профіль
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: emp.email,
          full_name: emp.name,
          position: emp.position,
          department: emp.department,
          is_active: true
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error(`❌ Помилка оновлення профілю ${emp.email}:`, profileError);
        errors++;
      } else {
        updated++;
        console.log(`✅ Оновлено профіль: ${emp.name} (${emp.position})`);
      }

    } catch (err) {
      console.error(`❌ Виняток для ${emp.email}:`, err);
      errors++;
    }
  }

  console.log('\n📊 Результати синхронізації:');
  console.log(`✅ Оновлено: ${updated}`);
  console.log(`❌ Помилки: ${errors}`);
  console.log(`📋 Всього: ${employeesData.length}`);
}

syncEmployees().catch(console.error);
