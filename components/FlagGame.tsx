"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { levels, getRandomLevels } from "../data/levels";

export default function FlagGame() {
  const [gameState, setGameState] = useState<"home" | "game" | "summary">("home");
  const [selectedLevels, setSelectedLevels] = useState<typeof levels>([]);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const level = selectedLevels[currentIdx] || levels[0];

  const [svgContent, setSvgContent] = useState<string>("");
  const [originalSvgContent, setOriginalSvgContent] = useState<string>("");
  
  const [hue, setHue] = useState(180);
  const [saturation, setSaturation] = useState(50);
  const [lightness, setLightness] = useState(50);

  // Ref per memorizzare i valori correnti senza ritardi
  const colorRef = useRef({ h: 180, s: 50, l: 50 });
  const flagContainerRef = useRef<HTMLDivElement>(null);
  const satSliderRef = useRef<HTMLDivElement>(null);
  const lightSliderRef = useRef<HTMLDivElement>(null);

  const [result, setResult] = useState<{ score: string } | null>(null);
  const [roundScores, setRoundScores] = useState<number[]>([]);

  // Aggiornamento DOM ad altissime prestazioni per mobile
  const updateDynamicStyles = useCallback((h: number, s: number, l: number) => {
    requestAnimationFrame(() => {
      const colorString = `hsl(${h}, ${s}%, ${l}%)`;
      if (flagContainerRef.current) {
        flagContainerRef.current.style.setProperty("--dynamic-color", colorString);
      }
      if (satSliderRef.current) {
        satSliderRef.current.style.background = `linear-gradient(to right, hsl(${h}, 0%, ${l}%), hsl(${h}, 100%, ${l}%))`;
      }
      if (lightSliderRef.current) {
        lightSliderRef.current.style.background = `linear-gradient(to right, black, hsl(${h}, ${s}%, 50%), white)`;
      }
    });
  }, []);

  const setRandomColors = () => {
    const h = Math.floor(Math.random() * 361);
    const s = Math.floor(Math.random() * 71) + 30;
    const l = Math.floor(Math.random() * 51) + 30;
    colorRef.current = { h, s, l };
    setHue(h);
    setSaturation(s);
    setLightness(l);
    updateDynamicStyles(h, s, l);
  };

  const startGame = (count: number) => {
    const chosen = count >= levels.length ? levels : getRandomLevels(count);
    setSelectedLevels(chosen);
    setCurrentIdx(0);
    setRoundScores([]);
    setGameState("game");
    setRandomColors();
    setResult(null);
  };

  useEffect(() => {
    if (gameState !== "game" || !level) return;

    fetch(level.svgFile)
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
              if (w && h) {
                svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);
              }
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
        } catch (e) {
          console.error("Errore parsing SVG:", e);
          setSvgContent(rawSvg);
        }
      })
      .catch((err) => console.error("Errore caricamento SVG:", err));
  }, [gameState, level]);

  useEffect(() => {
    if (gameState !== "game" || !level) return;

    const fileName = level.svgFile.split("/").pop();
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
            if (w && h) {
              svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);
            }
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
  }, [gameState, level]);

  useEffect(() => {
    if (gameState === "game") {
      updateDynamicStyles(hue, saturation, lightness);
    }
  }, [gameState, svgContent, updateDynamicStyles, hue, saturation, lightness]);

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
    const [r2, g2, b2] = hslToRgb(level.targetHsl.h, level.targetHsl.s, level.targetHsl.l);

    const distance = Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
    const maxDistance = 441.67;

    const errorRatio = distance / maxDistance;
    const penalty = Math.pow(errorRatio, 0.85) * 100;
    const scoreVal = Math.max(0, Math.min(100, 100 - penalty));

    const numericScore = parseFloat(scoreVal.toFixed(1));
    setResult({ score: numericScore.toFixed(1) });
    setRoundScores((prev) => [...prev, numericScore]);
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

  if (gameState === "home") {
    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-[#F7F5EE] p-6 rounded-3xl shadow-xl select-none font-sans border border-stone-200">
        <h1 className="text-3xl font-black text-slate-900 mb-2 text-center">Color Match: Regioni</h1>
        <p className="text-sm text-slate-600 mb-8 text-center">Seleziona la modalità di gioco:</p>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => startGame(5)}
            className="py-4 bg-[#549EFA] text-black font-black text-lg rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
          >
            5 Regioni 🇮🇹
          </button>
          <button
            onClick={() => startGame(10)}
            className="py-4 bg-[#4BE38A] text-black font-black text-lg rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
          >
            10 Regioni 🇮🇹
          </button>
          <button
            onClick={() => startGame(20)}
            className="py-4 bg-[#F39C12] text-black font-black text-lg rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
          >
            Tutte / 20 Regioni 🇮🇹
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "summary") {
    const averageScore =
      roundScores.length > 0
        ? (roundScores.reduce((a, b) => a + b, 0) / roundScores.length).toFixed(1)
        : "0.0";

    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-[#F7F5EE] p-6 rounded-3xl shadow-xl select-none font-sans border border-stone-200">
        <h2 className="text-3xl font-black text-slate-900 mb-1 text-center">Partita Finita! 🏆</h2>
        <p className="text-sm text-slate-600 mb-6 text-center">Ecco il tuo punteggio medio:</p>

        <div className="bg-white border-2 border-black rounded-2xl p-6 w-full flex flex-col items-center justify-center shadow-[0_4px_0_0_#000] mb-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Media Totale</span>
          <div className="text-5xl font-black text-slate-900">{averageScore}%</div>
        </div>

        <button
          onClick={() => setGameState("home")}
          className="w-full py-4 bg-[#549EFA] text-black font-black text-lg rounded-2xl border-2 border-black shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
        >
          Torna alla Home 🏠
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-[#F7F5EE] p-6 rounded-3xl shadow-xl select-none font-sans border border-stone-200 touch-pan-y">
      
      {/* HEADER */}
      <div className="flex justify-between items-center w-full mb-3">
        <span 
          onClick={() => setGameState("home")} 
          className="text-xl font-bold cursor-pointer text-slate-700"
          title="Torna alla Home"
        >
          🏠
        </span>
        <div className="bg-stone-200/80 px-4 py-1 rounded-full text-sm font-black text-slate-700 tracking-wider">
          {currentIdx + 1} / {selectedLevels.length}
        </div>
        <div className="flex gap-3 text-lg text-slate-700">
          <span className="cursor-pointer">📊</span>
          <span className="cursor-pointer">❓</span>
        </div>
      </div>

      {/* TITOLO REGIONE */}
      <h2 className="text-2xl font-black text-slate-900 mb-5">{level.title}</h2>

      {/* CONTAINER BANDIERA INTERATTIVA */}
      <div className="w-full flex justify-center mb-6">
        <div
          ref={flagContainerRef}
          className="w-full h-52 rounded-xl shadow-md overflow-hidden border-2 border-black/10 flex items-center justify-center bg-white p-2"
        >
          <style>{`
            #${level.targetId}, .${level.targetId} {
              fill: var(--dynamic-color, #808080) !important;
              stroke: var(--dynamic-color, #808080) !important;
              fill-opacity: 1 !important;
              stroke-opacity: 1 !important;
            }
            .flag-wrapper svg {
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

      {/* I 3 SLIDER HSL */}
      <div className="flex flex-col gap-4 w-full mb-6">
        {/* Slider 1: Hue */}
        <div 
          className="relative flex items-center h-8 rounded-full border-2 border-black overflow-hidden shadow-inner"
          style={{
            background: "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)"
          }}
        >
          <input
            type="range"
            min="0"
            max="360"
            disabled={!!result}
            value={hue}
            onInput={(e) => {
              const val = Number((e.target as HTMLInputElement).value);
              setHue(val);
              colorRef.current.h = val;
              updateDynamicStyles(val, colorRef.current.s, colorRef.current.l);
            }}
            className="absolute w-full opacity-0 cursor-pointer h-full z-10 touch-none"
          />
          <div
            className="w-7 h-7 bg-white border-2 border-black rounded-full shadow pointer-events-none absolute"
            style={{ left: `calc(${(hue / 360) * 100}% - 14px)` }}
          />
        </div>

        {/* Slider 2: Saturation */}
        <div
          ref={satSliderRef}
          className="relative flex items-center h-8 rounded-full border-2 border-black overflow-hidden shadow-inner"
        >
          <input
            type="range"
            min="0"
            max="100"
            disabled={!!result}
            value={saturation}
            onInput={(e) => {
              const val = Number((e.target as HTMLInputElement).value);
              setSaturation(val);
              colorRef.current.s = val;
              updateDynamicStyles(colorRef.current.h, val, colorRef.current.l);
            }}
            className="absolute w-full opacity-0 cursor-pointer h-full z-10 touch-none"
          />
          <div
            className="w-7 h-7 bg-white border-2 border-black rounded-full shadow pointer-events-none absolute"
            style={{ left: `calc(${saturation}% - 14px)` }}
          />
        </div>

        {/* Slider 3: Lightness */}
        <div
          ref={lightSliderRef}
          className="relative flex items-center h-8 rounded-full border-2 border-black overflow-hidden shadow-inner"
        >
          <input
            type="range"
            min="0"
            max="100"
            disabled={!!result}
            value={lightness}
            onInput={(e) => {
              const val = Number((e.target as HTMLInputElement).value);
              setLightness(val);
              colorRef.current.l = val;
              updateDynamicStyles(colorRef.current.h, colorRef.current.s, val);
            }}
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