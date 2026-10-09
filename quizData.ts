// Domande del Gioco di Paese — quiz su Serracapriola (storia, abitudini, cucina, tradizioni)
export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "In quale provincia si trova Serracapriola?",
    options: ["Foggia", "Bari", "Campobasso", "Chieti"],
    correctIndex: 0,
  },
  {
    question: "In quale regione italiana si trova Serracapriola?",
    options: ["Molise", "Puglia", "Abruzzo", "Basilicata"],
    correctIndex: 1,
  },
  {
    question: "Cosa significa la parola \"Capriola\" nel nome del paese?",
    options: ["Un tipo di grano", "Un antico tributo", "Il capriolo, l'animale selvatico", "Una danza popolare"],
    correctIndex: 2,
  },
  {
    question: "Secondo la leggenda, quale animale guidò un conte fino a una grotta con un'immagine sacra?",
    options: ["Un lupo", "Un cinghiale", "Un capriolo", "Una volpe"],
    correctIndex: 2,
  },
  {
    question: "Come si chiama la chiesetta nata secondo la leggenda del capriolo?",
    options: ["San Leone Magno", "Santa Maria in Silvis", "San Mercurio", "Santa Croce"],
    correctIndex: 1,
  },
  {
    question: "Come si chiama il castello di Serracapriola?",
    options: ["Castello Maresca", "Castello Svevo", "Castello Angioino", "Castello Normanno"],
    correctIndex: 0,
  },
  {
    question: "A chi è dedicata la chiesa madre di Serracapriola?",
    options: ["San Michele", "San Mercurio", "San Giuseppe", "Sant'Antonio"],
    correctIndex: 1,
  },
  {
    question: "Quale famiglia nobile tenne il feudo in epoca aragonese?",
    options: ["I De Capua", "I D'Avalos", "I Caracciolo", "I Del Balzo"],
    correctIndex: 0,
  },
  {
    question: "In che anno Serracapriola entrò a far parte del Regno d'Italia unito?",
    options: ["1799", "1848", "1861", "1900"],
    correctIndex: 2,
  },
  {
    question: "Quale antica via romana passava vicino al territorio di Serracapriola?",
    options: ["Via Appia", "Via Consolare Traiana", "Via Flaminia", "Via Aurelia"],
    correctIndex: 1,
  },
  {
    question: "Quanti abitanti ha oggi circa Serracapriola?",
    options: ["Circa 1.000", "Circa 3.500", "Circa 7.000", "Circa 15.000"],
    correctIndex: 1,
  },
  {
    question: "Quanti abitanti aveva Serracapriola nel dopoguerra?",
    options: ["Circa 2.000", "Circa 4.500", "Circa 7.000", "Circa 10.000"],
    correctIndex: 2,
  },
  {
    question: "Cosa accadde a Serracapriola il 1° ottobre 1943?",
    options: [
      "Una grande festa patronale",
      "L'insurrezione popolare contro i tedeschi",
      "L'inaugurazione del castello",
      "Un terremoto",
    ],
    correctIndex: 1,
  },
  {
    question: "Chi definì Serracapriola \"l'eroica cittadina della Capitanata\"?",
    options: ["Il Papa", "Radio Londra", "Il Re d'Italia", "Un giornale locale"],
    correctIndex: 1,
  },
  {
    question: "Come si chiamano in dialetto i peperoni cruschi tipici del paese?",
    options: ["Diavlill", "Cazzuott", "Fasciatiell", "Scarcedd"],
    correctIndex: 0,
  },
  {
    question: "Come si preparano i peperoni cruschi?",
    options: [
      "Bolliti e conservati in olio",
      "Essiccati al sole e poi fritti",
      "Affumicati e stagionati",
      "Cotti al forno con formaggio",
    ],
    correctIndex: 1,
  },
  {
    question: "Cos'è la pampanella?",
    options: [
      "Un dolce di mandorle",
      "Un formaggio stagionato",
      "Maiale marinato con peperoncino e cotto al forno",
      "Una zuppa di legumi",
    ],
    correctIndex: 2,
  },
  {
    question: "Cosa sono i torcinelli?",
    options: [
      "Dolci fritti ripieni di crema",
      "Interiora di agnello o capretto cotte alla brace",
      "Pane cotto a legna",
      "Un tipo di pasta fresca",
    ],
    correctIndex: 1,
  },
  {
    question: "Quale dolce si prepara tradizionalmente per la festa del papà (19 marzo)?",
    options: ["Mostaccioli", "Pasticciotti", "Zeppole di San Giuseppe", "Dolci di mandorla"],
    correctIndex: 2,
  },
  {
    question: "Quale vitigno rosso tipico del territorio produce vini robusti e profumati?",
    options: ["Nero di Troia", "Sangiovese", "Primitivo", "Aglianico"],
    correctIndex: 0,
  },
  {
    question: "Quale pasta fatta a mano è tipica della cucina serrana?",
    options: ["Fettuccine", "Orecchiette", "Tagliatelle", "Gnocchi"],
    correctIndex: 1,
  },
  {
    question: "Con il latte di quali animali si produce il caciocavallo podolico?",
    options: ["Pecore", "Capre", "Bufale", "Vacche podoliche"],
    correctIndex: 3,
  },
  {
    question: "Insieme alla Madonna, a quale santo è dedicata un'importante festa locale?",
    options: ["San Mercurio", "San Nicola", "San Rocco", "San Francesco"],
    correctIndex: 0,
  },
  {
    question: "Come si chiama la migrazione stagionale delle greggi che passava nei tratturi vicino al paese?",
    options: ["Vendemmia", "Mietitura", "Transumanza", "Sagra"],
    correctIndex: 2,
  },
  {
    question: "Quale sacerdote è legato alle leggende locali su streghe ed esorcismi?",
    options: ["Padre Pio", "Padre Matteo d'Agnone", "Don Vincenzo", "Padre Giovanni"],
    correctIndex: 1,
  },
  {
    question: "Come si chiama la misteriosa apertura nel cortile del castello legata a una leggenda inquietante?",
    options: ["Il pozzo dei desideri", "Il trabocchetto", "La fossa del conte", "La cripta"],
    correctIndex: 1,
  },
  {
    question: "Quale ordine religioso avrebbe nascosto un tesoro prima di lasciare Serracapriola, secondo la leggenda?",
    options: ["I Benedettini", "I Francescani", "I Gesuiti", "I Domenicani"],
    correctIndex: 0,
  },
  {
    question: "Di che colore erano le misteriose luci viste dai contadini nelle campagne, secondo le leggende?",
    options: ["Rosse", "Verdi", "Azzurre", "Gialle"],
    correctIndex: 2,
  },
  {
    question: "Quale antica via di pellegrinaggio passa vicino al territorio di Serracapriola?",
    options: ["Via Francigena del Sud", "Cammino di Santiago", "Via Lauretana", "Via Micaelica"],
    correctIndex: 0,
  },
  {
    question: "Quale animale è diventato il simbolo affettuoso di Serracapriola?",
    options: ["Il lupo", "Il capriolo", "L'aquila", "Il cinghiale"],
    correctIndex: 1,
  },
];
