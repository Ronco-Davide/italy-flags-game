import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const inputDir = path.join(process.cwd(), 'public', 'flags-original');

if (!fs.existsSync(inputDir)) {
  console.error(`Cartella non trovata: ${inputDir}`);
  process.exit(1);
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.svg'));

console.log(`=== ANALISI STRUTTURA DEI PRIMI 3 FILE SVG ===\n`);

for (const file of files.slice(0, 4)) {
  const content = fs.readFileSync(path.join(inputDir, file), 'utf-8');
  const $ = cheerio.load(content, { xmlMode: true });

  console.log(`📄 File: ${file}`);
  
  // Controlla tag <style>
  const styles = $('style').text();
  if (styles) {
    console.log(`  🔹 Contiene tag <style>: ${styles.replace(/\s+/g, ' ').slice(0, 120)}...`);
  }

  // Estrai i primi 5 colori trovati
  const foundColors = new Set();
  $('*').each((_, el) => {
    const f = $(el).attr('fill');
    const s = $(el).attr('stroke');
    const st = $(el).attr('style');
    if (f) foundColors.add(`fill="${f}"`);
    if (s) foundColors.add(`stroke="${s}"`);
    if (st) foundColors.add(`style="${st}"`);
  });

  console.log(`  🎨 Colori/Stili trovati (${foundColors.size}):`);
  Array.from(foundColors).slice(0, 6).forEach(c => console.log(`     - ${c}`));
  console.log('--------------------------------------------------');
}