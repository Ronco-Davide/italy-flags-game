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

// Codici effettivamente presenti nelle SVG. Ogni lista copre le varianti
// dello stesso colore tra le diverse bandiere.
const REDS = ['#c8102e', '#cd212a', '#d40000', '#e40544', '#ff0000', '#ce2029', '#e30a17', '#da291c', '#ed1c24', '#f82920', '#d71919', '#d5001d', '#d80000', '#ec1b23', '#ce1021', '#e30613', '#da121a', '#c4262e', '#c40000', '#e70000'];
const BLUES = ['#002b7f', '#002776', '#0a4fa2', '#003399', '#0055a5', '#0077be', '#0072ce', '#0099ff', '#009ee0', '#00a0e2', '#2c4878', '#1b3f73', '#1b2f8d', '#186bb4', '#196db6', '#54d6ed', '#009cce', '#0085ce', '#01419c', '#0f47af'];
const GREENS = ['#00803d', '#008c45', '#00a05e', '#009246', '#138808', '#2e5a1c', '#1b4d1b', '#005500', '#336633', '#009a49', '#009c31', '#00a040', '#036f3a', '#00943a'];
const GOLDS = ['#ffd100', '#ffcc00', '#fcd116', '#f2ce26', '#deb308', '#ffdf00', '#fddc2f', '#fff100'];
const BLACKS = ['#000000', '#000', '#1a1a1a', '#222222', 'black'];
const DARK_REDS = ['#8b0000', '#a60000', '#800000', '#8b1c1c', '#990000', '#c84a46'];
const WHITES = ['#ffffff', '#fff', '#FFFFFF', '#FFF', 'white', 'rgb(255, 255, 255)', 'rgb(255,255,255)'];

