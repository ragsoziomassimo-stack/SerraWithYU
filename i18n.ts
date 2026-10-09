import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import itCommon from "./locales/it/common.json";
import deCommon from "./locales/de/common.json";
import enCommon from "./locales/en/common.json";
import frCommon from "./locales/fr/common.json";
import bgCommon from "./locales/bg/common.json";

import itStoria from "./locales/it/storia.json";
import deStoria from "./locales/de/storia.json";
import enStoria from "./locales/en/storia.json";
import frStoria from "./locales/fr/storia.json";
import bgStoria from "./locales/bg/storia.json";

import itCastello from "./locales/it/castello.json";
import deCastello from "./locales/de/castello.json";
import enCastello from "./locales/en/castello.json";
import frCastello from "./locales/fr/castello.json";
import bgCastello from "./locales/bg/castello.json";

import itFestivita from "./locales/it/festivita.json";
import deFestivita from "./locales/de/festivita.json";
import enFestivita from "./locales/en/festivita.json";
import frFestivita from "./locales/fr/festivita.json";
import bgFestivita from "./locales/bg/festivita.json";

import itTurismo from "./locales/it/turismo.json";
import deTurismo from "./locales/de/turismo.json";
import enTurismo from "./locales/en/turismo.json";
import frTurismo from "./locales/fr/turismo.json";
import bgTurismo from "./locales/bg/turismo.json";

import itMare from "./locales/it/mare.json";
import deMare from "./locales/de/mare.json";
import enMare from "./locales/en/mare.json";
import frMare from "./locales/fr/mare.json";
import bgMare from "./locales/bg/mare.json";

import itMaps from "./locales/it/maps.json";
import deMaps from "./locales/de/maps.json";
import enMaps from "./locales/en/maps.json";
import frMaps from "./locales/fr/maps.json";
import bgMaps from "./locales/bg/maps.json";

import itComune from "./locales/it/comune.json";
import deComune from "./locales/de/comune.json";
import enComune from "./locales/en/comune.json";
import frComune from "./locales/fr/comune.json";
import bgComune from "./locales/bg/comune.json";

import itFarmacie from "./locales/it/farmacie.json";
import deFarmacie from "./locales/de/farmacie.json";
import enFarmacie from "./locales/en/farmacie.json";
import frFarmacie from "./locales/fr/farmacie.json";
import bgFarmacie from "./locales/bg/farmacie.json";

import itVie from "./locales/it/vie.json";
import deVie from "./locales/de/vie.json";
import enVie from "./locales/en/vie.json";
import frVie from "./locales/fr/vie.json";
import bgVie from "./locales/bg/vie.json";

import itFrancigena from "./locales/it/francigena.json";
import deFrancigena from "./locales/de/francigena.json";
import enFrancigena from "./locales/en/francigena.json";
import frFrancigena from "./locales/fr/francigena.json";
import bgFrancigena from "./locales/bg/francigena.json";

import itEcologia from "./locales/it/ecologia.json";
import deEcologia from "./locales/de/ecologia.json";
import enEcologia from "./locales/en/ecologia.json";
import frEcologia from "./locales/fr/ecologia.json";
import bgEcologia from "./locales/bg/ecologia.json";

import itChiese from "./locales/it/chiese.json";
import deChiese from "./locales/de/chiese.json";
import enChiese from "./locales/en/chiese.json";
import frChiese from "./locales/fr/chiese.json";
import bgChiese from "./locales/bg/chiese.json";

import itWebcam from "./locales/it/webcam.json";
import deWebcam from "./locales/de/webcam.json";
import enWebcam from "./locales/en/webcam.json";
import frWebcam from "./locales/fr/webcam.json";
import bgWebcam from "./locales/bg/webcam.json";

import itCuriosita from "./locales/it/curiosita.json";
import deCuriosita from "./locales/de/curiosita.json";
import enCuriosita from "./locales/en/curiosita.json";
import frCuriosita from "./locales/fr/curiosita.json";
import bgCuriosita from "./locales/bg/curiosita.json";

