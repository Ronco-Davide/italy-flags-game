"use client";

import React, { useState, useEffect, useRef, useId, useMemo } from "react";
import confetti from "canvas-confetti";
import { levels, Level, TargetElement } from "../data/levels";
import { serieaLevels } from "../data/seriea";

interface RoundConfig {
  level: Level;
  target: TargetElement;
}

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

function pickRandomRounds(array: Level[], count: number): RoundConfig[] {
  const shuffledLevels = [...array];
  for (let i = shuffledLevels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledLevels[i], shuffledLevels[j]] = [shuffledLevels[j], shuffledLevels[i]];
  }
  return shuffledLevels.slice(0, Math.min(count, shuffledLevels.length)).map((lvl) => {
    const targetIdx = Math.floor(Math.random() * lvl.targets.length);
    return { level: lvl, target: lvl.targets[targetIdx] };
  });
}

export default function FlagGame() {
  const componentId = useId().replace(/:/g, "");
  const [gameState, setGameState] = useState<"home" | "game" | "summary">("home");
  const [activeCategory, setActiveCategory] = useState<"regioni" | "seriea">("regioni");
  
  const currentDataset = activeCategory === "regioni" ? levels : serieaLevels;
  const currentFolder = activeCategory === "regioni" ? "/flags" : "/serie-a";

  const [rounds, setRounds] = useState<RoundConfig[]>([]);
  const [gameMode, setGameMode] = useState<"daily" | 5 | 10 | 20>(5);

  const [currentIdx, setCurrentIdx] = useState(0);
  const currentRound = rounds[currentIdx];
  const currentLevel = currentRound?.level || currentDataset[0];
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

  // === NUOVI STATI PER LA CLASSIFICA ===
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<any>(null);

  const currentFunFact = useMemo(() => {
    if (!currentLevel || !currentLevel.funFacts) return null;
    return currentLevel.funFacts[Math.floor(Math.random() * currentLevel.funFacts.length)];
  }, [currentLevel, currentIdx]);

  useEffect(() => {
    try {
      const savedHighs = localStorage.getItem(`color_match_highscores_${activeCategory}`);
      if (savedHighs) setHighScores(JSON.parse(savedHighs));
      else setHighScores({ 5: null, 10: null, 20: null });

      const savedDaily = localStorage.getItem(`color_match_daily_${activeCategory}`);
      if (savedDaily) {
        const parsed = JSON.parse(savedDaily);
        if (parsed.date === todayStr) setDailyCompleted(parsed);
        else setDailyCompleted(null);
      } else {
        setDailyCompleted(null);
      }

      // Recupera il nome inserito precedentemente, se esiste
      const savedName = localStorage.getItem("colormatch_playername");
      if (savedName) setPlayerName(savedName);

    } catch { }
  }, [todayStr, activeCategory]);

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
    setRounds(getDailyRounds(currentDataset, todayStr));
    setCurrentIdx(0);
    setRoundScores([]);
    setLeaderboardData(null); // Resetta i vecchi dati
    setGameState("game");
    setResult(null);
    setCopied(false);
    setRandomColors();
  };

  const startGame = (count: 5 | 10 | 20) => {
    setGameMode(count);
    setRounds(pickRandomRounds(currentDataset, count));
    setCurrentIdx(0);
    setRoundScores([]);
    setGameState("game");
    setResult(null);
    setCopied(false);
    setRandomColors();
  };

  useEffect(() => {
    if (gameState !== "game" || !currentLevel || !currentTarget) return;

    fetch(`${currentFolder}/${currentLevel.svgFile}`)
      .then((res) => res.text())
      .then((rawSvg) => {
        let modifiedSvg = rawSvg;
        currentTarget.colors.forEach((color) => {
          const isHex = color.startsWith('#');
          const isWord = ['white', 'black', 'red', 'blue', 'green', 'yellow'].includes(color.toLowerCase());
          let regexStr = color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          if (isHex) regexStr = regexStr + "(?![0-9a-fA-F])";
          else if (isWord) regexStr = "\\b" + regexStr + "\\b"; 
          
          const regex = new RegExp(regexStr, "gi");
          modifiedSvg = modifiedSvg.replace(regex, "var(--dynamic-color)");
        });

        const parser = new DOMParser();
        const doc = parser.parseFromString(modifiedSvg, "image/svg+xml");
        const svgEl = doc.querySelector("svg");

        if (svgEl) {
          if (!modifiedSvg.includes("var(--dynamic-color)")) {
            const shapes = svgEl.querySelectorAll("path, polygon, rect, circle");
            shapes.forEach((el) => {
              const fill = el.getAttribute("fill");
              const style = el.getAttribute("style") || "";
              const isImplicitBlack = !fill && !style.includes("fill");
              const isExplicitBlack = fill === "currentColor" || fill === "black";
              
              if ((isImplicitBlack || isExplicitBlack) && currentTarget.targetHsl.l === 0) {
                (el as HTMLElement).style.fill = "var(--dynamic-color)";
              }
            });
          }

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
  }, [gameState, currentLevel, currentTarget, currentFolder]);

  useEffect(() => {
    if (gameState !== "game" || !currentLevel) return;
    fetch(`${currentFolder}/${currentLevel.svgFile}`)
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
  }, [gameState, currentLevel, currentFolder]);

  const handleVerify = () => {
    const target = currentTarget.targetHsl;
    const tL = target.l / 100;
    const uL = lightness / 100;
    const tC = (target.s / 100) * (1 - Math.abs(2 * tL - 1));
    const uC = (saturation / 100) * (1 - Math.abs(2 * uL - 1));
    const tH = target.h * (Math.PI / 180);
    const uH = hue * (Math.PI / 180);

    const tX = tC * Math.cos(tH);
    const tY = tC * Math.sin(tH);
    const uX = uC * Math.cos(uH);
    const uY = uC * Math.sin(uH);

    const chromaDist = Math.sqrt(Math.pow(tX - uX, 2) + Math.pow(tY - uY, 2)) / 2;
    const lumDist = Math.abs(tL - uL);

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
        localStorage.setItem(`color_match_daily_${activeCategory}`, JSON.stringify({ date: todayStr, score: avg }));
      } else {
        const currentHigh = highScores[gameMode];
        if (currentHigh === null || avg > currentHigh) {
          setHighScores({ ...highScores, [gameMode]: avg });
          localStorage.setItem(`color_match_highscores_${activeCategory}`, JSON.stringify({ ...highScores, [gameMode]: avg }));
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

  // === FUNZIONE PER INVIARE IL PUNTEGGIO ALL'API ===
  const submitLeaderboardScore = async () => {
    if (!playerName.trim()) return;
    setIsSubmitting(true);
    localStorage.setItem("colormatch_playername", playerName);
    
    let uId = localStorage.getItem("colormatch_userid");
    if (!uId) {
      uId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("colormatch_userid", uId);
    }

    const averageScore = parseFloat((roundScores.reduce((a, b) => a + b.score, 0) / roundScores.length).toFixed(1));

    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: playerName,
          userId: uId,
          score: averageScore,
          category: activeCategory,
          date: todayStr
        })
      });
      const data = await res.json();
      setLeaderboardData(data); // Mostriamo i risultati!
      triggerConfetti();
    } catch (e) {
      console.error("Errore salvataggio:", e);
    } finally {
      setIsSubmitting(false);
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
    
    // Aggiunge la classifica se l'abbiamo!
    let rankText = "";
    if (leaderboardData) {
      rankText = `🏅 Posizione di oggi: ${leaderboardData.rank}°\n🔥 Battuti: ${leaderboardData.beatenPercentage}%\n\n`;
    }

    const modeName = activeCategory === "regioni" ? "Regioni 🇮🇹" : "Serie A ⚽️";
    const header = gameMode === "daily" ? `📅 Sfida del Giorno (${todayStr.split("-").reverse().join("/")})` : `Modalità Libera (${gameMode} Round)`;
    const shareText = `Color Match: ${modeName}\n${header}\nMedia: ${avg}% 🏆\n\n${rankText}${rows}\n\nGioca anche tu: ${window.location.origin}`;

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
            <p>🎯 <strong>Obiettivo:</strong> Ricrea il colore dell&apos;elemento indicato.</p>
            <div className="bg-white p-3 rounded-xl border border-black/10 flex flex-col gap-1.5 text-xs">
              <div>🎨 <strong>1° Slider:</strong> Cambia il colore base.</div>
              <div>💧 <strong>2° Slider:</strong> Regola l&apos;intensità del colore.</div>
              <div>☀️ <strong>3° Slider:</strong> Regola la luce da nero a bianco.</div>
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Record Libera ({activeCategory === "regioni" ? "Regioni" : "Serie A"})
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20].map((num) => (
                <div key={num} className="bg-white border-[3px] border-black rounded-xl p-2.5 text-center shadow-[0_2px_0_0_#000]">
                  <div className="text-[11px] font-bold text-slate-500">{num} Round</div>
                  <div className="text-base font-black text-emerald-600">{highScores[num] !== null ? `${highScores[num]}%` : "-"}</div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setShowStats(false)} className="w-full py-3 bg-[#4BE38A] text-black font-black text-base rounded-2xl border-[3px] border-black shadow-[0_3px_0_0_#000] mt-1">Chiudi</button>
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
            <span onClick={() => setShowStats(true)} className="cursor-pointer active:scale-90 transition-transform hover:scale-110">📊</span>
            <span onClick={() => setShowHelp(true)} className="cursor-pointer active:scale-90 transition-transform hover:scale-110">❓</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-1 text-center">Color Match</h1>
        <p className="text-xs text-slate-500 mb-4 text-center">Indovina i colori ufficiali!</p>

        <div className="flex bg-stone-200/80 p-1.5 rounded-xl w-full mb-5 border border-stone-300 shadow-inner">
          <button
            onClick={() => setActiveCategory("regioni")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeCategory === "regioni" ? "bg-white shadow-[0_2px_0_0_rgba(0,0,0,0.1)] text-black" : "text-stone-500 hover:text-stone-700"
            }`}
          >
            🇮🇹 Regioni
          </button>
          <button
            onClick={() => setActiveCategory("seriea")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeCategory === "seriea" ? "bg-white shadow-[0_2px_0_0_rgba(0,0,0,0.1)] text-black" : "text-stone-500 hover:text-stone-700"
            }`}
          >
            ⚽️ Serie A
          </button>
        </div>

        <div className="flex flex-col gap-3.5 w-full">
          <button 
            onClick={startDailyChallenge} 
            disabled={!!dailyCompleted}
            className={`py-4 text-black font-black text-lg rounded-2xl border-[3px] border-black flex justify-between items-center px-5 transition-all
              ${dailyCompleted 
                ? "bg-[#FFE082] opacity-70 cursor-not-allowed" 
                : "bg-[#FFCA28] shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none"
              }`}
          >
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span className="text-left leading-tight">
                <div>Sfida del Giorno</div>
                <div className="text-[10px] font-normal text-slate-800 uppercase tracking-wider">
                  {dailyCompleted ? "Torna domani!" : (activeCategory === "regioni" ? "5 Regioni per tutti" : "5 Squadre per tutti")}
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
          
          <button onClick={() => startGame(5)} className="py-3.5 bg-[#549EFA] text-black font-black text-base rounded-2xl border-[3px] border-black shadow-[0_4px_0_0_#000] flex justify-between px-5 active:translate-y-1 active:shadow-none transition-all"><span>5 Round</span><span className="text-xs bg-black/10 px-2 py-0.5 rounded-full">{highScores[5] ? `Top: ${highScores[5]}%` : "Facile"}</span></button>
          <button onClick={() => startGame(10)} className="py-3.5 bg-[#4BE38A] text-black font-black text-base rounded-2xl border-[3px] border-black shadow-[0_4px_0_0_#000] flex justify-between px-5 active:translate-y-1 active:shadow-none transition-all"><span>10 Round</span><span className="text-xs bg-black/10 px-2 py-0.5 rounded-full">{highScores[10] ? `Top: ${highScores[10]}%` : "Medio"}</span></button>
          <button onClick={() => startGame(20)} className="py-3.5 bg-[#F39C12] text-black font-black text-base rounded-2xl border-[3px] border-black shadow-[0_4px_0_0_#000] flex justify-between px-5 active:translate-y-1 active:shadow-none transition-all"><span>20 Round</span><span className="text-xs bg-black/10 px-2 py-0.5 rounded-full">{highScores[20] ? `Top: ${highScores[20]}%` : "Esperto"}</span></button>
        </div>
      </div>
    );
  }

  // === SCHERMATA FINALE CON LEADERBOARD ===
  if (gameState === "summary") {
    const averageScore = roundScores.length > 0 ? (roundScores.reduce((a, b) => a + b.score, 0) / roundScores.length).toFixed(1) : "0.0";
    
    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-[#F7F5EE] p-6 rounded-3xl shadow-xl select-none border border-stone-200 min-h-[550px]">
        <h2 className="text-3xl font-black text-slate-900 mb-1 text-center">Partita Finita! 🏆</h2>
        
        <div className="bg-white border-[3px] border-black rounded-2xl p-5 w-full flex flex-col items-center justify-center shadow-[0_4px_0_0_#000] mb-6 mt-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Media Finale</span>
          <div className="text-5xl font-black text-slate-900">{averageScore}%</div>
        </div>

        {gameMode === "daily" ? (
          !leaderboardData ? (
            // Form per inserire il nome (Solo se è la daily e non ha ancora i dati)
            <div className="w-full flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
              <p className="text-sm font-bold text-center text-slate-700 leading-tight">
                Salva il tuo punteggio nella classifica di oggi!
              </p>
              <input 
                type="text" 
                maxLength={15}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Il tuo nome..."
                className="w-full border-[3px] border-black rounded-xl p-3.5 font-black text-center text-lg outline-none focus:border-[#549EFA]"
              />
              <button 
                onClick={submitLeaderboardScore}
                disabled={!playerName.trim() || isSubmitting}
                className="w-full py-4 bg-[#4BE38A] text-black font-black text-lg rounded-2xl border-[3px] border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:active:translate-y-0 transition-all"
              >
                {isSubmitting ? "Salvataggio..." : "Invia Punteggio 🚀"}
              </button>
            </div>
          ) : (
            // Classifica Mostrata (Dopo aver salvato)
            <div className="w-full flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
              {/* Banner Posizione */}
              <div className="bg-[#549EFA]/10 border-[3px] border-[#549EFA] rounded-2xl p-4 text-center">
                <div className="text-lg font-black text-slate-900 mb-1">
                  Sei {leaderboardData.rank}° su {leaderboardData.totalPlayers}!
                </div>
                {leaderboardData.beatenPercentage > 0 ? (
                  <div className="text-sm font-bold text-[#1b3f73]">
                    Hai battuto il {leaderboardData.beatenPercentage}% dei giocatori 🔥
                  </div>
                ) : (
                  <div className="text-sm font-bold text-[#1b3f73]">Domani andrà meglio! 💪</div>
                )}
              </div>

              {/* Box Top 3 */}
              <div className="bg-white border-[3px] border-black rounded-2xl p-4 w-full flex flex-col gap-2 shadow-[0_4px_0_0_#000]">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">Top 3 di Oggi</span>
                {leaderboardData.top3.length > 0 ? leaderboardData.top3.map((player: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-stone-100 p-2.5 rounded-xl border border-stone-200">
                    <span className="flex items-center gap-2 font-black text-slate-800">
                      <span className="text-lg">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
                      <span className="truncate max-w-[120px]">{player.name}</span>
                    </span>
                    <span className="font-black text-emerald-600">{player.score}%</span>
                  </div>
                )) : (
                  <div className="text-center text-sm font-bold text-slate-400 py-2">Nessun punteggio... sei il primo!</div>
                )}
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <button onClick={handleShare} className={`w-full py-3.5 text-black font-black text-base rounded-2xl border-[3px] border-black shadow-[0_3px_0_0_#000] flex justify-center gap-2 active:translate-y-1 active:shadow-none transition-all ${copied ? "bg-[#4BE38A]" : "bg-[#FFD166]"}`}>{copied ? "Risultato Copiato! 📋" : "Condividi Risultato 📤"}</button>
                <button onClick={() => setGameState("home")} className="w-full py-3 bg-white text-slate-700 font-black text-sm rounded-2xl border-[3px] border-stone-300 active:translate-y-1 active:border-stone-400 transition-all">Torna alla Home 🏠</button>
              </div>
            </div>
          )
        ) : (
          // Modalità Libera (Niente classifica, solo share)
          <div className="w-full flex flex-col gap-3 mt-auto">
            <button onClick={handleShare} className={`w-full py-3.5 text-black font-black text-base rounded-2xl border-[3px] border-black shadow-[0_3px_0_0_#000] flex justify-center gap-2 active:translate-y-1 active:shadow-none transition-all ${copied ? "bg-[#4BE38A]" : "bg-[#FFD166]"}`}>{copied ? "Risultato Copiato! 📋" : "Condividi Risultato 📤"}</button>
            <button onClick={() => setGameState("home")} className="w-full py-3 bg-[#549EFA] text-black font-black text-sm rounded-2xl border-[3px] border-black shadow-[0_3px_0_0_#000] active:translate-y-1 active:shadow-none transition-all">Torna alla Home 🏠</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-[#F7F5EE] p-6 rounded-3xl shadow-xl select-none font-sans border border-stone-200 min-h-[600px] pb-8">
      <div className="flex justify-between items-center w-full mb-2">
        <span onClick={() => setGameState("home")} className="text-xl font-bold cursor-pointer text-slate-700">🏠</span>
        <div className="bg-stone-200/80 px-3.5 py-1 rounded-full text-xs font-black text-slate-700">{currentIdx + 1} / {rounds.length}</div>
      </div>

      {!result ? (
        <>
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-2xl font-black text-slate-900 text-center leading-tight">{currentLevel.title}</h2>
            <div className="mt-1.5 bg-stone-900 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
              🎯 Indovina: <span className="text-amber-300">{currentTarget.elementName}</span>
            </div>
          </div>

          <div className="w-full flex justify-center mb-6">
            <div ref={flagContainerRef} className={`flag-box-${componentId} w-full aspect-[4/3] rounded-xl shadow-sm overflow-hidden border-[3px] border-black/10 flex items-center justify-center bg-white p-2`} style={{ "--dynamic-color": currentColor } as React.CSSProperties}>
              <style>{`.flag-box-${componentId} .flag-wrapper svg { width: 100% !important; height: 100% !important; object-fit: contain !important; }`}</style>
              <div className="flag-wrapper w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svgContent }} />
            </div>
          </div>

          <div className="flex flex-col gap-5 w-full mb-8 mt-2">
            {/* Slider Tonalità */}
            <div className="relative flex items-center h-[42px] rounded-full border-[3px] border-black shadow-inner" style={{ background: "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)" }}>
              <input type="range" min="0" max="360" value={hue} onChange={(e) => setHue(Number(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-20 touch-none" />
              <div className="w-[46px] h-[46px] bg-white border-[3px] border-black rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.4)] pointer-events-none absolute z-10 top-1/2 -translate-y-1/2" style={{ left: `calc(${(hue / 360)} * (100% - 46px))` }} />
            </div>

            {/* Slider Saturazione */}
            <div className="relative flex items-center h-[42px] rounded-full border-[3px] border-black shadow-inner" style={{ background: `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))` }}>
              <input type="range" min="0" max="100" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-20 touch-none" />
              <div className="w-[46px] h-[46px] bg-white border-[3px] border-black rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.4)] pointer-events-none absolute z-10 top-1/2 -translate-y-1/2" style={{ left: `calc(${(saturation / 100)} * (100% - 46px))` }} />
            </div>

            {/* Slider Luminosità */}
            <div className="relative flex items-center h-[42px] rounded-full border-[3px] border-black shadow-inner" style={{ background: `linear-gradient(to right, black, hsl(${hue}, ${saturation}%, 50%), white)` }}>
              <input type="range" min="0" max="100" value={lightness} onChange={(e) => setLightness(Number(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-20 touch-none" />
              <div className="w-[46px] h-[46px] bg-white border-[3px] border-black rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.4)] pointer-events-none absolute z-10 top-1/2 -translate-y-1/2" style={{ left: `calc(${(lightness / 100)} * (100% - 46px))` }} />
            </div>
          </div>

          {/* Bottone Blocca Colore stile immagine */}
          <button onClick={handleVerify} className="w-full py-4 bg-[#FFCA28] text-black font-black text-lg rounded-2xl border-[3px] border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all tracking-wide">
            Blocca colore ✓
          </button>
        </>
      ) : (
        <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300 pt-2 flex-grow">
          <div className="text-center mb-3">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">
              {currentLevel.title}
            </h2>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{result.score}</span>
              <span className="text-xl font-bold text-slate-500">/ 100</span>
            </div>
          </div>

          <div className="w-full h-3 bg-white rounded-full border-[3px] border-black overflow-hidden mb-5">
            <div className="h-full bg-[#FFCA28]" style={{ width: `${result.score}%` }}></div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mb-5">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase">La tua scelta</span>
              <div 
                className={`flag-box-${componentId} w-full aspect-[4/3] rounded-lg border-2 border-black/10 overflow-hidden bg-white p-2 flex items-center justify-center shadow-sm`} 
                style={{ "--dynamic-color": currentColor } as React.CSSProperties}
              >
                <div className="flag-wrapper w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svgContent }} />
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase">Originale</span>
              <div className="w-full aspect-[4/3] rounded-lg border-2 border-black/10 overflow-hidden bg-white p-2 flex items-center justify-center shadow-sm">
                <style>{`.original-wrapper svg { width: 100% !important; height: 100% !important; object-fit: contain !important; display: block !important; }`}</style>
                <div className="original-wrapper w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: originalSvgContent }} />
              </div>
            </div>
          </div>

          {currentFunFact && (
            <div className="bg-amber-50 border-[3px] border-amber-200/50 rounded-xl p-3 text-xs font-medium text-slate-800 leading-snug w-full mb-6 shadow-sm">
              <span className="font-bold flex items-center gap-1 mb-1">💡 Lo sapevi?</span>
              {currentFunFact}
            </div>
          )}

          <button onClick={nextLevel} className="w-full mt-auto py-4 bg-[#FFCA28] text-black font-black text-lg rounded-2xl border-[3px] border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2">
            {currentIdx < rounds.length - 1 ? "Round successivo →" : "Risultato Finale 🏁"}
          </button>
        </div>
      )}
    </div>
  );
}