export interface TargetElement {
    elementName: string;
    targetHsl: { h: number; s: number; l: number };
    colors: string[];
  }
  
  export interface Level {
    id: string;
    title: string;
    svgFile: string;
    targets: TargetElement[];
    funFacts: [string, string, string];
  }
  
  // Mega-liste colori standard per fallback e copertura totale
  const REDS = ['#c8102e', '#cd212a', '#d40000', '#e40544', '#ff0000', '#ce2029', '#e30a17', '#da291c', '#ed1c24', '#f82920', '#a2222d', '#981b2a', '#9e1b22', '#cf2a27'];
  const BLUES = ['#002b7f', '#002776', '#0a4fa2', '#003399', '#0055a5', '#0077be', '#0072ce', '#0099ff', '#009ee0', '#00a0e2', '#2c4878', '#1b3f73', '#19284c', '#132141', '#1b2a49', '#19274a', '#001a4b'];
  const GREENS = ['#00803d', '#008c45', '#00a05e', '#009246', '#138808', '#2e5a1c', '#1b4d1b', '#005500', '#336633', '#009a49', '#009c31', '#00a040', '#036f3a', '#00943a'];
  const GOLDS = ['#ffd100', '#ffcc00', '#fcd116', '#f2ce26', '#deb308', '#ffdf00', '#fddc2f', '#fff100'];
  const BLACKS = ['#000000', '#000', '#1a1a1a', '#222222', '#151515', '#101820', '#1c1e1c', '#312c28', '#2a2723', '#231f20', 'black'];
  const DARK_REDS = ['#8b0000', '#a60000', '#800000', '#8b1c1c', '#990000', '#c84a46'];
  const WHITES = ['#ffffff', '#fff', '#FFFFFF', '#FFF', 'white', 'rgb(255, 255, 255)', 'rgb(255,255,255)'];
  
  export const serieaLevels: Level[] = [
    {
      id: "atalanta",
      title: "Atalanta",
      svgFile: "atalanta.svg",
      targets: [
        { elementName: "Sfondo Interno", targetHsl: { h: 207, s: 86, l: 37 }, colors: ['#0d68b1'] },
        { elementName: "Capelli e Bordo Esterno", targetHsl: { h: 0, s: 0, l: 0 }, colors: BLACKS },
        { elementName: "Profilo e Dettagli", targetHsl: { h: 0, s: 0, l: 100 }, colors: WHITES },
      ],
      funFacts: [
        "Il profilo femminile nello stemma è quello di Atalanta, eroina della mitologia greca famosa per le sue abilità nella caccia.",
        "La squadra è conosciuta come 'La Dea' proprio in onore alla figura mitologica del suo logo.",
        "I colori sociali, il nero e l'azzurro, furono adottati nel 1920 in seguito alla fusione con la Bergamasca."
      ],
    },
    {
      id: "bologna",
      title: "Bologna",
      svgFile: "bologna.svg",
      targets: [
        { elementName: "Strisce e Croce", targetHsl: { h: 351, s: 85, l: 42 }, colors: ['#9f1f33', ...REDS] },
        { elementName: "Strisce", targetHsl: { h: 220, s: 100, l: 25 }, colors: ['#1b2838', ...BLUES] },
        { elementName: "Sfondo Scritte", targetHsl: { h: 0, s: 0, l: 100 }, colors: WHITES },
      ],
      funFacts: [
        "Lo stemma presenta la scritta 'BFC' intrecciata, che sta per Bologna Football Club.",
        "I colori rosso e blu richiamano lo stemma cittadino e vennero scelti fin dalla fondazione nel 1909.",
        "Il Bologna ha vinto 7 scudetti, di cui uno storico nel 1964 dopo un famoso spareggio contro l'Inter."
      ],
    },
    {
      id: "cagliari",
      title: "Cagliari",
      svgFile: "cagliari.svg",
      targets: [
        { elementName: "Metà Sinistra", targetHsl: { h: 353, s: 73, l: 39 }, colors: ['#ac1b2c'] },
        { elementName: "Metà Destra", targetHsl: { h: 213, s: 68, l: 15 }, colors: ['#0c2340'] },
        { elementName: "Sfondo Scudo Centrale", targetHsl: { h: 0, s: 0, l: 100 }, colors: WHITES },
      ],
      funFacts: [
        "Nello stemma sono presenti i Quattro Mori, simbolo storico della bandiera della Sardegna.",
        "Il Cagliari è stata la prima squadra del Sud Italia a vincere lo scudetto, nella stagione 1969-1970.",
        "Il rosso e il blu sono i colori ufficiali della città di Cagliari."
      ],
    },
    {
      id: "como",
      title: "Como",
      svgFile: "como.svg",
      targets: [
        { elementName: "Sfondo", targetHsl: { h: 207, s: 74, l: 24 }, colors: ['#10416a'] },
        { elementName: "Dettagli e Croce", targetHsl: { h: 0, s: 0, l: 100 }, colors: WHITES },
      ],
      funFacts: [
        "Il colore sociale del Como è l'azzurro, che richiama le acque del celebre lago su cui si affaccia la città.",
        "Il club ha una forte connessione con il proprio territorio e recentemente è stato rilanciato da investitori internazionali.",
        "Nello stemma è spesso rappresentata la croce, simbolo araldico della città lombarda."
      ],
    },
    {
      id: "fiorentina",
      title: "Fiorentina",
      svgFile: "fiorentina.svg",
      targets: [
        { elementName: "Sfondo", targetHsl: { h: 266, s: 45, l: 38 }, colors: ['#5a348b', '#61358b'] },
        { elementName: "Giglio", targetHsl: { h: 3, s: 80, l: 50 }, colors: ['#e2241c', '#dd3224'] },
        { elementName: "Sfondo Superiore", targetHsl: { h: 0, s: 0, l: 100 }, colors: WHITES },
      ],
      funFacts: [
        "Il giglio bottonato rosso è il simbolo di Firenze e non è mai cambiato dal primo stemma del club.",
        "Il colore viola nacque nel 1929; la leggenda narra che derivi da un errato lavaggio delle divise originali biancorosse.",
        "La Fiorentina è stata la prima squadra italiana a raggiungere una finale di Coppa dei Campioni nel 1957."
      ],
    },
    {
      id: "frosinone",
      title: "Frosinone",
      svgFile: "frosinone.svg",
      targets: [
        { elementName: "Bordo Esterno", targetHsl: { h: 51, s: 100, l: 50 }, colors: ['#ffdb00'] },
        { elementName: "Sfondo Interno", targetHsl: { h: 213, s: 100, l: 29 }, colors: ['#004292', '#006fba'] },
      ],
      funFacts: [
        "I colori sociali, il giallo e l'azzurro, riprendono esattamente lo stemma del comune di Frosinone.",
        "Lo stemma include un leone rampante, simbolo del capoluogo ciociaro.",
        "La squadra è soprannominata 'I Canarini' per via del colore predominante della loro maglia."
      ],
    },
    {
      id: "genoa",
      title: "Genoa",
      svgFile: "genoa.svg",
      targets: [
        { elementName: "Metà Sinistra", targetHsl: { h: 356, s: 75, l: 39 }, colors: ['#ae1919', '#ab131c'] },
        { elementName: "Metà Destra", targetHsl: { h: 203, s: 100, l: 12 }, colors: ['#00263e', '#002942'] },
        { elementName: "Grifone e Bordo", targetHsl: { h: 48, s: 100, l: 52 }, colors: ['#ffd508', '#ffd600'] },
        { elementName: "Sfondo Superiore", targetHsl: { h: 0, s: 0, l: 100 }, colors: WHITES },
      ],
      funFacts: [
        "Fondato nel 1893, il Genoa è il club calcistico in attività più antico d'Italia.",
        "Il Grifone dorato nello stemma è il simbolo storico e mitologico della città di Genova.",
        "Le prime maglie del Genoa erano bianche, poi a strisce biancoblù, prima di adottare l'attuale rossoblù nel 1901."
      ],
    },
    {
      id: "inter",
      title: "Inter",
      svgFile: "inter.svg",
      targets: [
        { elementName: "Sfondo Interno", targetHsl: { h: 226, s: 100, l: 31 }, colors: ['#00239c'] },
        { elementName: "Sfondo", targetHsl: { h: 0, s: 0, l: 0 }, colors: BLACKS },
        { elementName: "Lettere e Bordo", targetHsl: { h: 0, s: 0, l: 100 }, colors: WHITES },
      ],
      funFacts: [
        "Lo stemma fu disegnato nel 1908 dall'illustratore Giorgio Muggiani, uno dei fondatori del club.",
        "Il nome 'Internazionale' deriva dalla volontà di accettare giocatori stranieri, a differenza di altre squadre dell'epoca.",
        "Le lettere FCIM intrecciate al centro stanno per Football Club Internazionale Milano."
      ],
    },
    {
      id: "juventus",
      title: "Juventus",
      svgFile: "juventus.svg",
      targets: [
        { elementName: "Logo J e Scritte", targetHsl: { h: 0, s: 0, l: 0 }, colors: BLACKS },
      ],
      funFacts: [
        "La Juventus adottò i colori bianco e nero nel 1903 ispirandosi alle divise della squadra inglese del Notts County.",
        "La parola 'Juventus' in latino significa 'gioventù', in quanto fondata da un gruppo di liceali torinesi.",
        "Il logo attuale con la doppia J stilizzata è stato introdotto nel 2017 rivoluzionando il design calcistico moderno."
      ],
    },
    {
      id: "lazio",
      title: "Lazio",
      svgFile: "lazio.svg",
      targets: [
        { elementName: "Bordo Esterno e Scritta", targetHsl: { h: 209, s: 100, l: 22 }, colors: ['#003a70'] },
        { elementName: "Sfondo", targetHsl: { h: 193, s: 75, l: 69 }, colors: ['#74d1ea'] },
        { elementName: "Aquila", targetHsl: { h: 39, s: 68, l: 51 }, colors: ['#d69a2d'] },
        { elementName: "Sfondo Scudo", targetHsl: { h: 0, s: 0, l: 100 }, colors: WHITES },
      ],
      funFacts: [
        "I colori bianco e celeste furono scelti nel 1900 in onore della Grecia, patria dei Giochi Olimpici.",
        "L'aquila imperiale nello stemma è il simbolo di Zeus e delle storiche legioni dell'Impero Romano.",
        "La polisportiva S.S. Lazio è la più grande d'Europa, comprendendo decine di discipline sportive oltre al calcio."
      ],
    },
    {
      id: "lecce",
      title: "Lecce",
      svgFile: "lecce.svg",
      targets: [
        { elementName: "Dettagli", targetHsl: { h: 42, s: 53, l: 65 }, colors: ['#d5b978', '#ffcc00', '#ffd100'] },
        { elementName: "Strisce Esterne", targetHsl: { h: 351, s: 85, l: 42 }, colors: REDS },
      ],
      funFacts: [
        "Lo stemma include un lupo sotto un albero di leccio, simbolo araldico della città di Lecce.",
        "I tifosi sono affettuosamente soprannominati 'Salentini' dal nome dell'area geografica in cui si trova la città.",
        "Lo stadio del Lecce, Via del Mare, è uno degli stadi più capienti e caldi del Sud Italia."
      ],
    },
    {
      id: "milan",
      title: "Milan",
      svgFile: "milan.svg",
      targets: [
        { elementName: "Strisce e Croce", targetHsl: { h: 349, s: 100, l: 45 }, colors: ['#e4002b'] },
        { elementName: "Strisce e Scritte", targetHsl: { h: 0, s: 0, l: 0 }, colors: ['#101820', ...BLACKS] },
        { elementName: "Sfondo della Croce", targetHsl: { h: 0, s: 0, l: 100 }, colors: WHITES },
      ],
      funFacts: [
        "Herbert Kilpin, fondatore del club, scelse i colori: rosso come il fuoco dei diavoli e nero come la paura degli avversari.",
        "La metà sinistra dello stemma ovale contiene le strisce rossonere, la destra la croce di San Giorgio, simbolo di Milano.",
        "Il Milan è tra i club più titolati al mondo a livello internazionale, avendo vinto 7 Coppe dei Campioni/Champions League."
      ],
    },
    {
      id: "monza",
      title: "Monza",
      svgFile: "monza.svg",
      targets: [
        { elementName: "Sfondo", targetHsl: { h: 349, s: 100, l: 45 }, colors: ['#e4002b', '#ed1639'] },
        { elementName: "Corona e Bordo", targetHsl: { h: 0, s: 0, l: 100 }, colors: WHITES },
      ],
      funFacts: [
        "Il simbolo principale dello stemma è la Corona Ferrea incrociata dalla spada viscontea, simboli della città di Monza.",
        "La squadra è soprannominata 'I Brianzoli' e i colori ufficiali storici sono il bianco e il rosso.",
        "Ha raggiunto la sua prima storica promozione in Serie A nella stagione 2021-2022."
      ],
    },
    {
      id: "napoli",
      title: "Napoli",
      svgFile: "napoli.svg",
      targets: [
        { elementName: "Sfondo", targetHsl: { h: 195, s: 99, l: 44 }, colors: ['#01a7e1'] },
        { elementName: "Lettera N Centrale", targetHsl: { h: 0, s: 0, l: 100 }, colors: WHITES },
      ],
      funFacts: [
        "L'azzurro della maglia rappresenta le acque del Golfo di Napoli ed è il colore della famiglia Borbone.",
        "La N inscritta nel cerchio è un logo minimalista diventato celebre in tutto il mondo negli anni '80 con Maradona.",
        "Inizialmente il colore sociale era il celeste, che venne scurito nell'azzurro forte attuale col passare dei decenni."
      ],
    },
    {
      id: "parma",
      title: "Parma",
      svgFile: "parma.svg",
      targets: [
        { elementName: "Metà", targetHsl: { h: 231, s: 58, l: 34 }, colors: ['#24338a'] },
        { elementName: "Metà", targetHsl: { h: 48, s: 100, l: 50 }, colors: ['#ffcf01', '#fcd206'] },
        { elementName: "Croce", targetHsl: { h: 0, s: 0, l: 0 }, colors: BLACKS },
        { elementName: "Sfondo della Croce", targetHsl: { h: 0, s: 0, l: 100 }, colors: WHITES },
      ],
      funFacts: [
        "Lo stemma è diviso in due: la croce nera su fondo bianco (Crocioni) e i pali gialloblù dei Farnese.",
        "Negli anni '90 il Parma è stata una delle cosiddette 'Sette Sorelle' del calcio italiano, dominando in Europa.",
        "I colori originali erano il bianco con la croce nera sul petto, mentre il giallo e blu vennero aggiunti in un secondo momento."
      ],
    },
    {
      id: "roma",
      title: "Roma",
      svgFile: "roma.svg",
      targets: [
        { elementName: "Parte bassa e Lupa", targetHsl: { h: 346, s: 88, l: 32 }, colors: ['#980a2b', '#9e102a'] },
        { elementName: "Sfondo", targetHsl: { h: 44, s: 100, l: 49 }, colors: ['#ffd500', '#fbb900'] },
      ],
      funFacts: [
        "Lo stemma presenta la Lupa Capitolina che allatta Romolo e Remo, fondatori di Roma secondo la mitologia.",
        "I colori giallorossi riprendono esattamente quelli della città di Roma, giallo oro e rosso pompeiano.",
        "La lupa è stata ridisegnata più volte nel corso dei decenni, ma è rimasta sempre l'icona centrale del club."
      ],
    },
    {
      id: "sassuolo",
      title: "Sassuolo",
      svgFile: "sassuolo.svg",
      targets: [
        { elementName: "Strisce Interne", targetHsl: { h: 150, s: 100, l: 32 }, colors: ['#00a353'] },
        { elementName: "Strisce e Bordo Interno", targetHsl: { h: 0, s: 0, l: 0 }, colors: ['#1c1e1c', ...BLACKS] },
        { elementName: "Dettagli e Scritte", targetHsl: { h: 0, s: 0, l: 100 }, colors: WHITES },
      ],
      funFacts: [
        "Il Sassuolo condivide i colori sociali verde e nero con la città, famosa in tutto il mondo per l'industria della ceramica.",
        "Nello scudo ovale compaiono tre fiori stilizzati, anch'essi tratti dallo stemma comunale.",
        "Negli ultimi anni, partendo dalle serie minori, è arrivata a qualificarsi stabilmente in Europa League."
      ],
    },
    {
      id: "torino",
      title: "Torino",
      svgFile: "torino.svg",
      targets: [
        { elementName: "Sfondo", targetHsl: { h: 6, s: 63, l: 33 }, colors: ['#8b2a1f'] },
        { elementName: "Bordo Esterno", targetHsl: { h: 44, s: 83, l: 50 }, colors: ['#ecb215', '#ecac00'] },
        { elementName: "Toro e Testo", targetHsl: { h: 0, s: 0, l: 100 }, colors: WHITES },
      ],
      funFacts: [
        "Il toro rampante è il simbolo araldico della città di Torino, ed è al centro dell'identità del club.",
        "Il colore 'Granata' fu scelto per onorare la Brigata Savoia, che nel 1706 liberò la città dall'assedio francese.",
        "Il Grande Torino degli anni '40 è considerato una delle squadre più forti della storia del calcio mondiale."
      ],
    },
    {
      id: "udinese",
      title: "Udinese",
      svgFile: "udinese.svg",
      targets: [
        { elementName: "Scaglione", targetHsl: { h: 0, s: 0, l: 0 }, colors: ['#312c28', '#2a2723', ...BLACKS] },
        { elementName: "Corona Alloro", targetHsl: { h: 40, s: 37, l: 46 }, colors: ['#a0834a', '#a28349'] },
      ],
      funFacts: [
        "Lo stemma riprende il simbolo della città di Udine: uno scudo con un 'capriolo' (la V rovesciata) nero in campo bianco.",
        "I rami di alloro che circondano lo scudo simboleggiano vittoria e gloria sportiva.",
        "L'Udinese è il secondo club più antico d'Italia, essendo stata fondata come società di ginnastica e scherma nel 1896."
      ],
    },
    {
      id: "venezia",
      title: "Venezia",
      svgFile: "venezia.svg",
      targets: [
        { elementName: "Leone e Scritte", targetHsl: { h: 44, s: 27, l: 49 }, colors: ['#9e8c5c', '#917b4c'] },
        { elementName: "Fascia Destra", targetHsl: { h: 136, s: 40, l: 29 }, colors: ['#2c673c'] },
        { elementName: "Fascia Sinistra", targetHsl: { h: 22, s: 84, l: 56 }, colors: ['#ee732e', '#ea7125'] },
      ],
      funFacts: [
        "Lo stemma raffigura il Leone Alato di San Marco, celebre simbolo della Repubblica di Venezia.",
        "I colori sociali, arancione, nero e verde, sono unici nel calcio mondiale e derivano dalla fusione di due antichi club locali.",
        "Le maglie del Venezia sono state più volte premiate dalla stampa internazionale come le divise calcistiche più belle al mondo."
      ],
    }
  ];