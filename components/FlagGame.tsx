"use client";

import React, { useState, useEffect, useRef, useId, useMemo } from "react";
import confetti from "canvas-confetti";
import { levels, Level, TargetElement } from "../data/levels";

interface RoundConfig {
  level: Level;
  target: TargetElement;
}

// Genera round giornalieri (sempre uguali a seconda della data)
function getDailyRounds(array: Level[], dateStr: string): RoundConfig[] {
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

  return copy.slice(0, 5).map((lvl) => {
    const targetIdx = Math.floor(pseudoRandom() * lvl.targets.length);
    return { level: lvl, target: lvl.targets[targetIdx] };
  });
}

// Estrae bandiere casuali e per ognuna SORTEGGIA un target interno a caso!
function pickRandomRounds(array: Level[], count: number): RoundConfig[] {
  const shuffledLevels = [...array];
  for (let i = shuffledLevels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledLevels[i], shuffledLevels[j]] = [shuffledLevels[j], shuffledLevels[i]];
  }

  return shuffledLevels.slice(0, Math.min(count, shuffledLevels.length)).map((lvl) => {
    // Sceglie a caso un elemento (es. per Liguria deciderà tra Destra, Centro, Sinistra in modo random)
    const targetIdx = Math.floor(Math.random() * lvl.targets.length);
    return { level: lvl, target: lvl.targets[targetIdx] };
  });
}

