export interface Level {
  id: string;
  title: string;
  svgFile: string;
  targetId: string;
  targetHsl: { h: number; s: number; l: number };
  funFacts: [string, string, string];
}

export const levels: Level[] = [
  {
    id: "abruzzo",
    title: "Abruzzo",
    svgFile: "/flags/Flag_of_Abruzzo.svg",
    targetId: "target-color",
    targetHsl: { h: 87, s: 63, l: 44 }, // Verde fascia
    funFacts: [
      "I tre colori dello scudo rappresentano la neve del Gran Sasso (bianco), i boschi dell'Appennino (verde) e il Mar Adriatico (blu).",
      "La fascia tricolore nello scudo è inclinata in senso diagonale discendente, richiamando la conformazione orografica della regione.",
      "La bandiera è stata ufficialmente adottata nel 1999 prendendo spunto dallo stemma ideato nel 1986."
    ],
  },
  {
    id: "basilicata",
    title: "Basilicata",
    svgFile: "/flags/Flag_of_Basilicata.svg",
    targetId: "target-color",
    targetHsl: { h: 0, s: 0, l: 88 }, // Scudo argento Basilicata
    funFacts: [
      "Le quattro onde azzurre al centro dello scudo simboleggiano i fiumi principali della regione: Bradano, Basento, Agri e Sinni.",
      "Il fondo blu della bandiera richiama le due coste della regione, bagnata sia dallo Ionio che dal Tirreno.",
      "L'antico nome della regione era Lucania, termine che deriva probabilmente dalla parola latina 'lucus' (bosco sacro)."
    ],
  },
  {
    id: "calabria",
    title: "Calabria",
    svgFile: "/flags/Flag_of_Calabria.svg",
    targetId: "target-color",
    targetHsl: { h: 215, s: 75, l: 45 }, // Blu
    funFacts: [
      "Lo stemma ovale racchiude quattro simboli storici: il pino loricato, la colonna dorica, la croce potenziata e la croce greca bizantina.",
      "La colonna dorica rende omaggio alla Magna Grecia, periodo in cui la Calabria fu culla di filosofia, arte e cultura.",
      "I colori blu e azzurro della bandiera rappresentano la posizione peninsulare abbracciata da due mari."
    ],
  },
  {
    id: "campania",
    title: "Campania",
    svgFile: "/flags/Flag_of_Campania.svg",
    targetId: "target-color",
    targetHsl: { h: 215, s: 75, l: 45 }, // Blu campo
    funFacts: [
      "Lo stemma riprende la storica bandiera della Repubblica Marinara di Amalfi con la banda rossa su campo bianco.",
      "La Campania adottò questo simbolo nel 1971 in onore dell'epoca gloriosa del ducato amalfitano e delle sue tavole marittime.",
      "Il campo azzurro della bandiera evoca il celebre golfo di Napoli e le sue isole."
    ],
  },
  {
    id: "emilia-romagna",
    title: "Emilia-Romagna",
    svgFile: "/flags/Flag_of_Emilia-Romagna.svg",
    targetId: "target-color",
    targetHsl: { h: 140, s: 70, l: 35 }, // Verde trapezio/stemma
    funFacts: [
      "Il logo moderno e stilizzato rappresenta il profilo geografico della regione: la linea curva verde riassume il Po e l'Appennino.",
      "È stato ideato dal celebre designer italiano Erberto Carboni nel 1989.",
      "Il colore verde brillante richiama la fertilissima Pianura Padana e le sue storiche eccellenze agricole."
    ],
  },
  {
    id: "friuli-venezia-giulia",
    title: "Friuli-Venezia Giulia",
    svgFile: "/flags/Flag_of_Friuli-Venezia_Giulia.svg",
    targetId: "target-color",
    targetHsl: { h: 215, s: 75, l: 45 }, // Blu campo
    funFacts: [
      "L'aquila dorata con le ali spiegate su una roccia proviene dall'antico stemma della Patria del Friuli risalente al 1077.",
      "La roccia d'argento simboleggia le Alpi Carniche e Giulie e la fortezza di Aquileia.",
      "I colori azzurro e oro derivano dall'antico stemma patriarcale aquileiese."
    ],
  },
  {
    id: "lazio",
    title: "Lazio",
    svgFile: "/flags/Flag_of_Lazio.svg",
    targetId: "target-color",
    targetHsl: { h: 215, s: 75, l: 40 }, // Blu/Ottanio campo
    funFacts: [
      "L'ottagono centrale racchiude gli stemmi delle 5 province: Roma al centro, circondata da Frosinone, Latina, Rieti e Viterbo.",
      "Lo stemma centrale di Roma riporta la celebre sigla latina SPQR (Senatus PopulusQue Romanus).",
      "Ai lati dello scudo sono presenti due rami intrecciati: uno di alloro (gloria) e uno di quercia (forza)."
    ],
  },
  {
    id: "liguria",
    title: "Liguria",
    svgFile: "/flags/Flag_of_Liguria.svg",
    targetId: "target-color",
    targetHsl: { h: 140, s: 65, l: 40 }, // Verde fascia
    funFacts: [
      "La caravella stilizzata al centro celebra la tradizione marinara ligure e il navigatore genovese Cristoforo Colombo.",
      "Le quattro stelle d'argento sulle vele simboleggiano le quattro province liguri: Genova, Imperia, La Spezia e Savona.",
      "I tre colori a bande simboleggiano i monti dell'Appennino (verde), la costa e il mare (blu) e il sangue versato per la libertà (rosso)."
    ],
  },
  {
    id: "lombardia",
    title: "Lombardia",
    svgFile: "/flags/Flag_of_Lombardy.svg",
    targetId: "target-color",
    targetHsl: { h: 140, s: 70, l: 35 }, // Verde campo
    funFacts: [
      "La figura centrale è la Rosa Camuna, antichissima incisione rupestre lasciata dai Camuni in Val Camonica nell'età del ferro.",
      "Il simbolo è stato ridisegnato nel 1975 da un team di grandi maestri del design tra cui Bruno Munari e Bob Noorda.",
      "Il verde di fondo rappresenta la pianura e le colline lombarde, mentre il bianco esprime la luce e la purezza delle Alpi."
    ],
  },
  {
    id: "marche",
    title: "Marche",
    svgFile: "/flags/Flag_of_Marche.svg",
    targetId: "target-color",
    targetHsl: { h: 140, s: 65, l: 40 }, // Verde picchio
    funFacts: [
      "Il picchio stilizzato richiama l'antico totem dei Piceni, popolazione italica guidata da un picchio durante la migrazione sacra (Ver Sacrum).",
      "Il picchio si sovrappone alla lettera 'M' in nero formando un logo geometrico moderno adottato nel 1980.",
      "Il nome al plurale 'Marche' deriva dal plurale medievale di 'marca', termine di origine germanica che indicava una terra di confine."
    ],
  },
  {
    id: "molise",
    title: "Molise",
    svgFile: "/flags/Flag_of_Molise.svg",
    targetId: "target-color",
    targetHsl: { h: 201, s: 100, l: 40 }, // Blu bandiera Molise (#0085CE)
    funFacts: [
      "La stella a otto punte nello scudo rappresenta le otto confederazioni dell'antico popolo fiero e guerriero dei Sanniti.",
      "La banda diagonale rossa è un richiamo allo stemma medievale della nobile famiglia dei Conti di Molise.",
      "La bandiera è stata approvata nel 1995, con il campo azzurro che simboleggia serenità e orizzonte aperto."
    ],
  },
  {
    id: "piemonte",
    title: "Piemonte",
    svgFile: "/flags/Flag_of_Piedmont.svg",
    targetId: "target-color",
    targetHsl: { h: 215, s: 80, l: 40 }, // Blu lambello/bordo
    funFacts: [
      "La bandiera riprende la storica insegna del Principe di Piemonte istituita da Amedeo VIII di Savoia nel 1424.",
      "Il simbolo a tre pendenti azzurro sopra la croce è il 'lambello', che nell'araldica medievale contraddistingueva il figlio primogenito.",
      "Il campo rosso crociato d'argento fu per secoli lo stemma sabaudo prima di diventare base per la bandiera regionale."
    ],
  },
  {
    id: "puglia",
    title: "Puglia",
    svgFile: "/flags/Flag_of_Apulia.svg",
    targetId: "target-color",
    targetHsl: { h: 359, s: 80, l: 43 }, // Rosso campo Puglia
    funFacts: [
      "L'albero di olivo al centro simboleggia l'agricoltura, la pace e le secolari distese di ulivi tipiche del paesaggio pugliese.",
      "I sei cerchi dorati sopra l'albero rappresentano le sei province della regione: Bari, BAT, Brindisi, Foggia, Lecce e Taranto.",
      "Lo scudo ottagonale centrale è un omaggio alla straordinaria architettura di Castel del Monte, voluta da Federico II."
    ],
  },
  {
    id: "sardegna",
    title: "Sardegna",
    svgFile: "/flags/Flag_of_Sardinia.svg",
    targetId: "target-color",
    targetHsl: { h: 0, s: 85, l: 45 }, // Rosso croce
    funFacts: [
      "La celebre bandiera dei 'Quattro Mori' raffigura quattro teste di sovrani saraceni sconfitti durante la Reconquista aragonese.",
      "Dal 1999 i Mori sono rappresentati con la benda sulla fronte e lo sguardo rivolto a destra (in passato avevano la benda sugli occhi).",
      "La croce rossa su fondo bianco è la Croce di San Giorgio, legata storicamente alla Corona d'Aragona e alla battaglia di Alcoraz (1096)."
    ],
  },
  {
    id: "sicilia",
    title: "Sicilia",
    svgFile: "/flags/Flag_of_Sicily.svg",
    targetId: "target-color",
    targetHsl: { h: 48, s: 100, l: 50 }, // Giallo
    funFacts: [
      "I colori rosso e giallo simboleggiano l'unione dei comuni di Palermo e Corleone durante i Vespri Siciliani del 1282.",
      "La Trinacria al centro raffigura la testa della Gorgone con ali e serpenti intrecciati a tre spighe di grano (simbolo di fertilità).",
      "Le tre gambe piegate simboleggiano i tre promontori dell'isola triangolare: Capo Peloro, Capo Passero e Capo Boeo."
    ],
  },
  {
    id: "toscana",
    title: "Toscana",
    svgFile: "/flags/Flag_of_Tuscany.svg",
    targetId: "target-color",
    targetHsl: { h: 0, s: 85, l: 45 }, // Rosso fasce
    funFacts: [
      "Il cavallo alato Pegaso al centro fu scelto dal Comitato Toscano di Liberazione Nazionale durante la Resistenza nel 1944.",
      "Il disegno di Pegaso fu originariamente inciso da Benvenuto Cellini su una celebre medaglia rinascimentale del 1537.",
      "Le due fasce orizzontali rosse su fondo bianco richiamano l'antico stemma del Granducato di Toscana dei Lorena."
    ],
  },
  {
    id: "trentino-alto-adige",
    title: "Trentino-Alto Adige",
    svgFile: "/flags/Flag_of_Trentino-South_Tyrol.svg",
    targetId: "target-color",
    targetHsl: { h: 215, s: 75, l: 45 }, // Blu fascia
    funFacts: [
      "Lo scudo inquartato unisce l'Aquila nera di San Venceslao (Trentino) e l'Aquila rossa del Tirolo (Alto Adige/Südtirol).",
      "L'aquila trentina fu concessa nel 1339 dal re di Boemia Giovanni di Lussemburgo al vescovo di Trento.",
      "La bandiera è un bicolore azzurro e bianco, colori tradizionali legati alla storia alpina della regione."
    ],
  },
  {
    id: "umbria",
    title: "Umbria",
    svgFile: "/flags/Flag_of_Umbria.svg",
    targetId: "target-color",
    targetHsl: { h: 140, s: 65, l: 35 }, // Verde campo
    funFacts: [
      "I tre elementi geometrici rossi stilizzano i celebri Tre Ceri di Gubbio, protagonisti dell'omonima festa medievale del 15 maggio.",
      "I Ceri sono posizionati su una fascia d'argento obliqua e furono disegnati nel 1971 dagli architetti Gino e Alberto Anselmi.",
      "Il verde intenso dello sfondo richiama il soprannome storico della regione: 'il cuore verde d'Italia'."
    ],
  },
  {
    id: "valle-daosta",
    title: "Valle d'Aosta",
    svgFile: "/flags/Flag_of_Aosta_Valley.svg",
    targetId: "target-color",
    targetHsl: { h: 0, s: 85, l: 45 }, // Rosso
    funFacts: [
      "Il bicolore verticale nero e rosso deriva dallo stemma araldico del Ducato d'Aosta del XVI secolo con il leone d'argento rampante.",
      "Questa combinazione di colori fu adottata dalla Resistenza valdostana e dall'illustre intellettuale e politico Émile Chanoux.",
      "È l'unica bandiera regionale italiana a non contenere stemmi, scritte o loghi sovrapposti, lasciando protagonista il puro bicolore."
    ],
  },
  {
    id: "veneto",
    title: "Veneto",
    svgFile: "/flags/Flag_of_Veneto.svg",
    targetId: "target-color",
    targetHsl: { h: 32, s: 100, l: 50 }, // Arancione/Rosso veneziano
    funFacts: [
      "Il Leone alato di San Marco poggia la zampa sul Vangelo aperto con la celebre scritta: 'Pax Tibi Marce Evangelista Meus'.",
      "Le sette fiamme terminali della bandiera rappresentano le sette province storiche venete, ciascuna con il proprio stemma.",
      "Sullo sfondo del leone compare una ricca sintesi del territorio: il mare, la pianura veneta e le vette delle Dolomiti."
    ],
  },
];