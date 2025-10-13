-- Додати organization_id до profiles якщо немає
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- Оновити всі існуючі профілі на організацію W-Garage
UPDATE public.profiles 
SET organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7'
WHERE organization_id IS NULL;

-- Перевірка
SELECT 
  p.full_name,
  p.position,
  p.department,
  o.name as organization_name
FROM public.profiles p
LEFT JOIN public.organizations o ON p.organization_id = o.id
LIMIT 10;