import itTurista from "./locales/it/turista.json";
import deTurista from "./locales/de/turista.json";
import enTurista from "./locales/en/turista.json";
import frTurista from "./locales/fr/turista.json";
import bgTurista from "./locales/bg/turista.json";

import itProdotti from "./locales/it/prodotti.json";
import deProdotti from "./locales/de/prodotti.json";
import enProdotti from "./locales/en/prodotti.json";
import frProdotti from "./locales/fr/prodotti.json";
import bgProdotti from "./locales/bg/prodotti.json";
import esProdotti from "./locales/es/prodotti.json";

import itPolitica from "./locales/it/politica.json";
import dePolitica from "./locales/de/politica.json";
import enPolitica from "./locales/en/politica.json";
import frPolitica from "./locales/fr/politica.json";
import bgPolitica from "./locales/bg/politica.json";
import esPolitica from "./locales/es/politica.json";

import itHotel from "./locales/it/hotel.json";
import deHotel from "./locales/de/hotel.json";
import enHotel from "./locales/en/hotel.json";
import frHotel from "./locales/fr/hotel.json";
import bgHotel from "./locales/bg/hotel.json";
import esHotel from "./locales/es/hotel.json";

import itSegnalazioni from "./locales/it/segnalazioni.json";
import deSegnalazioni from "./locales/de/segnalazioni.json";
import enSegnalazioni from "./locales/en/segnalazioni.json";
import frSegnalazioni from "./locales/fr/segnalazioni.json";
import bgSegnalazioni from "./locales/bg/segnalazioni.json";
import esSegnalazioni from "./locales/es/segnalazioni.json";

import itSondaggi from "./locales/it/sondaggi.json";
import deSondaggi from "./locales/de/sondaggi.json";
import enSondaggi from "./locales/en/sondaggi.json";
import frSondaggi from "./locales/fr/sondaggi.json";
import bgSondaggi from "./locales/bg/sondaggi.json";
import esSondaggi from "./locales/es/sondaggi.json";

import itRicette from "./locales/it/ricette.json";
import deRicette from "./locales/de/ricette.json";
import enRicette from "./locales/en/ricette.json";
import frRicette from "./locales/fr/ricette.json";
import bgRicette from "./locales/bg/ricette.json";
import esRicette from "./locales/es/ricette.json";

import itAnnunci from "./locales/it/annunci.json";
import deAnnunci from "./locales/de/annunci.json";
import enAnnunci from "./locales/en/annunci.json";
import frAnnunci from "./locales/fr/annunci.json";
import bgAnnunci from "./locales/bg/annunci.json";
import esAnnunci from "./locales/es/annunci.json";

import itChat from "./locales/it/chat.json";
import deChat from "./locales/de/chat.json";
import enChat from "./locales/en/chat.json";
import frChat from "./locales/fr/chat.json";
import bgChat from "./locales/bg/chat.json";
import esChat from "./locales/es/chat.json";

import itCase from "./locales/it/case.json";
import deCase from "./locales/de/case.json";
import enCase from "./locales/en/case.json";
import frCase from "./locales/fr/case.json";
import bgCase from "./locales/bg/case.json";
import esCase from "./locales/es/case.json";

import esCommon from "./locales/es/common.json";
import esStoria from "./locales/es/storia.json";
import esCastello from "./locales/es/castello.json";
import esFestivita from "./locales/es/festivita.json";
import esTurismo from "./locales/es/turismo.json";
import esMare from "./locales/es/mare.json";
import esMaps from "./locales/es/maps.json";
import esComune from "./locales/es/comune.json";
import esFarmacie from "./locales/es/farmacie.json";
import esVie from "./locales/es/vie.json";
import esFrancigena from "./locales/es/francigena.json";
import esEcologia from "./locales/es/ecologia.json";
import esChiese from "./locales/es/chiese.json";
import esWebcam from "./locales/es/webcam.json";
import esCuriosity from "./locales/es/curiosita.json";
import esTurista from "./locales/es/turista.json";

