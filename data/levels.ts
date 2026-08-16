// Esempio da aggiungere
export const getRandomLevels = (count: number) => {
  const shuffled = [...levels].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export interface Level {
    id: string;
    title: string;
    category: string;
    svgFile: string;
    targetId: string;
    targetHsl: { h: number; s: number; l: number };
  }
  
  export const levels: Level[] = [
    {
      id: "friuli",
      title: "Friuli-Venezia Giulia",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Friuli.svg",
      targetId: "target-color",
      targetHsl: { h: 207, s: 78, l: 45 }, // Blu sfondo friulano
    },
    {
      id: "lombardia",
      title: "Lombardia",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Lombardy.svg",
      targetId: "target-color",
      targetHsl: { h: 144, s: 100, l: 31 }, // Verde ufficiale sfondo Lombardia (#00A040)
    },
    {
      id: "sicilia",
      title: "Sicilia",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Sicily.svg",
      targetId: "target-color",
      targetHsl: { h: 57, s: 100, l: 50 }, // Giallo ufficiale Sicilia (#FFF100)
    },
    {
      id: "veneto",
      title: "Veneto",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Veneto.svg",
      targetId: "target-color",
      targetHsl: { h: 28, s: 80, l: 52 }, // Arancione bandiera Veneto
    },
    {
      id: "piemonte",
      title: "Piemonte",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Piedmont.svg",
      targetId: "target-color",
      targetHsl: { h: 352, s: 100, l: 42 }, // Rosso campo Piemonte (#D5001D)
    },
    {
      id: "toscana",
      title: "Toscana",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Tuscany.svg",
      targetId: "target-color",
      targetHsl: { h: 356, s: 95, l: 45 }, // Rosso ufficiale bande Toscana (#E30613)
    },
    {
      id: "campania",
      title: "Campania",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Campania.svg",
      targetId: "target-color",
      targetHsl: { h: 229, s: 68, l: 33 }, // Blu ufficiale sfondo Campania (#1B2F8D)
    },
    {
      id: "sardegna",
      title: "Sardegna",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Sardinia.svg",
      targetId: "target-color",
      targetHsl: { h: 0, s: 100, l: 42 }, // Rosso ufficiale croce Sardegna (#D80000)
    },
    {
      id: "puglia",
      title: "Puglia",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Apulia.svg",
      targetId: "target-color",
      targetHsl: { h: 3, s: 95, l: 55 }, // Rosso scudo centrale (#F82920)
    },
    {
      id: "liguria",
      title: "Liguria",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Liguria.svg",
      targetId: "target-color",
      targetHsl: { h: 195, s: 100, l: 40 }, // Azzurro banda destra Liguria (#009CCE)
    },
    {
      id: "lazio",
      title: "Lazio",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Lazio.svg",
      targetId: "target-color",
      targetHsl: { h: 206, s: 100, l: 41 }, // Azzurro ufficiale sfondo Lazio (#0075D0)
    },
    {
      id: "calabria",
      title: "Calabria",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Calabria.svg",
      targetId: "target-color",
      targetHsl: { h: 48, s: 93, l: 45 }, // Giallo/oro stemma Calabria (#DEB308)
    },
    {
      id: "abruzzo",
      title: "Abruzzo",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Abruzzo.svg",
      targetId: "target-color",
      targetHsl: { h: 149, s: 100, l: 25 }, // Verde esatto dello stemma abruzzese (#00803D)
    },
    {
      id: "marche",
      title: "Marche",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Marche.svg",
      targetId: "target-color",
      targetHsl: { h: 152, s: 95, l: 22 }, // Verde scuro ufficiale della bandiera delle Marche (#036f3a)
    },
    {
      id: "umbria",
      title: "Umbria",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Umbria.svg",
      targetId: "target-color",
      targetHsl: { h: 143, s: 100, l: 29 }, // Verde ufficiale sfondo Umbria (#00943A)
    },
    {
      id: "basilicata",
      title: "Basilicata",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Basilicata.svg",
      targetId: "target-color",
      targetHsl: { h: 0, s: 0, l: 77 }, // Grigio argento stemma (#C5C5C5)
    },
    {
      id: "molise",
      title: "Molise",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Molise.svg",
      targetId: "target-color",
      targetHsl: { h: 201, s: 100, l: 40 }, // Azzurro ufficiale sfondo Molise (#0085CE)
    },
    {
      id: "trentino",
      title: "Trentino-Alto Adige",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Trentino-South_Tyrol.svg",
      targetId: "target-color",
      targetHsl: { h: 210, s: 85, l: 45 }, // Banda azzurra
    },
    {
      id: "valledaosta",
      title: "Valle d'Aosta",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Valle_dAosta.svg",
      targetId: "target-color",
      targetHsl: { h: 355, s: 80, l: 45 }, // Banda rossa
    },
    {
      id: "emiliaromagna",
      title: "Emilia-Romagna",
      category: "Regioni",
      svgFile: "/flags/Flag_of_Emilia_Romagna.svg",
      targetId: "target-color",
      targetHsl: { h: 149, s: 100, l: 30 }, // Verde ufficiale (#009A49)
    }
  ];