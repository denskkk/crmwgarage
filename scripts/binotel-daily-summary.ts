import 'dotenv/config';
import { binotel } from '../src/integrations/binotelClient';

function formatDateYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function main() {
  const argDate = process.argv[2];
  const date = argDate ? new Date(argDate) : new Date(Date.now() - 24 * 3600 * 1000);
  const ymd = formatDateYMD(date);
  console.log(`[binotel] Fetching calls for ${ymd}...`);

  try {
    const data = await binotel.getCallsForDate(ymd);
    const calls = Array.isArray(data?.calls) ? data.calls : data;
    const total = calls.length || 0;
    const bad = calls.filter((c: any) => c.status === 'bad' || c.quality === 'bad').length;
    const perDay = total; // for single day

    console.log(`Total calls: ${total}`);
    console.log(`Bad calls: ${bad}`);
    console.log(`~per day: ${perDay}`);

    // Group by manager if present
    const byManager: Record<string, number> = {};
    for (const c of calls) {
      const m = c.managerName || c.userName || 'unknown';
      byManager[m] = (byManager[m] || 0) + ((c.status === 'bad' || c.quality === 'bad') ? 1 : 0);
    }
    const top = Object.entries(byManager).sort((a, b) => b[1] - a[1]).slice(0, 5);
    console.log('Top-5 problematic managers:');
    for (const [name, count] of top) {
      const pct = total ? Math.round((count / total) * 100) : 0;
      console.log(`- ${name}: ${count} (${pct}%)`);
    }
  } catch (e: any) {
    console.error('[binotel] Error:', e.message);
    process.exitCode = 1;
  }
}

main();
