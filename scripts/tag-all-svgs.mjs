import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const inputDir = path.join(process.cwd(), 'public', 'flags-original');
const outputDir = path.join(process.cwd(), 'public', 'flags');

if (!fs.existsSync(inputDir)) {
  console.error(`Cartella ${inputDir} non trovata.`);
  process.exit(1);
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Mappa speciale per elementi di sfondo specifici che non sono il primo rect
const SPECIFIC_TARGETS = {
  'Flag_of_Piedmont.svg': 'path:last-of-type, polygon',
  'Flag_of_Sardinia.svg': 'path, polygon',
  'Flag_of_Marche.svg': 'path:first-of-type, g path',
  'Flag_of_Sicily.svg': 'polygon:first-of-type, path:first-of-type',
  'Flag_of_Emilia-Romagna.svg': 'path:first-of-type, polygon:first-of-type'
};

const files = fs.readdirSync(inputDir).filter((f) => f.endsWith('.svg'));
console.log(`🚀 Ripristino e tag di ${files.length} bandiere pulite...\n`);

for (const file of files) {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);

  const rawXml = fs.readFileSync(inputPath, 'utf-8');
  const $ = cheerio.load(rawXml, { xmlMode: true });

  // Rimuovi vecchi id o classi target-color residui
  $('[id^="target-"]').removeAttr('id');
  $('[class*="target-"]').removeClass('target-color target-stripe target-sea target-green target-red target-black target-pegaso');

  const customSelector = SPECIFIC_TARGETS[file];
  let targetEl = null;

  if (customSelector) {
    targetEl = $(customSelector).first();
  }

  if (!targetEl || !targetEl.length) {
    targetEl = $('svg > rect:first-of-type, svg > path:first-of-type, rect:first-of-type, path:first-of-type').first();
  }

  if (targetEl && targetEl.length) {
    targetEl.attr('id', 'target-color');
    targetEl.addClass('target-color');
    console.log(`  ✓ [${file}] id="target-color" applicato con successo`);
  } else {
    console.log(`  ⚠️ [${file}] Nessun elemento trovato per target-color`);
  }

  fs.writeFileSync(outputPath, $.xml(), 'utf-8');
}

console.log(`\n🎉 Fatto! Tutte le 20 bandiere sono pronte in public/flags/`);