// Dati da directory online (Tripadvisor, TuttiAffari, RestaurantGuru): possono essere non aggiornati.
// `photo`: ID del file sulla CDN; se manca, si mostra un riquadro con il piatto di pasta.
export type Restaurant = {
  name: string;
  kind: string;
  address: string;
  phones: string[];
  photo?: string;
  // Foto verticale: si mostra intera, più piccola, invece di essere ritagliata.
  photoFit?: boolean;
};

export const RESTAURANTS: Restaurant[] = [
  {
    name: "Il Rifugio dei Sapori",
    kind: "Ristorante di pesce e cucina pugliese",
    address: "Corso Garibaldi 48",
    phones: ["347 056 3314", "0882 199 5603"],
    photo: "uJIw4h9ENOcczpi3G0kDnLEb",
  },
  {
    name: "Pizzeria Da Gino Pampa & Nella",
    kind: "Pizzeria e cucina locale (pampanella)",
    address: "Corso Garibaldi 82",
    phones: ["349 052 2497"],
    photo: "xdRIR2a6Y03C2Nxnl1NrWo7l",
  },
  {
    name: "La Stalla",
    kind: "Pizzeria",
    address: "Via Cavalier de Luca 23",
    phones: ["345 152 4632"],
    photo: "ZqN2avXXgyacjsFwvhRxUVMy",
    photoFit: true,
  },
  {
    name: "Pizzeria Pub De Siro",
    kind: "Panificio e pizzeria",
    address: "Corso Garibaldi 87 e 91",
    phones: ["388 385 3053"],
    photo: "lSc74kRJgApFOEJTlZA4OBV7",
  },
  {
    name: "Ristorante La Dolce Vita di Bandello Giuseppe",
    kind: "Ristorante e cocktail bar",
    address: "Via Cavalier de Luca 29",
    phones: ["334 715 9950"],
    photo: "0XUH7UBWvWIO1J1cEwhHXGtr",
    photoFit: true,
  },
  {
    name: "Forno Pizzeria Taralli di Zio Pino",
    kind: "Forno, pizzeria e taralli",
    address: "Via Cavalier de Luca 20",
    phones: ["340 406 4201"],
    photo: "54YF35oRrJwM1Ts9ugo96D6o",
    photoFit: true,
  },
];
