import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Real W-Garage users from database.ts
const realUsers = [
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

// Map old roles to new CRM roles
function mapRole(oldRole: string): string {
  switch (oldRole) {
    case 'admin': return 'owner'; // Admins become owners
    case 'inspector': return 'inspector';
    case 'employee': return 'employee';
    default: return 'employee';
  }
}

async function migrateUsers() {
  console.log('🚀 Starting W-Garage user migration to Supabase...\n');

  // Step 1: Create organization
  console.log('📦 Creating W-Garage organization...');
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({ name: 'W-Garage' })
    .select()
    .single();

  if (orgError) {
    console.error('❌ Failed to create organization:', orgError);
    process.exit(1);
  }

  console.log(`✅ Organization created: ${org.id}\n`);

  // Step 2: Create default pipeline
  console.log('📊 Creating default sales pipeline...');
  const { data: pipeline, error: pipelineError } = await supabase
    .from('pipelines')
    .insert({
      organization_id: org.id,
      name: 'Продажі W-Garage',
      created_by: null
    })
    .select()
    .single();

  if (pipelineError) {
    console.error('❌ Failed to create pipeline:', pipelineError);
  } else {
    // Create stages
    const stages = [
      { name: 'Новий лід', position: 10 },
      { name: 'Кваліфікація', position: 20 },
      { name: 'Пропозиція', position: 30 },
      { name: 'Переговори', position: 40 },
      { name: 'Закрито: виграно', position: 50 },
      { name: 'Закрито: програно', position: 60 }
    ];

    for (const stage of stages) {
      await supabase.from('deal_stages').insert({
        organization_id: org.id,
        pipeline_id: pipeline.id,
        name: stage.name,
        position: stage.position
      });
    }
    console.log('✅ Pipeline and stages created\n');
  }

  // Step 3: Create users
  console.log(`👥 Creating ${realUsers.length} users...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const user of realUsers) {
    try {
      // Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Skip email verification
        user_metadata: {
          full_name: user.name,
          position: user.position,
          department: user.department
        }
      });

      if (authError) {
        console.error(`❌ ${user.name} (${user.email}): ${authError.message}`);
        errorCount++;
        continue;
      }

      // Update profile with full name
      await supabase
        .from('profiles')
        .update({ full_name: user.name })
        .eq('id', authUser.user!.id);

      // Add to organization with role
      const crmRole = mapRole(user.role);
      await supabase
        .from('memberships')
        .insert({
          organization_id: org.id,
          user_id: authUser.user!.id,
          role: crmRole,
          is_active: true
        });

      console.log(`✅ ${user.name} (${user.email}) - роль: ${crmRole}`);
      successCount++;

    } catch (err: any) {
      console.error(`❌ ${user.name}: ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Успішно створено: ${successCount} користувачів`);
  console.log(`❌ Помилок: ${errorCount}`);
  console.log(`🏢 Organization ID: ${org.id}`);
  console.log('='.repeat(60));
  console.log('\n📝 Наступні кроки:');
  console.log('1. Додайте Organization ID у ваш фронтенд (.env.local):');
  console.log(`   VITE_ORGANIZATION_ID=${org.id}`);
  console.log('2. Користувачі можуть входити через Supabase Auth зі своїми email/паролями');
  console.log('3. Перевірте Supabase Dashboard → Authentication → Users\n');
}

migrateUsers().catch(console.error);
