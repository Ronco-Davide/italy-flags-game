"use client";

import React, { useState, useEffect, useRef, useId, useMemo } from "react";
import confetti from "canvas-confetti";
import { levels, Level } from "../data/levels";

// Generatore deterministico per avere la stessa sequenza ogni giorno
function getDailyLevels(array: Level[], dateStr: string): Level[] {
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed << 5) - seed + dateStr.charCodeAt(i);
    seed |= 0;
  }

  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(pseudoRandom() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 5);
}

function pickRandomLevels(array: Level[], count: number): Level[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function FlagGame() {
  const componentId = useId().replace(/:/g, "");
  const [gameState, setGameState] = useState<"home" | "game" | "summary">("home");
  const [selectedLevels, setSelectedLevels] = useState<Level[]>([]);
  const [gameMode, setGameMode] = useState<"daily" | 5 | 10 | 20>(5);

  const [currentIdx, setCurrentIdx] = useState(0);
  const currentLevel = selectedLevels[currentIdx] || levels[0];

  const [svgContent, setSvgContent] = useState<string>("");
  const [originalSvgContent, setOriginalSvgContent] = useState<string>("");

  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [copied, setCopied] = useState(false);

  // Data odierna in formato YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Stato Sfida del Giorno da localStorage
  const [dailyCompleted, setDailyCompleted] = useState<{ date: string; score: number } | null>(null);

  // Record salvati in localStorage (5, 10, 20 regioni)
  const [highScores, setHighScores] = useState<{ [key: number]: number | null }>({
    5: null,
    10: null,
    20: null,
  });

  const [result, setResult] = useState<{ score: string } | null>(null);
  const [roundScores, setRoundScores] = useState<{ name: string; score: number }[]>([]);

  const [hue, setHue] = useState(180);
  const [saturation, setSaturation] = useState(50);
  const [lightness, setLightness] = useState(50);

  const flagContainerRef = useRef<HTMLDivElement>(null);
  const currentColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  // Estrae casualmente 1 dei 3 funFacts disponibili
  const currentFunFact = useMemo(() => {
    if (!currentLevel || !currentLevel.funFacts) return null;
    const randomIndex = Math.floor(Math.random() * currentLevel.funFacts.length);
    return currentLevel.funFacts[randomIndex];
  }, [currentLevel, currentIdx]);

  useEffect(() => {
    try {
      const savedHighs = localStorage.getItem("flag_game_highscores");
      if (savedHighs) setHighScores(JSON.parse(savedHighs));

      const savedDaily = localStorage.getItem("flag_game_daily");
      if (savedDaily) {
        const parsed = JSON.parse(savedDaily);
        if (parsed.date === todayStr) {
          setDailyCompleted(parsed);
        }
      }
    } catch {
      // Ignora errori SSR
    }
  }, [todayStr]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const setRandomColors = () => {
    setHue(Math.floor(Math.random() * 361));
    setSaturation(Math.floor(Math.random() * 71) + 30);
    setLightness(Math.floor(Math.random() * 51) + 30);
  };

  const startDailyChallenge = () => {
    setGameMode("daily");
    const chosen = getDailyLevels(levels, todayStr);
    setSelectedLevels(chosen);
    setCurrentIdx(0);
    setRoundScores([]);
    setGameState("game");
    setResult(null);
    setCopied(false);
    setRandomColors();
  };

  const startGame = (count: 5 | 10 | 20) => {
    setGameMode(count);
    const chosen = count >= levels.length ? [...levels] : pickRandomLevels(levels, count);
    setSelectedLevels(chosen);
    setCurrentIdx(0);
    setRoundScores([]);
    setGameState("game");
    setResult(null);
    setCopied(false);
    setRandomColors();
  };

  // Parser SVG Interattivo
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

  // Caricamento Bandiera originale
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

  // Funzione di verifica percettiva calibrata per toni saturi e acromatici (nero/bianco/grigio)
  const handleVerify = () => {
    const target = currentLevel.targetHsl;

    // 1. Calcolo scarto di Luminosità (0 - 1)
    const deltaL = Math.abs(lightness - target.l) / 100;

    // 2. Calcolo scarto di Saturazione (0 - 1)
    const deltaS = Math.abs(saturation - target.s) / 100;

    // 3. Calcolo scarto di Tonalità circolare (0 - 1)
    let hueDiff = Math.abs(hue - target.h);
    if (hueDiff > 180) hueDiff = 360 - hueDiff;
    const deltaH = hueDiff / 180;

    // 4. Peso percettivo di Hue: se vicino a nero, bianco o grigio, la tinta conta progressivamente di meno
    const effectiveSat = Math.min(saturation, target.s) / 100;
    const lightnessFromExtremes = 1 - Math.abs(Math.min(lightness, target.l) - 50) / 50;
    const hueWeight = effectiveSat * Math.max(0, lightnessFromExtremes);

    // 5. Errore pesato
    const totalWeightedError =
      deltaL * 0.45 +
      deltaS * 0.25 +
      deltaH * 0.30 * hueWeight;

    const maxPossibleError = 0.45 + 0.25 + 0.30 * hueWeight;
    const normalizedError = Math.min(1, totalWeightedError / maxPossibleError);

    // Esponente bilanciato a 1.25
    const scoreVal = Math.max(0, Math.min(100, 100 - Math.pow(normalizedError, 1.25) * 100));

    const numericScore = parseFloat(scoreVal.toFixed(1));
    setResult({ score: numericScore.toFixed(1) });

    if (numericScore >= 95) triggerConfetti();

    const updatedScores = [...roundScores, { name: currentLevel.title, score: numericScore }];
    setRoundScores(updatedScores);

    // Fine partita e salvataggio record
    if (currentIdx === selectedLevels.length - 1) {
      const avg = parseFloat(
        (updatedScores.reduce((acc, curr) => acc + curr.score, 0) / updatedScores.length).toFixed(1)
      );

      if (gameMode === "daily") {
        const dailyData = { date: todayStr, score: avg };
        setDailyCompleted(dailyData);
        try {
          localStorage.setItem("flag_game_daily", JSON.stringify(dailyData));
        } catch {
          // Ignora
        }
      } else {
        const currentHigh = highScores[gameMode];
        if (currentHigh === null || avg > currentHigh) {
          const newHighs = { ...highScores, [gameMode]: avg };
          setHighScores(newHighs);
          try {
            localStorage.setItem("flag_game_highscores", JSON.stringify(newHighs));
          } catch {
            // Ignora
          }
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
      triggerConfetti();
    }
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 95) return "🟢";
    if (score >= 80) return "🟡";
    if (score >= 60) return "🟠";
    return "🔴";
  };

  const handleShare = () => {
    const avg =
      roundScores.length > 0
        ? (roundScores.reduce((a, b) => a + b.score, 0) / roundScores.length).toFixed(1)
        : "0.0";

    const rows = roundScores
      .map((item, idx) => `${idx + 1}. ${getScoreEmoji(item.score)} ${item.score}% (${item.name})`)
      .join("\n");

    const header =
      gameMode === "daily"
        ? `📅 Sfida del Giorno (${todayStr.split("-").reverse().join("/")})`
        : `🇮🇹 Modalità Libera (${gameMode} Regioni)`;

    const shareText = `🇮🇹 Color Match: Regioni\n${header}\nMedia: ${avg}% 🏆\n\n${rows}\n\nGioca anche tu: ${window.location.origin}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

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
            <p>🎯 <strong>Obiettivo:</strong> Ricrea il colore mancante della bandiera regionale usando i 3 slider.</p>
            <div className="bg-white p-3 rounded-xl border border-black/10 flex flex-col gap-1.5 text-xs">
              <div>🎨 <strong>1° Slider (Tonalità):</strong> Cambia il colore base.</div>
              <div>💧 <strong>2° Slider (Saturazione):</strong> Regola l&apos;intensità del colore.</div>
              <div>☀️ <strong>3° Slider (Luminosità):</strong> Regola la luce da nero a bianco.</div>
            </div>
            <p>📅 <strong>Sfida del Giorno:</strong> Ogni giorno 5 regioni uguali per tutti i giocatori!</p>
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Record Modalità Libera</span>
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

          {/* SFIDA DEL GIORNO NELLO STATS */}
          <div className="flex flex-col gap-2 mt-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sfida del Giorno ({todayStr.split("-").reverse().join("/")})
            </span>
            <div className="bg-white border-2 border-black/80 rounded-xl p-3 flex justify-between items-center shadow-[0_2px_0_0_#000]">
              <span className="text-xs font-bold text-slate-700">Punteggio Oggi:</span>
              <span className="text-base font-black text-amber-600">
                {dailyCompleted ? `${dailyCompleted.score}%` : "Non ancora giocata"}
              </span>
            </div>
          </div>

          {gameState === "game" && (
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Partita in corso ({roundScores.length}/{selectedLevels.length})
              </span>
              <div className="bg-white border border-black/20 rounded-xl p-3 max-h-40 overflow-y-auto flex flex-col gap-1.5 text-xs">
                {roundScores.length === 0 ? (
                  <span className="text-slate-400 italic text-center py-2">Nessuna regione completata</span>
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

        <h1 className="text-3xl font-black text-slate-900 mb-1 text-center">Color Match: Regioni</h1>
        <p className="text-xs text-slate-500 mb-5 text-center">Indovina i colori ufficiali d&apos;Italia 🇮🇹</p>

        <div className="flex flex-col gap-3.5 w-full">
          {/* PULSANTE SPECIALE SFIDA DEL GIORNO */}
          <button
            onClick={startDailyChallenge}
            className={`py-4 text-black font-black text-lg rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex justify-between items-center px-5 ${
              dailyCompleted ? "bg-[#FFE082]" : "bg-[#FFCA28]"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span className="text-left leading-tight">
                <div>Sfida del Giorno</div>
                <div className="text-[10px] font-normal text-slate-800 uppercase tracking-wider">5 Regioni di oggi</div>
              </span>
            </div>
            <span className="text-xs bg-black/10 px-2.5 py-1 rounded-full font-bold">
              {dailyCompleted ? `${dailyCompleted.score}% ✓` : "GIOCA"}
            </span>
          </button>

          <div className="flex items-center my-1">
            <div className="flex-1 border-t border-slate-300" />
            <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Modalità Libera</span>
            <div className="flex-1 border-t border-slate-300" />
          </div>

          <button
            onClick={() => startGame(5)}
            className="py-3.5 bg-[#549EFA] text-black font-black text-base rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex justify-between items-center px-5"
          >
            <span>5 Regioni</span>
            <span className="text-xs bg-black/10 px-2 py-0.5 rounded-full">{highScores[5] ? `Top: ${highScores[5]}%` : "Facile"}</span>
          </button>
          <button
            onClick={() => startGame(10)}
            className="py-3.5 bg-[#4BE38A] text-black font-black text-base rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex justify-between items-center px-5"
          >
            <span>10 Regioni</span>
            <span className="text-xs bg-black/10 px-2 py-0.5 rounded-full">{highScores[10] ? `Top: ${highScores[10]}%` : "Medio"}</span>
          </button>
          <button
            onClick={() => startGame(20)}
            className="py-3.5 bg-[#F39C12] text-black font-black text-base rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex justify-between items-center px-5"
          >
            <span>Tutte le 20 Regioni</span>
            <span className="text-xs bg-black/10 px-2 py-0.5 rounded-full">{highScores[20] ? `Top: ${highScores[20]}%` : "Completo"}</span>
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

    const isNewRecord =
      gameMode !== "daily" &&
      highScores[gameMode] !== null &&
      parseFloat(averageScore) >= (highScores[gameMode] || 0);

    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-[#F7F5EE] p-6 rounded-3xl shadow-xl select-none font-sans border border-stone-200">
        {renderHelpModal()}
        {renderStatsModal()}

        <h2 className="text-3xl font-black text-slate-900 mb-1 text-center">Partita Finita! 🏆</h2>
        <p className="text-sm text-slate-600 mb-5 text-center font-medium">
          {gameMode === "daily" ? `Sfida del Giorno (${todayStr.split("-").reverse().join("/")})` : `Modalità ${gameMode} Regioni`}
        </p>

        <div className="bg-white border-2 border-black rounded-2xl p-5 w-full flex flex-col items-center justify-center shadow-[0_4px_0_0_#000] mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Media Finale</span>
          <div className="text-5xl font-black text-slate-900">{averageScore}%</div>
          {isNewRecord && (
            <span className="mt-2 text-xs font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
              Nuovo Record Personale! 🎉
            </span>
          )}
          {gameMode === "daily" && (
            <span className="mt-2 text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Punteggio Giornaliero Registrato! 📅
            </span>
          )}
        </div>

        {/* PULSANTE CONDIVISIONE WORDLE */}
        <button
          onClick={handleShare}
          className={`w-full py-3.5 mb-3 text-black font-black text-base rounded-2xl border-2 border-black shadow-[0_3px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 ${
            copied ? "bg-[#4BE38A]" : "bg-[#FFD166]"
          }`}
        >
          {copied ? "Risultato Copiato! 📋" : "Condividi Risultato 📤"}
        </button>

        <div className="flex gap-2 w-full mb-3">
          <button
            onClick={() => setShowStats(true)}
            className="flex-1 py-3 bg-white text-black font-bold text-sm rounded-xl border-2 border-black shadow-[0_3px_0_0_#000] active:translate-y-0.5 active:shadow-none"
          >
            Dettagli 📋
          </button>
          <button
            onClick={() => (gameMode === "daily" ? startDailyChallenge() : startGame(gameMode))}
            className="flex-1 py-3 bg-[#4BE38A] text-black font-bold text-sm rounded-xl border-2 border-black shadow-[0_3px_0_0_#000] active:translate-y-0.5 active:shadow-none"
          >
            Rigioca 🔄
          </button>
        </div>

        <button
          onClick={() => setGameState("home")}
          className="w-full py-3 bg-[#549EFA] text-black font-black text-sm rounded-2xl border-2 border-black shadow-[0_3px_0_0_#000] active:translate-y-1 active:shadow-none"
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

      <div className="flex justify-between items-center w-full mb-3">
        <span
          onClick={() => setGameState("home")}
          className="text-xl font-bold cursor-pointer text-slate-700 active:scale-90 transition-transform"
          title="Torna alla Home"
        >
          🏠
        </span>
        <div className="flex items-center gap-1.5">
          {gameMode === "daily" && <span className="text-xs">📅</span>}
          <div className="bg-stone-200/80 px-3.5 py-1 rounded-full text-xs font-black text-slate-700 tracking-wider">
            {currentIdx + 1} / {selectedLevels.length}
          </div>
        </div>
        <div className="flex gap-3 text-lg text-slate-700">
          <span onClick={() => setShowStats(true)} className="cursor-pointer active:scale-90 transition-transform">📊</span>
          <span onClick={() => setShowHelp(true)} className="cursor-pointer active:scale-90 transition-transform">❓</span>
        </div>
      </div>

      <h2 className="text-2xl font-black text-slate-900 mb-5">{currentLevel.title}</h2>

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

      {/* 3 SLIDER CON CURSORE PERFETTAMENTE CONTENUTO */}
      <div className="flex flex-col gap-4 w-full mb-6">
        {/* Slider 1: Hue */}
        <div
          className="relative flex items-center h-8 rounded-full border-2 border-black overflow-hidden shadow-inner px-1"
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
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10 touch-none"
          />
          <div
            className="w-6 h-6 bg-white border-2 border-black rounded-full shadow pointer-events-none absolute"
            style={{ left: `calc(4px + ${(hue / 360)} * (100% - 32px))` }}
          />
        </div>

        {/* Slider 2: Saturation */}
        <div
          className="relative flex items-center h-8 rounded-full border-2 border-black overflow-hidden shadow-inner px-1"
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
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10 touch-none"
          />
          <div
            className="w-6 h-6 bg-white border-2 border-black rounded-full shadow pointer-events-none absolute"
            style={{ left: `calc(4px + ${(saturation / 100)} * (100% - 32px))` }}
          />
        </div>

        {/* Slider 3: Lightness */}
        <div
          className="relative flex items-center h-8 rounded-full border-2 border-black overflow-hidden shadow-inner px-1"
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
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10 touch-none"
          />
          <div
            className="w-6 h-6 bg-white border-2 border-black rounded-full shadow pointer-events-none absolute"
            style={{ left: `calc(4px + ${(lightness / 100)} * (100% - 32px))` }}
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

            <div className="flex flex-col gap-1 w-full">
              <span className="text-xs font-bold text-slate-400 uppercase">Bandiera Ufficiale:</span>
              <div className="w-full h-28 rounded-lg border border-black/20 overflow-hidden bg-white flex items-center justify-center p-2">
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

            {/* CURIOSITÀ POST-ROUND */}
            {currentFunFact && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-950 flex flex-col gap-1 text-left">
                <span className="font-bold flex items-center gap-1">💡 Lo sapevi?</span>
                <p className="leading-snug text-slate-700">{currentFunFact}</p>
              </div>
            )}
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