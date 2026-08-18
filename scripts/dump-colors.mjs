import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

// 👉 CAMBIA QUI: punta alla cartella dove hai salvato gli stemmi della Serie A
const inputDir = path.join(process.cwd(), 'public', 'serie-a');

if (!fs.existsSync(inputDir)) {
  console.error(`❌ Errore: cartella ${inputDir} non trovata.`);
  process.exit(1);
}

const files = fs.readdirSync(inputDir).filter((f) => f.endsWith('.svg'));

console.log(`=== COLORI ESTRATTI PER GLI STEMMI SERIE A ===\n`);

for (const file of files) {
  const content = fs.readFileSync(path.join(inputDir, file), 'utf-8');
  const $ = cheerio.load(content, { xmlMode: true });

  const colors = new Set();
  $('*').each((_, el) => {
    const fill = $(el).attr('fill');
    const style = $(el).attr('style') || '';
    if (fill && fill !== 'none') colors.add(fill.toLowerCase());

    const fillMatch = style.match(/fill\s*:\s*([^;]+)/i);
    if (fillMatch && fillMatch[1].trim() !== 'none') {
      colors.add(fillMatch[1].trim().toLowerCase());
    }
  });

  console.log(`📌 ${file}: [ ${Array.from(colors).join(', ')} ]`);
}