export default function FlagGame() {
  const componentId = useId().replace(/:/g, "");
  const [gameState, setGameState] = useState<"home" | "game" | "summary">("home");
  const [rounds, setRounds] = useState<RoundConfig[]>([]);
  const [gameMode, setGameMode] = useState<"daily" | 5 | 10 | 20>(5);

  const [currentIdx, setCurrentIdx] = useState(0);
  const currentRound = rounds[currentIdx];
  const currentLevel = currentRound?.level || levels[0];
  const currentTarget = currentRound?.target || currentLevel?.targets[0];

  const [svgContent, setSvgContent] = useState<string>("");
  const [originalSvgContent, setOriginalSvgContent] = useState<string>("");

  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [copied, setCopied] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [dailyCompleted, setDailyCompleted] = useState<{ date: string; score: number } | null>(null);

  const [highScores, setHighScores] = useState<{ [key: number]: number | null }>({
    5: null, 10: null, 20: null,
  });

  const [result, setResult] = useState<{ score: string } | null>(null);
  const [roundScores, setRoundScores] = useState<{ name: string; targetName: string; score: number }[]>([]);

  const [hue, setHue] = useState(180);
  const [saturation, setSaturation] = useState(50);
  const [lightness, setLightness] = useState(50);

  const flagContainerRef = useRef<HTMLDivElement>(null);
  const currentColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  const currentFunFact = useMemo(() => {
    if (!currentLevel || !currentLevel.funFacts) return null;
    return currentLevel.funFacts[Math.floor(Math.random() * currentLevel.funFacts.length)];
  }, [currentLevel, currentIdx]);

  useEffect(() => {
    try {
      const savedHighs = localStorage.getItem("flag_game_highscores");
      if (savedHighs) setHighScores(JSON.parse(savedHighs));

      const savedDaily = localStorage.getItem("flag_game_daily");
      if (savedDaily) {
        const parsed = JSON.parse(savedDaily);
        if (parsed.date === todayStr) setDailyCompleted(parsed);
      }
    } catch { }
  }, [todayStr]);

  const triggerConfetti = () => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
  };

  const setRandomColors = () => {
    setHue(Math.floor(Math.random() * 361));
    setSaturation(Math.floor(Math.random() * 71) + 30);
    setLightness(Math.floor(Math.random() * 51) + 30);
  };

  const startDailyChallenge = () => {
    if (dailyCompleted) return;
    setGameMode("daily");
    setRounds(getDailyRounds(levels, todayStr));
    setCurrentIdx(0);
    setRoundScores([]);
    setGameState("game");
    setResult(null);
    setCopied(false);
    setRandomColors();
  };

  const startGame = (count: 5 | 10 | 20) => {
    setGameMode(count);
    setRounds(pickRandomRounds(levels, count));
    setCurrentIdx(0);
    setRoundScores([]);
    setGameState("game");
    setResult(null);
    setCopied(false);
    setRandomColors();
  };

  // IL MOTORE INFALLIBILE: Sostituzione stringa sul file crudo
  useEffect(() => {
    if (gameState !== "game" || !currentLevel || !currentTarget) return;

    fetch(`/flags/${currentLevel.svgFile}`)
      .then((res) => res.text())
      .then((rawSvg) => {
        let modifiedSvg = rawSvg;

        // Scorre la mega-lista di colori e li rimpiazza brutalmente nel testo XML,
        // così nessun <style> o <def> interno all'SVG può bloccarlo!
        currentTarget.colors.forEach((color) => {
          // Evita che #000 sostituisca per sbaglio pezzi di #000000
          const safeColor = color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regexStr = color.startsWith('#') ? safeColor + "(?![0-9a-fA-F])" : safeColor;
          const regex = new RegExp(regexStr, "gi");
          
          modifiedSvg = modifiedSvg.replace(regex, "var(--dynamic-color)");
        });

        const parser = new DOMParser();
        const doc = parser.parseFromString(modifiedSvg, "image/svg+xml");
        const svgEl = doc.querySelector("svg");

        if (svgEl) {
          // Sistema le proporzioni dell'SVG
          const w = svgEl.getAttribute("width");
          const h = svgEl.getAttribute("height");
          if (!svgEl.getAttribute("viewBox") && w && h) {
            svgEl.setAttribute("viewBox", `0 0 ${parseFloat(w)} ${parseFloat(h)}`);
          }
          svgEl.setAttribute("width", "100%");
          svgEl.setAttribute("height", "100%");
          svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");
          
          setSvgContent(svgEl.outerHTML);
        } else {
          setSvgContent(modifiedSvg);
        }
      })
      .catch(() => setSvgContent(""));
  }, [gameState, currentLevel, currentTarget]);

  // Caricamento per la miniatura finale intatta
  useEffect(() => {
    if (gameState !== "game" || !currentLevel) return;
    
    fetch(`/flags/${currentLevel.svgFile}`)
      .then((res) => res.text())
      .then((rawSvg) => {
        const doc = new DOMParser().parseFromString(rawSvg, "image/svg+xml");
        const svgEl = doc.querySelector("svg");
        if (svgEl) {
          if (!svgEl.getAttribute("viewBox")) {
            const w = svgEl.getAttribute("width"), h = svgEl.getAttribute("height");
            if(w && h) svgEl.setAttribute("viewBox", `0 0 ${parseFloat(w)} ${parseFloat(h)}`);
          }
          svgEl.setAttribute("width", "100%");
          svgEl.setAttribute("height", "100%");
          setOriginalSvgContent(svgEl.outerHTML);
        } else setOriginalSvgContent(rawSvg);
      });
  }, [gameState, currentLevel]);

  const handleVerify = () => {
    const target = currentTarget.targetHsl;

    // 1. Luminosità (0-1)
    const tL = target.l / 100;
    const uL = lightness / 100;

    // 2. Croma (Saturazione visibile basata sulla luminosità)
    // Se L è 0 (nero) o 1 (bianco), il Croma diventa automaticamente 0.
    const tC = (target.s / 100) * (1 - Math.abs(2 * tL - 1));
    const uC = (saturation / 100) * (1 - Math.abs(2 * uL - 1));

    // 3. Coordinate X e Y per miscelare Tonalità e Croma
    const tH = target.h * (Math.PI / 180);
    const uH = hue * (Math.PI / 180);

    const tX = tC * Math.cos(tH);
    const tY = tC * Math.sin(tH);
    
    const uX = uC * Math.cos(uH);
    const uY = uC * Math.sin(uH);

    // 4. Distanze finali percettive
    // chromaDist calcola la differenza reale di colore ignorando la tonalità sui bianchi/neri
    const chromaDist = Math.sqrt(Math.pow(tX - uX, 2) + Math.pow(tY - uY, 2)) / 2;
    const lumDist = Math.abs(tL - uL);

    // 5. Errore Totale (60% Colore, 40% Luce)
    const totalError = (chromaDist * 0.60) + (lumDist * 0.40);
    const penalty = Math.pow(totalError, 0.85) * 100;
    
    const scoreVal = Math.max(0, Math.min(100, 100 - penalty));
    const numericScore = parseFloat(scoreVal.toFixed(1));
    
    setResult({ score: numericScore.toFixed(1) });

    if (numericScore >= 95) triggerConfetti();

    const updatedScores = [...roundScores, { name: currentLevel.title, targetName: currentTarget.elementName, score: numericScore }];
    setRoundScores(updatedScores);

    if (currentIdx === rounds.length - 1) {
      const avg = parseFloat((updatedScores.reduce((acc, curr) => acc + curr.score, 0) / updatedScores.length).toFixed(1));
      if (gameMode === "daily") {
        setDailyCompleted({ date: todayStr, score: avg });
        localStorage.setItem("flag_game_daily", JSON.stringify({ date: todayStr, score: avg }));
      } else {
        const currentHigh = highScores[gameMode];
        if (currentHigh === null || avg > currentHigh) {
          setHighScores({ ...highScores, [gameMode]: avg });
          localStorage.setItem("flag_game_highscores", JSON.stringify({ ...highScores, [gameMode]: avg }));
        }
      }
    }
  };

  const nextLevel = () => {
    if (currentIdx < rounds.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setRandomColors();
      setResult(null);
    } else {
      setGameState("summary");
      triggerConfetti();
    }
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 95) return "🌟";
    if (score >= 90) return "🟢";
    if (score >= 75) return "🟡";
    if (score >= 60) return "🟠";
    return "🔴";
  };

  const handleShare = () => {
    const avg = roundScores.length > 0 ? (roundScores.reduce((a, b) => a + b.score, 0) / roundScores.length).toFixed(1) : "0.0";
    const rows = roundScores.map((item, idx) => `${idx + 1}. ${getScoreEmoji(item.score)} ${item.score}% (${item.name})`).join("\n");
    const header = gameMode === "daily" ? `📅 Sfida del Giorno (${todayStr.split("-").reverse().join("/")})` : `🇮🇹 Modalità Libera (${gameMode} Round)`;
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
            <button onClick={() => setShowHelp(false)} className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center font-black text-sm">✕</button>
          </div>
          <div className="text-sm text-slate-700 flex flex-col gap-2.5 leading-relaxed">
            <p>🎯 <strong>Obiettivo:</strong> Ricrea il colore dell&apos;elemento indicato nella bandiera.</p>
            <div className="bg-white p-3 rounded-xl border border-black/10 flex flex-col gap-1.5 text-xs">
              <div>🎨 <strong>1° Slider (Tonalità):</strong> Cambia il colore base.</div>
              <div>💧 <strong>2° Slider (Saturazione):</strong> Regola l&apos;intensità del colore.</div>
              <div>☀️ <strong>3° Slider (Luminosità):</strong> Regola la luce da nero a bianco.</div>
            </div>
          </div>
          <button onClick={() => setShowHelp(false)} className="w-full py-3 bg-[#549EFA] text-black font-black text-base rounded-2xl border-2 border-black shadow-[0_3px_0_0_#000]">Ho capito! 👍</button>
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
            <button onClick={() => setShowStats(false)} className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center font-black text-sm">✕</button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Record Modalità Libera</span>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20].map((num) => (
                <div key={num} className="bg-white border-2 border-black/80 rounded-xl p-2.5 text-center shadow-[0_2px_0_0_#000]">
                  <div className="text-[11px] font-bold text-slate-500">{num} Round</div>
                  <div className="text-base font-black text-emerald-600">{highScores[num] !== null ? `${highScores[num]}%` : "-"}</div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setShowStats(false)} className="w-full py-3 bg-[#4BE38A] text-black font-black text-base rounded-2xl border-2 border-black shadow-[0_3px_0_0_#000] mt-1">Chiudi</button>
        </div>
      </div>
    );
  };

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
        <button 
            onClick={startDailyChallenge} 
            disabled={!!dailyCompleted} // Disabilita nativamente il bottone
            className={`py-4 text-black font-black text-lg rounded-2xl border-2 border-black flex justify-between items-center px-5 transition-all
              ${dailyCompleted 
                ? "bg-[#FFE082] opacity-70 cursor-not-allowed" // Stile disabilitato
                : "bg-[#FFCA28] shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none" // Stile attivo
              }`}
          >
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span className="text-left leading-tight">
                <div>Sfida del Giorno</div>
                <div className="text-[10px] font-normal text-slate-800 uppercase tracking-wider">
                  {dailyCompleted ? "Torna domani!" : "Stesse Regioni Per Tutti"}
                </div>
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
          <button onClick={() => startGame(5)} className="py-3.5 bg-[#549EFA] text-black font-black text-base rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] flex justify-between px-5"><span>5 Round Casuali</span><span className="text-xs bg-black/10 px-2 py-0.5 rounded-full">{highScores[5] ? `Top: ${highScores[5]}%` : "Facile"}</span></button>
          <button onClick={() => startGame(10)} className="py-3.5 bg-[#4BE38A] text-black font-black text-base rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] flex justify-between px-5"><span>10 Round Casuali</span><span className="text-xs bg-black/10 px-2 py-0.5 rounded-full">{highScores[10] ? `Top: ${highScores[10]}%` : "Medio"}</span></button>
          <button onClick={() => startGame(20)} className="py-3.5 bg-[#F39C12] text-black font-black text-base rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] flex justify-between px-5"><span>20 Round Casuali</span><span className="text-xs bg-black/10 px-2 py-0.5 rounded-full">{highScores[20] ? `Top: ${highScores[20]}%` : "Esperto"}</span></button>
        </div>
      </div>
    );
  }

  if (gameState === "summary") {
    const averageScore = roundScores.length > 0 ? (roundScores.reduce((a, b) => a + b.score, 0) / roundScores.length).toFixed(1) : "0.0";
    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-[#F7F5EE] p-6 rounded-3xl shadow-xl select-none border border-stone-200">
        <h2 className="text-3xl font-black text-slate-900 mb-1 text-center">Partita Finita! 🏆</h2>
        <div className="bg-white border-2 border-black rounded-2xl p-5 w-full flex flex-col items-center justify-center shadow-[0_4px_0_0_#000] mb-4 mt-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Media Finale</span>
          <div className="text-5xl font-black text-slate-900">{averageScore}%</div>
        </div>
        <button onClick={handleShare} className={`w-full py-3.5 mb-3 text-black font-black text-base rounded-2xl border-2 border-black shadow-[0_3px_0_0_#000] flex justify-center gap-2 ${copied ? "bg-[#4BE38A]" : "bg-[#FFD166]"}`}>{copied ? "Risultato Copiato! 📋" : "Condividi Risultato 📤"}</button>
        <button onClick={() => setGameState("home")} className="w-full py-3 bg-[#549EFA] text-black font-black text-sm rounded-2xl border-2 border-black shadow-[0_3px_0_0_#000]">Torna alla Home 🏠</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-[#F7F5EE] p-6 rounded-3xl shadow-xl select-none font-sans border border-stone-200">
      <div className="flex justify-between items-center w-full mb-2">
        <span onClick={() => setGameState("home")} className="text-xl font-bold cursor-pointer text-slate-700">🏠</span>
        <div className="bg-stone-200/80 px-3.5 py-1 rounded-full text-xs font-black text-slate-700">{currentIdx + 1} / {rounds.length}</div>
      </div>
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-2xl font-black text-slate-900">{currentLevel.title}</h2>
        <div className="mt-1 bg-stone-900 text-white text-[11px] font-bold px-3 py-1 rounded-full">🎯 Indovina: <span className="text-amber-300">{currentTarget.elementName}</span></div>
      </div>
      <div className="w-full flex justify-center mb-5">
        <div ref={flagContainerRef} className={`flag-box-${componentId} w-full h-52 rounded-xl shadow-md overflow-hidden border-2 border-black/10 flex items-center justify-center bg-white p-2`} style={{ "--dynamic-color": currentColor } as React.CSSProperties}>
          <style>{`.flag-box-${componentId} .flag-wrapper svg { width: 100% !important; height: 100% !important; }`}</style>
          <div className="flag-wrapper w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svgContent }} />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full mb-6">
        <div className="relative flex items-center h-8 rounded-full border-2 border-black overflow-hidden shadow-inner px-1" style={{ background: "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)" }}>
          <input type="range" min="0" max="360" disabled={!!result} value={hue} onChange={(e) => setHue(Number(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10 touch-none" />
          <div className="w-6 h-6 bg-white border-2 border-black rounded-full shadow pointer-events-none absolute" style={{ left: `calc(4px + ${(hue / 360)} * (100% - 32px))` }} />
        </div>
        <div className="relative flex items-center h-8 rounded-full border-2 border-black overflow-hidden shadow-inner px-1" style={{ background: `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))` }}>
          <input type="range" min="0" max="100" disabled={!!result} value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10 touch-none" />
          <div className="w-6 h-6 bg-white border-2 border-black rounded-full shadow pointer-events-none absolute" style={{ left: `calc(4px + ${(saturation / 100)} * (100% - 32px))` }} />
        </div>
        <div className="relative flex items-center h-8 rounded-full border-2 border-black overflow-hidden shadow-inner px-1" style={{ background: `linear-gradient(to right, black, hsl(${hue}, ${saturation}%, 50%), white)` }}>
          <input type="range" min="0" max="100" disabled={!!result} value={lightness} onChange={(e) => setLightness(Number(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10 touch-none" />
          <div className="w-6 h-6 bg-white border-2 border-black rounded-full shadow pointer-events-none absolute" style={{ left: `calc(4px + ${(lightness / 100)} * (100% - 32px))` }} />
        </div>
      </div>
      {!result ? (
        <button onClick={handleVerify} className="w-full py-4 bg-[#549EFA] text-black font-black text-lg rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000]">Blocca colore ✓</button>
      ) : (
        <div className="w-full flex flex-col gap-3">
          <div className="bg-white border-2 border-black rounded-2xl p-4 flex flex-col gap-3 shadow-[0_3px_0_0_#000]">
            <div className="text-xs font-bold text-slate-400 uppercase">Precisione Round</div>
            <div className="text-2xl font-black text-slate-900">{result.score}%</div>
            <div className="text-xs font-bold text-slate-400 uppercase mt-2">Bandiera Ufficiale:</div>
            <div className="w-full h-28 rounded-lg border border-black/20 overflow-hidden bg-white p-2" dangerouslySetInnerHTML={{ __html: originalSvgContent }} />
            {currentFunFact && <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-slate-900">💡 {currentFunFact}</div>}
          </div>
          <button onClick={nextLevel} className="w-full py-4 bg-[#4BE38A] text-black font-black text-lg rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000]">{currentIdx < rounds.length - 1 ? "Prossimo Livello →" : "Risultato Finale 🏁"}</button>
        </div>
      )}
    </div>
  );
}
