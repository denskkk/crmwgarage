-- =====================================================
-- Оновлення профілів співробітників з позиціями та відділами
-- =====================================================

-- Оновлення профілів через auth.users (всі 33 співробітники)
UPDATE public.profiles SET position = 'Власник | Гендиректор', department = 'Керівництво' WHERE id = (SELECT id FROM auth.users WHERE email = 'dandali.v@gmail.com');
UPDATE public.profiles SET position = 'Власник | Інспектор', department = 'Керівництво' WHERE id = (SELECT id FROM auth.users WHERE email = 'viktoria.turuta@gmail.com');
UPDATE public.profiles SET position = 'Системний адміністратор', department = 'IT' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@wgarage.com');
UPDATE public.profiles SET position = 'Нач. відділу [6|НR]', department = 'HR' WHERE id = (SELECT id FROM auth.users WHERE email = '7355797@gmail.com');
UPDATE public.profiles SET position = 'Зам. дир. [РО1|РО3]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'juliamolodaya@ukr.net');
UPDATE public.profiles SET position = 'Зам. дір. [РО2|РО4|РО5]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'gvv1510@gmail.com');
UPDATE public.profiles SET position = 'Нач. відділу [7|РОМ]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'schukinvova@ukr.net');
UPDATE public.profiles SET position = 'Нач. відділу [8|ЕСО]', department = 'Економіка' WHERE id = (SELECT id FROM auth.users WHERE email = 'leanorkach@gmail.com');
UPDATE public.profiles SET position = 'Зам. дир. [СС|ОК]', department = 'Підтримка' WHERE id = (SELECT id FROM auth.users WHERE email = 'ponomarencko.katerina@gmail.com');
UPDATE public.profiles SET position = 'Фін. контролер [9|FK]', department = 'Фінанси' WHERE id = (SELECT id FROM auth.users WHERE email = '2003alinka2023@gmail.com');
UPDATE public.profiles SET position = 'Кер. підготов. [РО1]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'anna.baliura.00@gmail.com');
UPDATE public.profiles SET position = 'Кер. підготов. [РО2]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'kryuchkovanataliyaleonidovna@gmail.com');
UPDATE public.profiles SET position = 'Кер. підготов. [РО3]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'julia12111980@gmail.com');
UPDATE public.profiles SET position = 'Кер. підготов. [РО4]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'gnatenkokristina76@gmail.com');
UPDATE public.profiles SET position = 'Кер. підготов. [РО5]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'sologubovaolena@gmail.com');
UPDATE public.profiles SET position = 'Консультант [CC]', department = 'Підтримка' WHERE id = (SELECT id FROM auth.users WHERE email = 'katyabutyrska90@gmail.com');
UPDATE public.profiles SET position = 'Консультант [CC]', department = 'Підтримка' WHERE id = (SELECT id FROM auth.users WHERE email = 'darinamarinchuk@gmail.com');
UPDATE public.profiles SET position = 'Консультант [CC]', department = 'Підтримка' WHERE id = (SELECT id FROM auth.users WHERE email = 'alisatara34@gmail.com');
UPDATE public.profiles SET position = 'Консультант [CC]', department = 'Підтримка' WHERE id = (SELECT id FROM auth.users WHERE email = 'milochka011105@gmail.com');
UPDATE public.profiles SET position = 'Оператор [ОК]', department = 'Підтримка' WHERE id = (SELECT id FROM auth.users WHERE email = 'shevchuk.n.i.2016@gmail.com');
UPDATE public.profiles SET position = 'Оператор [ОК]', department = 'Підтримка' WHERE id = (SELECT id FROM auth.users WHERE email = 'bohdana.martynenko@gmail.com');
UPDATE public.profiles SET position = 'Оператор [ОК]', department = 'Підтримка' WHERE id = (SELECT id FROM auth.users WHERE email = 'violetta16052000@gmail.com');
UPDATE public.profiles SET position = 'Менеджер [РО1]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'raya.chorna@gmail.com');
UPDATE public.profiles SET position = 'Менеджер [РО1]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'a.zubkova2108@gmail.com');
UPDATE public.profiles SET position = 'Менеджер [РО2]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'podubinska1980@gmail.com');
UPDATE public.profiles SET position = 'Менеджер [РО2]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'serebriakovaelen@gmail.com');
UPDATE public.profiles SET position = 'Менеджер [РО3]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'ek.samylicheva@gmail.com');
UPDATE public.profiles SET position = 'Менеджер [РО3]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'marinasmiyan02@gmail.com');
UPDATE public.profiles SET position = 'Менеджер [РО4]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'luzinaosnach18@gmail.com');
UPDATE public.profiles SET position = 'Менеджер [РО4]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'lubov230680@gmail.com');
UPDATE public.profiles SET position = 'Менеджер [РО5]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'marinnekipelova85@gmail.com');
UPDATE public.profiles SET position = 'Менеджер [РО5]', department = 'Продажі' WHERE id = (SELECT id FROM auth.users WHERE email = 'nataliiabondar00@gmail.com');
UPDATE public.profiles SET position = 'HR [6|НR]', department = 'HR' WHERE id = (SELECT id FROM auth.users WHERE email = 'katyabondarchukk@gmail.com');
UPDATE public.profiles SET position = 'Програміст', department = 'IT' WHERE id = (SELECT id FROM auth.users WHERE email = 'failarm13@gmail.com');

-- Перевірка оновлень (через JOIN з auth.users)
SELECT 
  p.full_name,
  u.email,
  p.position,
  p.department
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email IN (
  'dandali.v@gmail.com',
  'viktoria.turuta@gmail.com',
  'admin@wgarage.com',
  'failarm13@gmail.com'
)
ORDER BY u.email;

-- Статистика по відділам
SELECT 
  department,
  COUNT(*) as employee_count
FROM public.profiles
WHERE department IS NOT NULL
GROUP BY department
ORDER BY employee_count DESC;
