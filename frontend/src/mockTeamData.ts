export type TeamInfo = {
  coach: string;
  squad: string[];
  lastMatches: string[];
  injured: string[];
};

export const mockTeamData: Record<string, TeamInfo> = {
  // SÜPER LİG
  Galatasaray: {
    coach: "Okan Buruk",
    squad: ["Muslera", "Icardi", "Torreira", "Zaha"],
    lastMatches: ["GS 2-1 FB", "GS 3-0 BJK"],
    injured: ["Ziyech"]
  },
  Fenerbahçe: {
    coach: "İsmail Kartal",
    squad: ["Livakovic", "Dzeko", "Tadic", "Fred"],
    lastMatches: ["FB 1-2 GS", "FB 4-1 ADS"],
    injured: []
  },

  // PREMIER LEAGUE
  "Manchester City": {
    coach: "Pep Guardiola",
    squad: ["Haaland", "De Bruyne", "Foden", "Rodri"],
    lastMatches: ["MCI 3-1 ARS", "MCI 2-0 LIV"],
    injured: []
  },
  Arsenal: {
    coach: "Mikel Arteta",
    squad: ["Saka", "Odegaard", "Rice", "Jesus"],
    lastMatches: ["ARS 1-0 CHE", "ARS 1-3 MCI"],
    injured: ["Timber"]
  },

  // LA LIGA
  "Real Madrid": {
    coach: "Carlo Ancelotti",
    squad: ["Bellingham", "Vinicius", "Modric", "Kroos"],
    lastMatches: ["RMA 2-1 BAR", "RMA 3-0 SEV"],
    injured: []
  },
  Barcelona: {
    coach: "Xavi",
    squad: ["Lewandowski", "Pedri", "Gundogan", "Araujo"],
    lastMatches: ["BAR 1-2 RMA", "BAR 2-0 VAL"],
    injured: ["De Jong"]
  }
};
