import 'dotenv/config';
import { binotel } from '../src/integrations/binotelClient';
import { supa } from './supabaseNode';

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function renderHtml(params: {
  leftLabel: string;
  rightLabel: string;
  totalLeft: number;
  perDayLeft: number;
  totalRight: number;
  factor: string;
  topLeft: Array<{name: string; count: number; pct: number}>;
  topRight: Array<{name: string; count: number; pct: number}>;
  changes: string[];
  conclusions: string[];
}) {
  const topList = (arr: typeof params.topLeft) => arr.map((x,i)=>`<div>${i+1}. ${x.name} <b>${x.count}</b> (${x.pct}%)</div>`).join('');
  return `
  <div style="font-family: Arial; padding: 16px;">
    <h2 style="text-align:center;">ПОРІВНЯЛЬНИЙ АНАЛІЗ ПРОБЛЕМНИХ ДЗВІНКІВ</h2>
    <div style="display:flex; gap:16px;">
      <div style="flex:1; background:#e6f0ff; padding:12px; border-radius:8px;">
        <div><b>${params.leftLabel}</b></div>
        <div>Всього поганих: <h1>${params.totalLeft}</h1> ~${params.perDayLeft}/день</div>
      </div>
      <div style="flex:1; background:#fff0d9; padding:12px; border-radius:8px;">
        <div><b>${params.rightLabel}</b></div>
        <div>Всього поганих: <h1>${params.totalRight}</h1> <span style="color:#c44">${params.factor}</span></div>
      </div>
    </div>
    <h3 style="margin-top:16px;">ТОП-5 ПРОБЛЕМНИХ МЕНЕДЖЕРІВ</h3>
    <div style="display:flex; gap:16px;">
      <div style="flex:1;">${topList(params.topLeft)}</div>
      <div style="flex:1;">${topList(params.topRight)}</div>
    </div>
    <h3 style="margin-top:16px;">КЛЮЧОВІ ЗМІНИ</h3>
    <ul>${params.changes.map(x=>`<li>${x}</li>`).join('')}</ul>
    <h3 style="margin-top:16px;">КРИТИЧНІ ВИСНОВКИ</h3>
    <ol>${params.conclusions.map(x=>`<li>${x}</li>`).join('')}</ol>
  </div>`;
}

async function main() {
  const orgId = process.env.VITE_ORGANIZATION_ID as string;
  if (!orgId) {
    console.error('VITE_ORGANIZATION_ID is required');
    process.exit(1);
  }

  const targetDate = process.argv[2] ? new Date(process.argv[2]) : new Date();
  const yesterday = new Date(targetDate.getTime() - 24*3600*1000);
  const leftStart = new Date(yesterday.getTime() - 8*24*3600*1000); // 9 days window

  const rightLabel = `${ymd(targetDate)} (1 день)`;
  const leftLabel = `${ymd(leftStart)}–${ymd(yesterday)} (9 днів)`;

  // Fetch calls from Binotel (left period and right day)
  // NOTE: Adjust binotel.getCallsForDateRange when Binotel doc available.
  const rightCalls = await binotel.getCallsForDate(ymd(targetDate));
  const leftCallsArr: any[] = [];
  for (let d = new Date(leftStart); d <= yesterday; d = new Date(d.getTime() + 24*3600*1000)) {
    const data = await binotel.getCallsForDate(ymd(d));
    leftCallsArr.push(...(Array.isArray(data?.calls) ? data.calls : data));
  }
  const rightList = Array.isArray(rightCalls?.calls) ? rightCalls.calls : rightCalls;

  const isBad = (c: any) => c.status === 'bad' || c.quality === 'bad';
  const leftTotalBad = leftCallsArr.filter(isBad).length;
  const rightTotalBad = rightList.filter(isBad).length;

  const leftPerDay = Math.round(leftTotalBad / 9);
  const factor = leftPerDay ? `В ${Math.max(1, Math.round(rightTotalBad / leftPerDay))} РАЗІВ БІЛЬШЕ!` : '';

  function topManagers(list: any[]) {
    const m: Record<string, number> = {};
    for (const c of list) {
      if (isBad(c)) {
        const name = c.managerName || c.userName || 'Невідомо';
        m[name] = (m[name] || 0) + 1;
      }
    }
    const total = list.length || 0;
    return Object.entries(m)
      .map(([name, count]) => ({ name, count: count as number, pct: total ? Math.round(((count as number)/total)*100) : 0 }))
      .sort((a,b)=>b.count - a.count)
      .slice(0,5);
  }

  const topLeft = topManagers(leftCallsArr);
  const topRight = topManagers(rightList);

  const changes: string[] = [
    // Placeholder bullets; replace with diff logic per real ROAP tags
    'Зміна лідерів у топі проблемних менеджерів',
    'Стрибок кількості проблемних дзвінків у порівнянні з базовим періодом',
  ];
  const conclusions: string[] = [
    'Розібрати причини зростання “поганих” дзвінків',
    'Провести ROAP‑навчання для менеджерів з топу',
  ];

  const html = renderHtml({
    leftLabel,
    rightLabel,
    totalLeft: leftTotalBad,
    perDayLeft: leftPerDay,
    totalRight: rightTotalBad,
    factor,
    topLeft,
    topRight,
    changes,
    conclusions,
  });

  const payload = {
    left: { totalBad: leftTotalBad, perDay: leftPerDay, top: topLeft },
    right: { totalBad: rightTotalBad, top: topRight },
    changes,
    conclusions,
  };

  // Ensure only one report per date
  await supa.from('binotel_reports').delete().eq('organization_id', orgId).eq('report_date', ymd(targetDate));
  const { error } = await supa.from('binotel_reports').insert({
    organization_id: orgId,
    report_date: ymd(targetDate),
    payload,
    html,
  });
  if (error) throw error;
  console.log('✅ Report generated and uploaded for', ymd(targetDate));
}

main().catch(e=>{ console.error(e); process.exit(1); });