import itMondo from "./locales/it/mondo.json";
import deMondo from "./locales/de/mondo.json";
import enMondo from "./locales/en/mondo.json";
import frMondo from "./locales/fr/mondo.json";
import bgMondo from "./locales/bg/mondo.json";
import esMondo from "./locales/es/mondo.json";

import itAnziani from "./locales/it/anziani.json";
import enAnziani from "./locales/en/anziani.json";
import deAnziani from "./locales/de/anziani.json";
import frAnziani from "./locales/fr/anziani.json";
import bgAnziani from "./locales/bg/anziani.json";
import esAnziani from "./locales/es/anziani.json";
import itYouAlert from "./locales/it/youalert.json";
import enYouAlert from "./locales/en/youalert.json";
import deYouAlert from "./locales/de/youalert.json";
import frYouAlert from "./locales/fr/youalert.json";
import bgYouAlert from "./locales/bg/youalert.json";
import esYouAlert from "./locales/es/youalert.json";
import itRicetteUtenti from "./locales/it/ricetteUtenti.json";
import enRicetteUtenti from "./locales/en/ricetteUtenti.json";
import deRicetteUtenti from "./locales/de/ricetteUtenti.json";
import frRicetteUtenti from "./locales/fr/ricetteUtenti.json";
import bgRicetteUtenti from "./locales/bg/ricetteUtenti.json";
import esRicetteUtenti from "./locales/es/ricetteUtenti.json";
import itContapassi from "./locales/it/contapassi.json";
import deContapassi from "./locales/de/contapassi.json";
import enContapassi from "./locales/en/contapassi.json";
import frContapassi from "./locales/fr/contapassi.json";
import bgContapassi from "./locales/bg/contapassi.json";
import esContapassi from "./locales/es/contapassi.json";
import itRicordi from "./locales/it/ricordi.json";
import enRicordi from "./locales/en/ricordi.json";
import deRicordi from "./locales/de/ricordi.json";
import frRicordi from "./locales/fr/ricordi.json";
import bgRicordi from "./locales/bg/ricordi.json";
import esRicordi from "./locales/es/ricordi.json";
import itRistoranti from "./locales/it/ristoranti.json";
import enRistoranti from "./locales/en/ristoranti.json";
import deRistoranti from "./locales/de/ristoranti.json";
import frRistoranti from "./locales/fr/ristoranti.json";
import bgRistoranti from "./locales/bg/ristoranti.json";
import esRistoranti from "./locales/es/ristoranti.json";
import itLabirinto from "./locales/it/labirinto.json";
import enLabirinto from "./locales/en/labirinto.json";
import deLabirinto from "./locales/de/labirinto.json";
import frLabirinto from "./locales/fr/labirinto.json";
import bgLabirinto from "./locales/bg/labirinto.json";
import esLabirinto from "./locales/es/labirinto.json";
import itGioco3 from "./locales/it/gioco3.json";
import itGioco4 from "./locales/it/gioco4.json";
import enGioco3 from "./locales/en/gioco3.json";
import enGioco4 from "./locales/en/gioco4.json";
import deGioco3 from "./locales/de/gioco3.json";
import deGioco4 from "./locales/de/gioco4.json";
import frGioco3 from "./locales/fr/gioco3.json";
import frGioco4 from "./locales/fr/gioco4.json";
import bgGioco3 from "./locales/bg/gioco3.json";
import bgGioco4 from "./locales/bg/gioco4.json";
import esGioco3 from "./locales/es/gioco3.json";
import esGioco4 from "./locales/es/gioco4.json";

import itExtra from "./locales/it/extra.json";
import itQuiz from "./locales/it/quiz.json";
import itRicordiPairs from "./locales/it/ricordiPairs.json";
import enExtra from "./locales/en/extra.json";
import enQuiz from "./locales/en/quiz.json";
import enRicordiPairs from "./locales/en/ricordiPairs.json";
import deExtra from "./locales/de/extra.json";
import deQuiz from "./locales/de/quiz.json";
import deRicordiPairs from "./locales/de/ricordiPairs.json";
import frExtra from "./locales/fr/extra.json";
import frQuiz from "./locales/fr/quiz.json";
import frRicordiPairs from "./locales/fr/ricordiPairs.json";
import bgExtra from "./locales/bg/extra.json";
import bgQuiz from "./locales/bg/quiz.json";
import bgRicordiPairs from "./locales/bg/ricordiPairs.json";
import esExtra from "./locales/es/extra.json";
import esQuiz from "./locales/es/quiz.json";
import esRicordiPairs from "./locales/es/ricordiPairs.json";

