"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import { levels } from "../data/levels";

// Funzione interna per estrarre livelli casuali senza dipendere da import esterni
function pickRandomLevels<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function FlagGame() {
  const componentId = useId().replace(/:/g, "");
  const [gameState, setGameState] = useState<"home" | "game" | "summary">("home");
  const [selectedLevels, setSelectedLevels] = useState<typeof levels>([]);
  const [currentMode, setCurrentMode] = useState<5 | 10 | 20>(5);

  const [currentIdx, setCurrentIdx] = useState(0);
  const currentLevel = selectedLevels[currentIdx] || levels[0];

  const [svgContent, setSvgContent] = useState<string>("");
  const [originalSvgContent, setOriginalSvgContent] = useState<string>("");

  // Modali in alto
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Record salvati in localStorage (5, 10, 20 regioni)
  const [highScores, setHighScores] = useState<{ [key: number]: number | null }>({
    5: null,
    10: null,
    20: null,
  });

  // Risultato e cronologia del round corrente
  const [result, setResult] = useState<{ score: string } | null>(null);
  const [roundScores, setRoundScores] = useState<{ name: string; score: number }[]>([]);

  // Valori colore gestiti per massima fluidità
  const [hue, setHue] = useState(180);
  const [saturation, setSaturation] = useState(50);
  const [lightness, setLightness] = useState(50);

  // Riferimenti per aggiornare lo stile al volo durante il drag
  const flagContainerRef = useRef<HTMLDivElement>(null);
  const currentColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  // Carica i record da localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("flag_game_highscores");
      if (saved) {
        setHighScores(JSON.parse(saved));
      }
    } catch {
      // Ignora errori di parsing o SSR
    }
  }, []);

  const setRandomColors = () => {
    const h = Math.floor(Math.random() * 361);
    const s = Math.floor(Math.random() * 71) + 30;
    const l = Math.floor(Math.random() * 51) + 30;
    setHue(h);
    setSaturation(s);
    setLightness(l);
  };

  const startGame = (count: 5 | 10 | 20) => {
    setCurrentMode(count);
    const chosen = count >= levels.length ? [...levels] : pickRandomLevels(levels, count);
    setSelectedLevels(chosen);
    setCurrentIdx(0);
    setRoundScores([]);
    setGameState("game");
    setResult(null);
    setRandomColors();
  };

  // Parser SVG Bandiera del gioco
  useEffect(() => {
    if (gameState !== "game" || !currentLevel) return;

    fetch(currentLevel.svgFile)
      .then((res) => res.text())
      .then((rawSvg) => {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(rawSvg, "image/svg+xml");
          const svgEl = doc.querySelector("svg");

          if (svgEl) {
            const widthAttr = svgEl.getAttribute("width");
            const heightAttr = svgEl.getAttribute("height");
            const viewBoxAttr = svgEl.getAttribute("viewBox");

            if (!viewBoxAttr && widthAttr && heightAttr) {
              const w = parseFloat(widthAttr.replace(/[^0-9.]/g, ""));
              const h = parseFloat(heightAttr.replace(/[^0-9.]/g, ""));
              if (w && h) svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);
            }

            svgEl.setAttribute("width", "100%");
            svgEl.setAttribute("height", "100%");
            svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");
            svgEl.style.display = "block";
            svgEl.style.maxWidth = "100%";
            svgEl.style.maxHeight = "100%";

            setSvgContent(svgEl.outerHTML);
          } else {
            setSvgContent(rawSvg);
          }
        } catch {
          setSvgContent(rawSvg);
        }
      })
      .catch(() => setSvgContent(""));
  }, [gameState, currentLevel]);

  // Caricamento Bandiera originale intatta
  useEffect(() => {
    if (gameState !== "game" || !currentLevel) return;

    const fileName = currentLevel.svgFile.split("/").pop();
    fetch(`/flags-original/${fileName}`)
      .then((res) => res.text())
      .then((rawSvg) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawSvg, "image/svg+xml");
        const svgEl = doc.querySelector("svg");
        if (svgEl) {
          const widthAttr = svgEl.getAttribute("width");
          const heightAttr = svgEl.getAttribute("height");
          const viewBoxAttr = svgEl.getAttribute("viewBox");

          if (!viewBoxAttr && widthAttr && heightAttr) {
            const w = parseFloat(widthAttr.replace(/[^0-9.]/g, ""));
            const h = parseFloat(heightAttr.replace(/[^0-9.]/g, ""));
            if (w && h) svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);
          }

          svgEl.setAttribute("width", "100%");
          svgEl.setAttribute("height", "100%");
          svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");
          setOriginalSvgContent(svgEl.outerHTML);
        } else {
          setOriginalSvgContent(rawSvg);
        }
      })
      .catch(() => setOriginalSvgContent(""));
  }, [gameState, currentLevel]);

  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  };

  const handleVerify = () => {
    const [r1, g1, b1] = hslToRgb(hue, saturation, lightness);
    const [r2, g2, b2] = hslToRgb(currentLevel.targetHsl.h, currentLevel.targetHsl.s, currentLevel.targetHsl.l);

    const distance = Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
    const errorRatio = distance / 441.67;
    const penalty = Math.pow(errorRatio, 0.85) * 100;
    const scoreVal = Math.max(0, Math.min(100, 100 - penalty));

    const numericScore = parseFloat(scoreVal.toFixed(1));
    setResult({ score: numericScore.toFixed(1) });

    const updatedScores = [...roundScores, { name: currentLevel.title, score: numericScore }];
    setRoundScores(updatedScores);

    // Salvataggio record se è l'ultimo livello
    if (currentIdx === selectedLevels.length - 1) {
      const avg = parseFloat(
        (updatedScores.reduce((acc, curr) => acc + curr.score, 0) / updatedScores.length).toFixed(1)
      );
      const currentHigh = highScores[currentMode];
      if (currentHigh === null || avg > currentHigh) {
        const newHighs = { ...highScores, [currentMode]: avg };
        setHighScores(newHighs);
        try {
          localStorage.setItem("flag_game_highscores", JSON.stringify(newHighs));
        } catch {
          // Ignora errori di salvataggio
        }
      }
    }
  };

  const nextLevel = () => {
    if (currentIdx < selectedLevels.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setRandomColors();
      setResult(null);
    } else {
      setGameState("summary");
    }
  };

  // --- MODALI ---
  const renderHelpModal = () => {
    if (!showHelp) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-[#F7F5EE] border-2 border-black rounded-3xl p-6 w-full max-w-sm shadow-[0_6px_0_0_#000] flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900">Come si gioca? ❓</h3>
            <button
              onClick={() => setShowHelp(false)}
              className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center font-black text-sm active:translate-y-0.5"
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-slate-700 flex flex-col gap-2.5 leading-relaxed">
            <p>
              🎯 <strong>Obiettivo:</strong> Ricrea il colore mancante della bandiera regionale usando i 3 slider.
            </p>
            <div className="bg-white p-3 rounded-xl border border-black/10 flex flex-col gap-1.5 text-xs">
              <div>🎨 <strong>1° Slider (Tonalità):</strong> Cambia il colore base.</div>
              <div>💧 <strong>2° Slider (Saturazione):</strong> Regola l&apos;intensità del colore.</div>
              <div>☀️ <strong>3° Slider (Luminosità):</strong> Regola la luce da nero a bianco.</div>
            </div>
            <p>Più ti avvicini al colore reale della bandiera ufficiale, più alto sarà il punteggio!</p>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="w-full py-3 bg-[#549EFA] text-black font-black text-base rounded-2xl border-2 border-black shadow-[0_3px_0_0_#000] active:translate-y-1 active:shadow-none"
          >
            Ho capito! 👍
          </button>
        </div>
      </div>
    );
  };

  const renderStatsModal = () => {
    if (!showStats) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-[#F7F5EE] border-2 border-black rounded-3xl p-6 w-full max-w-sm shadow-[0_6px_0_0_#000] flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900">Statistiche &amp; Record 📊</h3>
            <button
              onClick={() => setShowStats(false)}
              className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center font-black text-sm active:translate-y-0.5"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Migliori Record</span>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20].map((num) => (
                <div key={num} className="bg-white border-2 border-black/80 rounded-xl p-2.5 text-center shadow-[0_2px_0_0_#000]">
                  <div className="text-[11px] font-bold text-slate-500">{num} Reg.</div>
                  <div className="text-base font-black text-emerald-600">
                    {highScores[num] !== null ? `${highScores[num]}%` : "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {gameState === "game" && (
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Partita in corso ({roundScores.length}/{selectedLevels.length})
              </span>
              <div className="bg-white border border-black/20 rounded-xl p-3 max-h-40 overflow-y-auto flex flex-col gap-1.5 text-xs">
                {roundScores.length === 0 ? (
                  <span className="text-slate-400 italic text-center py-2">Nessuna regione ancora completata</span>
                ) : (
                  roundScores.map((item, idx) => (
                    <div key={idx} className="flex justify-between border-b border-stone-100 pb-1">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="font-black text-slate-900">{item.score}%</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => setShowStats(false)}
            className="w-full py-3 bg-[#4BE38A] text-black font-black text-base rounded-2xl border-2 border-black shadow-[0_3px_0_0_#000] active:translate-y-1 active:shadow-none mt-1"
          >
            Chiudi
          </button>
        </div>
      </div>
    );
  };

  // --- SCHERMATA HOME ---
  if (gameState === "home") {
    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-[#F7F5EE] p-6 rounded-3xl shadow-xl select-none font-sans border border-stone-200">
        {renderHelpModal()}
        {renderStatsModal()}

        <div className="flex justify-between items-center w-full mb-4">
          <div className="w-8" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Menu Principale</span>
          <div className="flex gap-3 text-lg text-slate-700">
            <span onClick={() => setShowStats(true)} className="cursor-pointer active:scale-90 transition-transform">📊</span>
            <span onClick={() => setShowHelp(true)} className="cursor-pointer active:scale-90 transition-transform">❓</span>
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-2 text-center">Color Match: Regioni</h1>
        <p className="text-sm text-slate-600 mb-6 text-center">Seleziona la modalità di gioco:</p>

        <div className="flex flex-col gap-3.5 w-full">
          <button
            onClick={() => startGame(5)}
            className="py-4 bg-[#549EFA] text-black font-black text-lg rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex justify-between items-center px-6"
          >
            <span>5 Regioni 🇮🇹</span>
            <span className="text-xs bg-black/10 px-2.5 py-1 rounded-full">{highScores[5] ? `Top: ${highScores[5]}%` : "Facile"}</span>
          </button>
          <button
            onClick={() => startGame(10)}
            className="py-4 bg-[#4BE38A] text-black font-black text-lg rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex justify-between items-center px-6"
          >
            <span>10 Regioni 🇮🇹</span>
            <span className="text-xs bg-black/10 px-2.5 py-1 rounded-full">{highScores[10] ? `Top: ${highScores[10]}%` : "Medio"}</span>
          </button>
          <button
            onClick={() => startGame(20)}
            className="py-4 bg-[#F39C12] text-black font-black text-lg rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex justify-between items-center px-6"
          >
            <span>Tutte le Regioni 🇮🇹</span>
            <span className="text-xs bg-black/10 px-2.5 py-1 rounded-full">{highScores[20] ? `Top: ${highScores[20]}%` : "Completo"}</span>
          </button>
        </div>
      </div>
    );
  }

  // --- SCHERMATA SOMMARIO FINALE ---
  if (gameState === "summary") {
    const averageScore =
      roundScores.length > 0
        ? (roundScores.reduce((a, b) => a + b.score, 0) / roundScores.length).toFixed(1)
        : "0.0";

    const isNewRecord = highScores[currentMode] !== null && parseFloat(averageScore) >= (highScores[currentMode] || 0);

    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-[#F7F5EE] p-6 rounded-3xl shadow-xl select-none font-sans border border-stone-200">
        {renderHelpModal()}
        {renderStatsModal()}

        <h2 className="text-3xl font-black text-slate-900 mb-1 text-center">Partita Finita! 🏆</h2>
        <p className="text-sm text-slate-600 mb-6 text-center">Modalità: {currentMode} Regioni</p>

        <div className="bg-white border-2 border-black rounded-2xl p-6 w-full flex flex-col items-center justify-center shadow-[0_4px_0_0_#000] mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Media Finale</span>
          <div className="text-5xl font-black text-slate-900">{averageScore}%</div>
          {isNewRecord && (
            <span className="mt-2 text-xs font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
              Nuovo Record Personale! 🎉
            </span>
          )}
        </div>

        <div className="flex gap-2 w-full mb-3">
          <button
            onClick={() => setShowStats(true)}
            className="flex-1 py-3 bg-white text-black font-bold text-sm rounded-xl border-2 border-black shadow-[0_3px_0_0_#000] active:translate-y-0.5 active:shadow-none"
          >
            Vedi Dettagli 📋
          </button>
          <button
            onClick={() => startGame(currentMode)}
            className="flex-1 py-3 bg-[#4BE38A] text-black font-bold text-sm rounded-xl border-2 border-black shadow-[0_3px_0_0_#000] active:translate-y-0.5 active:shadow-none"
          >
            Rigioca 🔄
          </button>
        </div>

        <button
          onClick={() => setGameState("home")}
          className="w-full py-3.5 bg-[#549EFA] text-black font-black text-base rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none"
        >
          Torna alla Home 🏠
        </button>
      </div>
    );
  }

  // --- SCHERMATA DI GIOCO ---
  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-[#F7F5EE] p-6 rounded-3xl shadow-xl select-none font-sans border border-stone-200">
      {renderHelpModal()}
      {renderStatsModal()}

      {/* HEADER */}
      <div className="flex justify-between items-center w-full mb-3">
        <span
          onClick={() => setGameState("home")}
          className="text-xl font-bold cursor-pointer text-slate-700 active:scale-90 transition-transform"
          title="Torna alla Home"
        >
          🏠
        </span>
        <div className="bg-stone-200/80 px-4 py-1 rounded-full text-sm font-black text-slate-700 tracking-wider">
          {currentIdx + 1} / {selectedLevels.length}
        </div>
        <div className="flex gap-3 text-lg text-slate-700">
          <span onClick={() => setShowStats(true)} className="cursor-pointer active:scale-90 transition-transform">📊</span>
          <span onClick={() => setShowHelp(true)} className="cursor-pointer active:scale-90 transition-transform">❓</span>
        </div>
      </div>

      {/* TITOLO REGIONE */}
      <h2 className="text-2xl font-black text-slate-900 mb-5">{currentLevel.title}</h2>

      {/* CONTAINER BANDIERA INTERATTIVA */}
      <div className="w-full flex justify-center mb-6">
        <div
          ref={flagContainerRef}
          className={`flag-box-${componentId} w-full h-52 rounded-xl shadow-md overflow-hidden border-2 border-black/10 flex items-center justify-center bg-white p-2`}
          style={
            {
              "--dynamic-color": currentColor,
            } as React.CSSProperties
          }
        >
          <style>{`
            .flag-box-${componentId} #${currentLevel.targetId},
            .flag-box-${componentId} .${currentLevel.targetId} {
              fill: var(--dynamic-color, #808080) !important;
              stroke: var(--dynamic-color, #808080) !important;
              fill-opacity: 1 !important;
              stroke-opacity: 1 !important;
            }
            .flag-box-${componentId} .flag-wrapper svg {
              width: 100% !important;
              height: 100% !important;
              max-width: 100% !important;
              max-height: 100% !important;
              object-fit: contain !important;
              display: block !important;
              margin: auto !important;
            }
          `}</style>

          <div
            className="flag-wrapper w-full h-full flex items-center justify-center overflow-hidden"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      </div>

      {/* I 3 SLIDER FLUIDI CON TOUCH OTTIMIZZATO */}
      <div className="flex flex-col gap-4 w-full mb-6">
        {/* Slider 1: Hue */}
        <div
          className="relative flex items-center h-8 rounded-full border-2 border-black overflow-hidden shadow-inner"
          style={{
            background:
              "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
          }}
        >
          <input
            type="range"
            min="0"
            max="360"
            disabled={!!result}
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className="absolute w-full opacity-0 cursor-pointer h-full z-10 touch-none"
          />
          <div
            className="w-7 h-7 bg-white border-2 border-black rounded-full shadow pointer-events-none absolute"
            style={{ left: `calc(${(hue / 360) * 100}% - 14px)` }}
          />
        </div>

        {/* Slider 2: Saturation */}
        <div
          className="relative flex items-center h-8 rounded-full border-2 border-black overflow-hidden shadow-inner"
          style={{
            background: `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`,
          }}
        >
          <input
            type="range"
            min="0"
            max="100"
            disabled={!!result}
            value={saturation}
            onChange={(e) => setSaturation(Number(e.target.value))}
            className="absolute w-full opacity-0 cursor-pointer h-full z-10 touch-none"
          />
          <div
            className="w-7 h-7 bg-white border-2 border-black rounded-full shadow pointer-events-none absolute"
            style={{ left: `calc(${saturation}% - 14px)` }}
          />
        </div>

        {/* Slider 3: Lightness */}
        <div
          className="relative flex items-center h-8 rounded-full border-2 border-black overflow-hidden shadow-inner"
          style={{
            background: `linear-gradient(to right, black, hsl(${hue}, ${saturation}%, 50%), white)`,
          }}
        >
          <input
            type="range"
            min="0"
            max="100"
            disabled={!!result}
            value={lightness}
            onChange={(e) => setLightness(Number(e.target.value))}
            className="absolute w-full opacity-0 cursor-pointer h-full z-10 touch-none"
          />
          <div
            className="w-7 h-7 bg-white border-2 border-black rounded-full shadow pointer-events-none absolute"
            style={{ left: `calc(${lightness}% - 14px)` }}
          />
        </div>
      </div>

      {/* AZIONI E RISULTATO */}
      {!result ? (
        <button
          onClick={handleVerify}
          className="w-full py-4 bg-[#549EFA] text-black font-black text-lg rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          Blocca colore ✓
        </button>
      ) : (
        <div className="w-full flex flex-col gap-3">
          <div className="bg-white border-2 border-black rounded-2xl p-4 flex flex-col gap-3 shadow-[0_3px_0_0_#000]">
            <div className="flex justify-between items-center w-full">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Precisione Round</span>
                <div className="text-2xl font-black text-slate-900">{result.score}%</div>
              </div>
            </div>

            {/* BANDIERA UFFICIALE */}
            <div className="flex flex-col gap-1 w-full">
              <span className="text-xs font-bold text-slate-400 uppercase">Bandiera Ufficiale:</span>
              <div className="w-full h-32 rounded-lg border border-black/20 overflow-hidden bg-white flex items-center justify-center p-2">
                <style>{`
                  .original-flag-container svg {
                    width: 100% !important;
                    height: 100% !important;
                    max-width: 100% !important;
                    max-height: 100% !important;
                    object-fit: contain !important;
                    display: block !important;
                    margin: auto !important;
                  }
                `}</style>
                <div
                  className="original-flag-container w-full h-full flex items-center justify-center overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: originalSvgContent }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={nextLevel}
            className="w-full py-4 bg-[#4BE38A] text-black font-black text-lg rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
          >
            {currentIdx < selectedLevels.length - 1 ? "Prossimo Livello →" : "Vedi Risultato Finale 🏁"}
          </button>
        </div>
      )}
    </div>
  );
}