export const levels: Level[] = [
  {
    id: "abruzzo",
    title: "Abruzzo",
    svgFile: "Flag_of_Abruzzo.svg",
    targets: [
      { elementName: "Fascia Inferiore Scudo", targetHsl: { h: 202, s: 100, l: 37 }, colors: ['#0077be'] },
      { elementName: "Fascia Centrale Scudo", targetHsl: { h: 140, s: 70, l: 35 }, colors: ['#00803d'] },
      { elementName: "Sfondo", targetHsl: { h: 344, s: 94, l: 46 }, colors: ['#e40544'] },
      { elementName: "Dettagli", targetHsl: { h: 42, s: 35, l: 54 }, colors: ['#b39461'] },
    ],
    funFacts: [
      "I tre colori dello scudo rappresentano la neve del Gran Sasso (bianco), i boschi dell'Appennino (verde) e il Mar Adriatico (blu).",
      "La fascia tricolore nello scudo è inclinata in senso diagonale discendente, richiamando la conformazione orografica della regione.",
      "La bandiera è stata ufficialmente adottata nel 1999 prendendo spunto dallo stemma ideato nel 1986."
    ],
  },
  {
    id: "basilicata",
    title: "Basilicata",
    svgFile: "Flag_of_Basilicata.svg",
    targets: [
      { elementName: "Sfondo", targetHsl: { h: 218, s: 46, l: 32 }, colors: ['#2c4878'] },
      { elementName: "Onde", targetHsl: { h: 0, s: 0, l: 77 }, colors: ['#c5c5c5'] },
    ],
    funFacts: [
      "Le quattro onde azzurre al centro dello scudo simboleggiano i fiumi principali della regione: Bradano, Basento, Agri e Sinni.",
      "Il fondo blu della bandiera richiama le due coste della regione, bagnata sia dallo Ionio che dal Tirreno.",
      "L'antico nome della regione era Lucania, termine che deriva probabilmente dalla parola latina 'lucus' (bosco sacro)."
    ],
  },
  {
    id: "calabria",
    title: "Calabria",
    svgFile: "Flag_of_Calabria.svg",
    targets: [
      { elementName: "Sfondo Principale", targetHsl: { h: 212, s: 88, l: 34 }, colors: ['#0a4fa2'] },
      { elementName: "Croce Scudo e Scritte", targetHsl: { h: 48, s: 100, l: 50 }, colors: ['#deb308'] },
      { elementName: "Ramo Centrale", targetHsl: { h: 138, s: 57, l: 45 }, colors: ['#32b457'] },
      { elementName: "Colonna Centrale", targetHsl: { h: 196, s: 100, l: 47 }, colors: ['#00aeef'] },
    ],
    funFacts: [
      "Lo stemma ovale racchiude quattro simboli storici: il pino loricato, la colonna dorica, la croce potenziata e la croce greca bizantina.",
      "La colonna dorica rende omaggio alla Magna Grecia, periodo in cui la Calabria fu culla di filosofia, arte e cultura.",
      "I colori blu e azzurro della bandiera rappresentano la posizione peninsulare abbracciata da due mari."
    ],
  },
  {
    id: "campania",
    title: "Campania",
    svgFile: "Flag_of_Campania.svg",
    targets: [
      { elementName: "Sfondo", targetHsl: { h: 220, s: 100, l: 25 }, colors: ['#1b2f8d'] },
      { elementName: "Banda Diagonale Scudo", targetHsl: { h: 351, s: 85, l: 42 }, colors: ['#d20019'] },
      { elementName: "Scudo", targetHsl: { h: 0, s: 0, l: 100 }, colors: ['#ffffff'] },
    ],
    funFacts: [
      "Lo stemma riprende la storica bandiera della Repubblica Marinara di Amalfi con la banda rossa su campo bianco.",
      "La Campania adottò questo simbolo nel 1971 in onore dell'epoca gloriosa del ducato amalfitano e delle sue tavole marittime.",
      "Il campo azzurro della bandiera evoca il celebre golfo di Napoli e le sue isole."
    ],
  },
  {
    id: "emilia-romagna",
    title: "Emilia-Romagna",
    svgFile: "Flag_of_Emilia_Romagna.svg",
    targets: [
      { elementName: "Profilo Geografico", targetHsl: { h: 149, s: 100, l: 25 }, colors: ['#009a49'] },
      { elementName: "Dettagli", targetHsl: { h: 356, s: 89, l: 55 }, colors: ['#f32837'] },
    ],
    funFacts: [
      "Il logo moderno e stilizzato rappresenta il profilo geografico della regione: la linea curva verde riassume il Po e l'Appennino.",
      "È stato ideato dal celebre designer italiano Erberto Carboni nel 1989.",
      "Il colore verde brillante richiama la fertilissima Pianura Padana e le sue storiche eccellenze agricole."
    ],
  },
  {
    id: "friuli-venezia-giulia",
    title: "Friuli-Venezia Giulia",
    svgFile: "Flag_of_Friuli.svg",
    targets: [
      { elementName: "Sfondo Principale", targetHsl: { h: 220, s: 100, l: 25 }, colors: ['#186bb4', '#196db6'] },
      { elementName: "Aquila", targetHsl: { h: 45, s: 95, l: 50 }, colors: ['#fddc2f'] },
      { elementName: "Scudo", targetHsl: { h: 1, s: 79, l: 50 }, colors: ['#e31d1a'] },
      { elementName: "Contorni dello Stemma", targetHsl: { h: 345, s: 7, l: 13 }, colors: ['#231f20'] },
    ],
    funFacts: [
      "L'aquila dorata con le ali spiegate su una roccia proviene dall'antico stemma della Patria del Friuli risalente al 1077.",
      "La roccia d'argento simboleggia le Alpi Carniche e Giulie e la fortezza di Aquileia.",
      "I colori azzurro e oro derivano dall'antico stemma patriarcale aquileiese."
    ],
  },
  {
    id: "lazio",
    title: "Lazio",
    svgFile: "Flag_of_Lazio.svg",
    targets: [
      { elementName: "Sfondo Principale", targetHsl: { h: 220, s: 80, l: 28 }, colors: ['#0075d0'] },
      { elementName: "Corona e Scitte", targetHsl: { h: 49, s: 98, l: 53 }, colors: ['#fdd212'] },
      { elementName: "Dettagli", targetHsl: { h: 148, s: 100, l: 27 }, colors: ['#008a40'] },
    ],
    funFacts: [
      "L'ottagono centrale racchiude gli stemmi delle 5 province: Roma al centro, circondata da Frosinone, Latina, Rieti e Viterbo.",
      "Lo stemma centrale di Roma riporta la celebre sigla latina SPQR (Senatus PopulusQue Romanus).",
      "Ai lati dello scudo sono presenti due rami intrecciati: uno di alloro (gloria) e uno di quercia (forza)."
    ],
  },
  {
    id: "liguria",
    title: "Liguria",
    svgFile: "Flag_of_Liguria.svg",
    targets: [
      { elementName: "Fascia Sinistra", targetHsl: { h: 150, s: 100, l: 27 }, colors: ['#009c31'] },
      { elementName: "Fascia Centrale", targetHsl: { h: 351, s: 85, l: 42 }, colors: ['#ff0000'] },
      { elementName: "Fascia Destra", targetHsl: { h: 215, s: 80, l: 40 }, colors: ['#009cce'] },
      { elementName: "Caravella", targetHsl: { h: 0, s: 0, l: 59 }, colors: ['#969696'] },
    ],
    funFacts: [
      "La caravella stilizzata al centro celebra la tradizione marinara ligure e il navigatore genovese Cristoforo Colombo.",
      "Le quattro stelle d'argento sulle vele simboleggiano le quattro province liguri: Genova, Imperia, La Spezia e Savona.",
      "I tre colori a bande simboleggiano i monti dell'Appennino (verde), la costa e il mare (blu) e il sangue versato per la libertà (rosso)."
    ],
  },
  {
    id: "lombardia",
    title: "Lombardia",
    svgFile: "Flag_of_Lombardy.svg",
    targets: [
      { elementName: "Sfondo", targetHsl: { h: 150, s: 100, l: 27 }, colors: ['#00a040'] },
      { elementName: "Rosa Camuna", targetHsl: { h: 0, s: 0, l: 100 }, colors: ['#ffffff'] },
    ],
    funFacts: [
      "La figura centrale è la Rosa Camuna, antichissima incisione rupestre lasciata dai Camuni in Val Camonica nell'età del ferro.",
      "Il simbolo è stato ridisegnato nel 1975 da un team di grandi maestri del design tra cui Bruno Munari e Bob Noorda.",
      "Il verde di fondo rappresenta la pianura e le colline lombarde, mentre il bianco esprime la luce e la purezza delle Alpi."
    ],
  },
  {
    id: "marche",
    title: "Marche",
    svgFile: "Flag_of_Marche.svg",
    targets: [
      { elementName: "Profilo", targetHsl: { h: 150, s: 100, l: 27 }, colors: ['#036f3a'] },
      { elementName: "Lettera M", targetHsl: { h: 0, s: 0, l: 0 }, colors: ['#000000'] },
      { elementName: "Sfondo", targetHsl: { h: 0, s: 0, l: 100 }, colors: ['#ffffff'] }
    ],
    funFacts: [
      "Il picchio stilizzato richiama l'antico totem dei Piceni, popolazione italica guidata da un picchio durante la migrazione sacra (Ver Sacrum).",
      "Il picchio si sovrappone alla lettera 'M' in nero formando un logo geometrico moderno adottato nel 1980.",
      "Il nome al plurale 'Marche' deriva dal plurale medievale di 'marca', termine di origine germanica che indicava una terra di confine."
    ],
  },
  {
    id: "molise",
    title: "Molise",
    svgFile: "Flag_of_Molise.svg",
    targets: [
      { elementName: "Sfondo Principale", targetHsl: { h: 198, s: 100, l: 45 }, colors: ['#0085ce'] },
      { elementName: "Scudo Centrale", targetHsl: { h: 351, s: 85, l: 42 }, colors: ['#d71919'] },
      { elementName: "Dettagli", targetHsl: { h: 0, s: 0, l: 75 }, colors: ['#bebebe'] },
    ],
    funFacts: [
      "La stella a otto punte nello scudo rappresenta le otto confederazioni dell'antico popolo fiero e guerriero dei Sanniti.",
      "La banda diagonale rossa è un richiamo allo stemma medievale della nobile famiglia dei Conti di Molise.",
      "La bandiera è stata approvata nel 1995, con il campo azzurro che simboleggia serenità e orizzonte aperto."
    ],
  },
  {
    id: "piemonte",
    title: "Piemonte",
    svgFile: "Flag_of_Piedmont.svg",
    targets: [
      { elementName: "Sfondo della Croce", targetHsl: { h: 351, s: 85, l: 42 }, colors: ['#d5001d'] },
      { elementName: "Cornice e Lambello", targetHsl: { h: 220, s: 100, l: 25 }, colors: ['#01419c'] },
      { elementName: "Croce", targetHsl: { h: 0, s: 0, l: 100 }, colors: ['#ffffff'] },
    ],
    funFacts: [
      "La bandiera riprende la storica insegna del Principe di Piemonte istituita da Amedeo VIII di Savoia nel 1424.",
      "Il simbolo a tre pendenti azzurro sopra la croce è il 'lambello', che nell'araldica medievale contraddistingueva il figlio primogenito.",
      "Il campo rosso crociato d'argento fu per secoli lo stemma sabaudo prima di diventare base per la bandiera regionale."
    ],
  },
  {
    id: "puglia",
    title: "Puglia",
    svgFile: "Flag_of_Apulia.svg",
    targets: [
      { elementName: "Banda a Sinistra", targetHsl: { h: 155, s: 100, l: 31 }, colors: ['#00a05e'] },
      { elementName: "Banda a Destra", targetHsl: { h: 351, s: 85, l: 42 }, colors: ['#f82920'] },
      { elementName: "Mare", targetHsl: { h: 198, s: 100, l: 44 }, colors: ['#009ee0'] },
      { elementName: "Dettagli", targetHsl: { h: 48, s: 88, l: 55 }, colors: ['#f2ce26'] },
    ],
    funFacts: [
      "L'albero di olivo al centro simboleggia l'agricoltura, la pace e le secolari distese di ulivi tipiche del paesaggio pugliese.",
      "I sei cerchi dorati sopra l'albero rappresentano le sei province della regione: Bari, BAT, Brindisi, Foggia, Lecce e Taranto.",
      "Lo scudo ottagonale centrale è un omaggio alla straordinaria architettura di Castel del Monte, voluta da Federico II."
    ],
  },
  {
    id: "sardegna",
    title: "Sardegna",
    svgFile: "Flag_of_Sardinia.svg",
    targets: [
      { elementName: "Croce", targetHsl: { h: 351, s: 85, l: 42 }, colors: ['#d80000'] },
    ],
    funFacts: [
      "La celebre bandiera dei 'Quattro Mori' raffigura quattro teste di sovrani saraceni sconfitti durante la Reconquista aragonese.",
      "Dal 1999 i Mori sono rappresentati con la benda sulla fronte e lo sguardo rivolto a destra (in passato avevano la benda sugli occhi).",
      "La croce rossa su fondo bianco è la Croce di San Giorgio, legata storicamente alla Corona d'Aragona e alla battaglia di Alcoraz (1096)."
    ],
  },
  {
    id: "sicilia",
    title: "Sicilia",
    svgFile: "Flag_of_Sicily.svg",
    targets: [
      { elementName: "Triangolo in basso (Sinistra)", targetHsl: { h: 49, s: 100, l: 50 }, colors: ['#fff100'] },
      { elementName: "Triangolo in alto (Destra)", targetHsl: { h: 351, s: 85, l: 42 }, colors: ['#ec1b23'] },
      { elementName: "Trinacria", targetHsl: { h: 24, s: 100, l: 81 }, colors: ['#ffc8a0'] },
      { elementName: "Dettagli", targetHsl: { h: 41, s: 82, l: 57 }, colors: ['#ebb437', '#ebb432'] },
    ],
    funFacts: [
      "I colori rosso e giallo simboleggiano l'unione dei comuni di Palermo e Corleone durante i Vespri Siciliani del 1282.",
      "La Trinacria al centro raffigura la testa della Gorgone con ali e serpenti intrecciati a tre spighe di grano (simbolo di fertilità).",
      "Le tre gambe piegate simboleggiano i tre promontori dell'isola triangolare: Capo Peloro, Capo Passero e Capo Boeo."
    ],
  },
  {
    id: "toscana",
    title: "Toscana",
    svgFile: "Flag_of_Tuscany.svg",
    targets: [
      { elementName: "Fasce Orizzontali", targetHsl: { h: 0, s: 100, l: 42 }, colors: ['#e30613'] },
      { elementName: "Sfondo", targetHsl: { h: 0, s: 0, l: 100 }, colors: ['#ffffff'] }
    ],
    funFacts: [
      "Il cavallo alato Pegaso al centro fu scelto dal Comitato Toscano di Liberazione Nazionale durante la Resistenza nel 1944.",
      "Il disegno di Pegaso fu originariamente inciso da Benvenuto Cellini su una celebre medaglia rinascimentale del 1537.",
      "Le due fasce orizzontali rosse su fondo bianco richiamano l'antico stemma del Granducato di Toscana dei Lorena."
    ],
  },
  {
    id: "trentino-alto-adige",
    title: "Trentino-Alto Adige",
    svgFile: "Flag_of_Trentino-South_Tyrol.svg",
    targets: [
      { elementName: "Fascia Orizzontale", targetHsl: { h: 220, s: 100, l: 25 }, colors: ['#0f47af'] },
      { elementName: "Aquile", targetHsl: { h: 359, s: 85, l: 46 }, colors: ['#da121a'] },
      { elementName: "Dettagli Aquile", targetHsl: { h: 52, s: 94, l: 51 }, colors: ['#fcdd09'] },
    ],
    funFacts: [
      "Lo scudo inquartato unisce l'Aquila nera di San Venceslao (Trentino) e l'Aquila rossa del Tirolo (Alto Adige/Südtirol).",
      "L'aquila trentina fu concessa nel 1339 dal re di Boemia Giovanni di Lussemburgo al vescovo di Trento.",
      "La bandiera è un bicolore azzurro e bianco, colori tradizionali legati alla storia alpina della regione."
    ],
  },
  {
    id: "umbria",
    title: "Umbria",
    svgFile: "Flag_of_Umbria.svg",
    targets: [
      { elementName: "Sfondo", targetHsl: { h: 150, s: 100, l: 27 }, colors: ['#00943a'] },
      { elementName: "Ceri", targetHsl: { h: 351, s: 85, l: 42 }, colors: ['#c4262e'] },
      { elementName: "Fasce centrali", targetHsl: { h: 150, s: 1, l: 64 }, colors: ['#a2a4a3'] },
    ],
    funFacts: [
      "I tre elementi geometrici rossi stilizzano i celebri Tre Ceri di Gubbio, protagonisti dell'omonima festa medievale del 15 maggio.",
      "I Ceri sono posizionati su una fascia d'argento obliqua e furono disegnati nel 1971 dagli architetti Gino e Alberto Anselmi.",
      "Il verde intenso dello sfondo richiama il soprannome storico della regione: 'il cuore verde d'Italia'."
    ],
  },
  {
    id: "valle-daosta",
    title: "Valle d'Aosta",
    svgFile: "Flag_of_Valle_dAosta.svg",
    targets: [
      { elementName: "Metà a Sinistra", targetHsl: { h: 0, s: 0, l: 0 }, colors: BLACKS },
      { elementName: "Metà a Destra", targetHsl: { h: 0, s: 100, l: 42 }, colors: REDS },
    ],
    funFacts: [
      "Il bicolore verticale nero e rosso deriva dallo stemma araldico del Ducato d'Aosta del XVI secolo con il leone d'argento rampante.",
      "Questa combinazione di colori fu adottata dalla Resistenza valdostana e dall'illustre intellettuale e politico Émile Chanoux.",
      "È l'unica bandiera regionale italiana a non contenere stemmi, scritte o loghi sovrapposti, lasciando protagonista il puro bicolore."
    ],
  },
  {
    id: "veneto",
    title: "Veneto",
    svgFile: "Flag_of_Veneto.svg",
    targets: [
      { elementName: "Sfondo Principale", targetHsl: { h: 0, s: 64, l: 30 }, colors: ['#c84a46'] },
      { elementName: "Dettagli", targetHsl: { h: 38, s: 70, l: 61 }, colors: ['#e2af54'] },
    ],
    funFacts: [
      "Il Leone alato di San Marco poggia la zampa sul Vangelo aperto con la celebre scritta: 'Pax Tibi Marce Evangelista Meus'.",
      "Le sette fiamme terminali della bandiera rappresentano le sette province storiche venete, ciascuna con il proprio stemma.",
      "Sullo sfondo del leone compare una ricca sintesi del territorio: il mare, la pianura veneta e le vette delle Dolomiti."
    ],
  },
];
