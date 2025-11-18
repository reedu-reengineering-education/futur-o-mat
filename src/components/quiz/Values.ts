export const VALUE_TO_PART_ID: Record<string, string> = {
  GEMEINSINN: "values_waage",
  NACHHALTIGKEIT: "values_weltkugel",
  HARMONIE: "values_yin_yang",
  VIELFALT: "values_vielfalt",
  PARTIZIPATION: "values_handschlag",
  TRANSPARENZ: "values_prisma",
  MACHT: "values_krone",
  LEISTUNG: "values_pokal",
  GENUSS: "values_eis",
  ABENTEUER: "values_berggipfel",
  SELBSTBESTIMMUNG: "values_fluegel",
  SICHERHEIT: "values_schloss",
  TRADITION: "values_familienwappen",
  KONFORMITAET: "values_konformitaet",
};

export const STRENGTH_TO_PART_ID: Record<string, string> = {
  EMPATHIE: "strengths_herz",
  SYSTEMISCHES_DENKEN: "strengths_puzzle",
  LERNKOMPETENZ: "strengths_aufgeschlagenes_buch",
  TEAMFAEHIGKEIT: "strengths_zahnraeder",
  PROJEKTMANAGEMENT: "strengths_klemmbrett",
  KONFLIKTMANAGEMENT: "strengths_taube",
  PROBLEMLOESEFAEHIGKEIT: "strengths_gluehbirne",
  MUT_ZUR_VERAENDERUNG: "strengths_schmetterling",
  KREATIVITAET: "strengths_farbpalette",
  KRITISCHES_DENKEN: "strengths_lupe",
  KOMMUNIKATIONSFAEHIGKEIT: "strengths_mikrophon",
  VERANTWORTUNGSBEWUSSTSEIN: "strengths_kompass",
  HUMOR: "strengths_luftballon",
  AUSDAUER: "strengths_karte",
  DIGITALE_KOMPETENZEN: "strengths_smartphone",
  SPORTLICHKEIT: "strengths_hantel",
};

export const VALUE_INFO: Record<
  string,
  { title: string; description: string }
> = {
  GEMEINSINN: {
    title: "Gemeinsinn / Gerechtigkeitssinn",
    description:
      "Du hast einen ausgeprägten Gerechtigkeitssinn und setzt dich für faire Bedingungen ein. Ethik und das Wohl der Gemeinschaft stehen für dich im Vordergrund.",
  },
  NACHHALTIGKEIT: {
    title: "Nachhaltigkeit",
    description:
      "Dir liegt die Umwelt am Herzen und du handelst verantwortungsbewusst für künftige Generationen. Du denkst langfristig und ökologisch.",
  },
  HARMONIE: {
    title: "Harmonie",
    description:
      "Du strebst nach Balance und friedlichem Miteinander. Konflikte zu vermeiden und Ausgleich zu schaffen ist dir wichtig.",
  },
  VIELFALT: {
    title: "Vielfalt",
    description:
      "Du schätzt Unterschiedlichkeit und siehst in Vielfalt eine Bereicherung. Inklusion und Diversität sind dir wichtige Werte.",
  },
  ABENTEUER: {
    title: "Abenteuer",
    description:
      "Du liebst neue Herausforderungen und gehst gerne innovative Wege. Das Unbekannte reizt dich und du bist offen für Neues.",
  },
  LEISTUNG: {
    title: "Leistung",
    description:
      "Du strebst nach Exzellenz und setzt dir hohe Ziele. Erfolg und das Erreichen von Leistungen motivieren dich.",
  },
};

export const STRENGTH_INFO: Record<
  string,
  { title: string; description: string }
> = {
  EMPATHIE: {
    title: "Empathie",
    description:
      "Du kannst dich gut in andere hineinversetzen und verstehst ihre Gefühle. Diese Fähigkeit hilft dir im Umgang mit Menschen.",
  },
  KRITISCHES_DENKEN: {
    title: "Kritisches Denken",
    description:
      "Du hinterfragst Dinge und analysierst sie von verschiedenen Perspektiven. Du erkennst Zusammenhänge und denkst differenziert.",
  },
  TEAMFAEHIGKEIT: {
    title: "Teamfähigkeit und Netzwerken",
    description:
      "Du arbeitest gerne mit anderen zusammen und bringst dich ins Team ein. Du kannst Netzwerke aufbauen und pflegen.",
  },
  KREATIVITAET: {
    title: "Kreativität und Flexibilität",
    description:
      "Du findest originelle Lösungen und denkst außerhalb der Box. Flexibel passt du dich an neue Situationen an.",
  },
  PROJEKTMANAGEMENT: {
    title: "Projektmanagement",
    description:
      "Du kannst komplexe Aufgaben strukturieren und strategisch planen. Organisation und Zielorientierung sind deine Stärken.",
  },
  SYSTEMISCHES_DENKEN: {
    title: "Systemisches Denken",
    description:
      "Du erkennst komplexe Zusammenhänge und verstehst, wie Systeme funktionieren. Du urteilst differenziert.",
  },
};
