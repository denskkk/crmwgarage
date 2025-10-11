// Генератор даних для бази
import { User, Employee } from './types';

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

const departments = [
  "Керівництво",
  "Топливщик Т|1|",
  "Топливщик Т|2|",
  "Топливщик Т|3|",
  "Менеджери",
  "Склад",
  "Автомеханіки",
  "Бухгалтерія",
  "Технічні спеціалісти",
  "HR відділ",
  "Безпека",
  "Логістика",
  "Продажі",
  "Маркетинг",
  "IT відділ"
];

const ukrainianNames = [
  "Іван", "Олександр", "Петро", "Михайло", "Андрій", "Василь", "Дмитро", "Сергій", "Володимир", "Олег",
  "Юрій", "Віктор", "Анатолій", "Євген", "Микола", "Богдан", "Максим", "Тарас", "Роман", "Ігор",
  "Руслан", "Денис", "Вадим", "Артем", "Станіслав", "Павло", "Антон", "Ярослав", "Костянтин", "Григорій"
];

const ukrainianSurnames = [
  "Іваненко", "Петренко", "Сидоренко", "Коваленко", "Бондаренко", "Мельник", "Шевченко", "Бойко", "Ткаченко", "Кравченко",
  "Коваль", "Олійник", "Швець", "Ковальчук", "Павленко", "Savchenko", "Морозов", "Волошин", "Литвин", "Гончар",
  "Лисенко", "Руденко", "Марченко", "Козак", "Величко", "Демченко", "Захарченко", "Left", "Поліщук", "Rudenko",
  "Білоус", "Борисенко", "Vasylenko", "Гриценко", "Давиденко", "Зінченко", "Ільченко", "Карпенко", "Левченко", "Назаренко",
  "Остапенко", "Панченко", "Романенко", "Степаненко", "Тимошенко", "Усенко", "Федоренко", "Харченко", "Цимбалюк", "Чернишов"
];

const positions = {
  "Керівництво": ["Генеральний директор", "Заступник директора", "Начальник відділу", "Головний інспектор"],
  "Топливщик Т|1|": ["Топливщик Т|1|", "Старший топливщик Т|1|"],
  "Топливщик Т|2|": ["Топливщик Т|2|", "Старший топливщик Т|2|"],
  "Топливщик Т|3|": ["Топливщик Т|3|", "Старший топливщик Т|3|"],
  "Менеджери": ["Менеджер з продажу", "Старший менеджер", "Менеджер-консультант"],
  "Склад": ["Комірник", "Приймальник агрегатів", "Спеціаліст складу", "Завідувач складом"],
  "Автомеханіки": ["Автомеханік", "Старший механік", "Моторист", "Електрик"],
  "Бухгалтерія": ["Бухгалтер", "Бухгалтер-касир", "Головний бухгалтер", "Бухгалтер ТОВ", "Бухгалтер ФОП"],
  "Технічні спеціалісти": ["Токар-універсал", "Зварювальник", "Ремонтник електроніки", "Слюсар"],
  "HR відділ": ["HR менеджер", "Спеціаліст з підбору персоналу", "Тренінг-менеджер"],
  "Безпека": ["Охоронець", "Начальник охорони", "Інженер з охорони праці"],
  "Логістика": ["Логіст", "Водій-експедитор", "Диспетчер", "Начальник логістики"],
  "Продажі": ["Менеджер з продажу", "Торговий представник", "Регіональний менеджер"],
  "Маркетинг": ["Маркетолог", "SMM-менеджер", "Контент-менеджер"],
  "IT відділ": ["Системний адміністратор", "Програміст", "Технічний спеціаліст"]
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateEmail(name: string, surname: string, id: number): string {
  const domains = ['gmail.com', 'ukr.net', 'i.ua', 'outlook.com'];
  const nameEng = transliterate(name.toLowerCase());
  const surnameEng = transliterate(surname.toLowerCase());
  
  const patterns = [
    `${nameEng}.${surnameEng}@${getRandomElement(domains)}`,
    `${surnameEng}.${nameEng}@${getRandomElement(domains)}`,
    `${nameEng}${surname.toLowerCase()}${id}@${getRandomElement(domains)}`,
    `${nameEng}_${surnameEng}@${getRandomElement(domains)}`
  ];
  
  return getRandomElement(patterns);
}

function transliterate(text: string): string {
  const map: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh', 'з': 'z',
    'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
    'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ь': '', 'ю': 'yu', 'я': 'ya'
  };
  
  return text.split('').map(char => map[char] || char).join('');
}

function generatePassword(role: string, id: number): string {
  if (role === 'admin') return 'Boss2024';
  if (role === 'inspector') return 'Inspector2024';
  return `Emp2024_${String(id).padStart(4, '0')}`;
}

export function generateUsers(count: number = 1000): User[] {
  const users: User[] = [
    // Основні адміністратори
    {
      id: 96352,
      email: "dandali.v@gmail.com",
      password: "Boss2024",
      name: "Валерій Іванович Данділі",
      position: "Власник | Гендиректор",
      department: "Керівництво",
      role: "admin",
      employeeId: 96352
    },
    {
      id: 110635,
      email: "viktoria.turuta@gmail.com",
      password: "Boss2024",
      name: "Вікторія Олександрівна Турута",
      position: "Власник | Інспектор",
      department: "Керівництво",
      role: "admin",
      employeeId: 110635
    },
    {
      id: 1,
      email: "admin@wgarage.com",
      password: "admin123",
      name: "Системний Адміністратор",
      position: "Системний адміністратор",
      department: "IT відділ",
      role: "admin"
    }
  ];

  // Генеруємо інспекторів (20 осіб)
  for (let i = 0; i < 20; i++) {
    const name = getRandomElement(ukrainianNames);
    const surname = getRandomElement(ukrainianSurnames);
    const fullName = `${surname} ${name}`;
    const id = 200000 + i;
    
    users.push({
      id,
      email: generateEmail(name, surname, id),
      password: generatePassword('inspector', id),
      name: fullName,
      position: "Інспектор якості",
      department: "Керівництво",
      role: "inspector",
      employeeId: id
    });
  }

  // Генеруємо співробітників
  let userId = 300000;
  for (let i = users.length; i < count; i++) {
    const name = getRandomElement(ukrainianNames);
    const surname = getRandomElement(ukrainianSurnames);
    const fullName = `${surname} ${name}`;
    const department = getRandomElement(departments);
    const positionsList = positions[department] || ["Співробітник"];
    const position = getRandomElement(positionsList);
    
    users.push({
      id: userId,
      email: generateEmail(name, surname, userId),
      password: generatePassword('employee', userId),
      name: fullName,
      position: position as string,
      department: department,
      role: "employee",
      employeeId: userId
    });
    
    userId++;
  }

  return users;
}

export function generateEmployees(users: User[]): Employee[] {
  return users
    .filter(user => user.employeeId)
    .map(user => ({
      id: user.employeeId!,
      name: user.name,
      position: user.position,
      department: user.department,
      checklist: [...defaultChecklist],
      inspections: [],
      userId: user.id
    }));
}

export { defaultChecklist, departments };