export type Language = "it" | "de" | "en" | "fr" | "bg" | "es";

const savedLang =
  typeof window !== "undefined" ? (localStorage.getItem("lang") ?? "it") : "it";

i18n.use(initReactI18next).init({
  resources: {
    it: {
      mondo: itMondo,
      contapassi: itContapassi,
      ricordi: itRicordi,
      labirinto: itLabirinto,
      gioco3: itGioco3,
      gioco4: itGioco4,
      ristoranti: itRistoranti,
      anziani: itAnziani,
      youalert: itYouAlert,
      ricetteUtenti: itRicetteUtenti,
      common: itCommon, storia: itStoria, castello: itCastello, festivita: itFestivita,
      turismo: itTurismo, mare: itMare, maps: itMaps, comune: itComune,
      farmacie: itFarmacie, vie: itVie, francigena: itFrancigena, ecologia: itEcologia, chiese: itChiese, webcam: itWebcam, curiosita: itCuriosita, turista: itTurista, prodotti: itProdotti,
      hotel: itHotel, politica: itPolitica, segnalazioni: itSegnalazioni, sondaggi: itSondaggi, ricette: itRicette, annunci: itAnnunci, chat: itChat, case: itCase,
    },
    de: {
      mondo: deMondo,
      contapassi: deContapassi,
      ricordi: deRicordi,
      labirinto: deLabirinto,
      gioco3: deGioco3,
      gioco4: deGioco4,
      ristoranti: deRistoranti,
      anziani: deAnziani,
      youalert: deYouAlert,
      ricetteUtenti: deRicetteUtenti,
      common: deCommon, storia: deStoria, castello: deCastello, festivita: deFestivita,
      turismo: deTurismo, mare: deMare, maps: deMaps, comune: deComune,
      farmacie: deFarmacie, vie: deVie, francigena: deFrancigena, ecologia: deEcologia, chiese: deChiese, webcam: deWebcam, curiosita: deCuriosita, turista: deTurista, prodotti: deProdotti,
      hotel: deHotel, politica: dePolitica, segnalazioni: deSegnalazioni, sondaggi: deSondaggi, ricette: deRicette, annunci: deAnnunci, chat: deChat, case: deCase,
    },
    en: {
      mondo: enMondo,
      contapassi: enContapassi,
      ricordi: enRicordi,
      labirinto: enLabirinto,
      gioco3: enGioco3,
      gioco4: enGioco4,
      ristoranti: enRistoranti,
      anziani: enAnziani,
      youalert: enYouAlert,
      ricetteUtenti: enRicetteUtenti,
      common: enCommon, storia: enStoria, castello: enCastello, festivita: enFestivita,
      turismo: enTurismo, mare: enMare, maps: enMaps, comune: enComune,
      farmacie: enFarmacie, vie: enVie, francigena: enFrancigena, ecologia: enEcologia, chiese: enChiese, webcam: enWebcam, curiosita: enCuriosita, turista: enTurista, prodotti: enProdotti,
      hotel: enHotel, politica: enPolitica, segnalazioni: enSegnalazioni, sondaggi: enSondaggi, ricette: enRicette, annunci: enAnnunci, chat: enChat, case: enCase,
    },
    fr: {
      mondo: frMondo,
      contapassi: frContapassi,
      ricordi: frRicordi,
      labirinto: frLabirinto,
      gioco3: frGioco3,
      gioco4: frGioco4,
      ristoranti: frRistoranti,
      anziani: frAnziani,
      youalert: frYouAlert,
      ricetteUtenti: frRicetteUtenti,
      common: frCommon, storia: frStoria, castello: frCastello, festivita: frFestivita,
      turismo: frTurismo, mare: frMare, maps: frMaps, comune: frComune,
      farmacie: frFarmacie, vie: frVie, francigena: frFrancigena, ecologia: frEcologia, chiese: frChiese, webcam: frWebcam, curiosita: frCuriosita, turista: frTurista, prodotti: frProdotti,
      hotel: frHotel, politica: frPolitica, segnalazioni: frSegnalazioni, sondaggi: frSondaggi, ricette: frRicette, annunci: frAnnunci, chat: frChat, case: frCase,
    },
    bg: {
      mondo: bgMondo,
      contapassi: bgContapassi,
      ricordi: bgRicordi,
      labirinto: bgLabirinto,
      gioco3: bgGioco3,
      gioco4: bgGioco4,
      ristoranti: bgRistoranti,
      anziani: bgAnziani,
      youalert: bgYouAlert,
      ricetteUtenti: bgRicetteUtenti,
      common: bgCommon, storia: bgStoria, castello: bgCastello, festivita: bgFestivita,
      turismo: bgTurismo, mare: bgMare, maps: bgMaps, comune: bgComune,
      farmacie: bgFarmacie, vie: bgVie, francigena: bgFrancigena, ecologia: bgEcologia, chiese: bgChiese, webcam: bgWebcam, curiosita: bgCuriosita, turista: bgTurista, prodotti: bgProdotti,
      hotel: bgHotel, politica: bgPolitica, segnalazioni: bgSegnalazioni, sondaggi: bgSondaggi, ricette: bgRicette, annunci: bgAnnunci, chat: bgChat, case: bgCase,
    },
    es: {
      mondo: esMondo,
      contapassi: esContapassi,
      ricordi: esRicordi,
      labirinto: esLabirinto,
      gioco3: esGioco3,
      gioco4: esGioco4,
      ristoranti: esRistoranti,
      anziani: esAnziani,
      youalert: esYouAlert,
      ricetteUtenti: esRicetteUtenti,
      common: esCommon, storia: esStoria, castello: esCastello, festivita: esFestivita,
      turismo: esTurismo, mare: esMare, maps: esMaps, comune: esComune,
      farmacie: esFarmacie, vie: esVie, francigena: esFrancigena, ecologia: esEcologia,
      chiese: esChiese, webcam: esWebcam, curiosita: esCuriosity, turista: esTurista,
      prodotti: esProdotti, hotel: esHotel, politica: esPolitica, segnalazioni: esSegnalazioni, sondaggi: esSondaggi, ricette: esRicette, annunci: esAnnunci, chat: esChat, case: esCase,
    },
  },
  lng: savedLang,
  fallbackLng: "it",
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

// Testi di giochi, privacy, meteo e foto: namespace aggiunti qui per tutte le lingue delle bandiere.
  i18n.addResourceBundle("it", "extra", itExtra);
  i18n.addResourceBundle("it", "quiz", itQuiz);
  i18n.addResourceBundle("it", "ricordiPairs", itRicordiPairs);
  i18n.addResourceBundle("en", "extra", enExtra);
  i18n.addResourceBundle("en", "quiz", enQuiz);
  i18n.addResourceBundle("en", "ricordiPairs", enRicordiPairs);
  i18n.addResourceBundle("de", "extra", deExtra);
  i18n.addResourceBundle("de", "quiz", deQuiz);
  i18n.addResourceBundle("de", "ricordiPairs", deRicordiPairs);
  i18n.addResourceBundle("fr", "extra", frExtra);
  i18n.addResourceBundle("fr", "quiz", frQuiz);
  i18n.addResourceBundle("fr", "ricordiPairs", frRicordiPairs);
  i18n.addResourceBundle("bg", "extra", bgExtra);
  i18n.addResourceBundle("bg", "quiz", bgQuiz);
  i18n.addResourceBundle("bg", "ricordiPairs", bgRicordiPairs);
  i18n.addResourceBundle("es", "extra", esExtra);
  i18n.addResourceBundle("es", "quiz", esQuiz);
  i18n.addResourceBundle("es", "ricordiPairs", esRicordiPairs);

export default i18n;
