export function generateFakeTeam(teamName: string) {
  const coaches = [
    "Marco Silva",
    "Luis Enrique",
    "Unai Emery",
    "Xavi Hernandez",
    "Carlo Ancelotti",
    "Jose Mourinho",
    "Pep Guardiola",
    "Simone Inzaghi"
  ];

  const players = [
    "Alex Moreno",
    "Lucas Fernandez",
    "Daniel Costa",
    "Marco Rossi",
    "Julian Alvarez",
    "Nicolas Gomez",
    "Pedro Silva",
    "Matteo Ricci",
    "Andre Santos",
    "Victor Lopez",
    "Bruno Araujo"
  ];

  const matches = [
    `${teamName} 2-1 Rakip`,
    `${teamName} 1-1 Rakip`,
    `Rakip 0-3 ${teamName}`
  ];

  return {
    coach: coaches[Math.floor(Math.random() * coaches.length)],
    squad: players.sort(() => 0.5 - Math.random()).slice(0, 9),
    lastMatches: matches,
    injured: Math.random() > 0.6 ? ["Oyuncu X"] : []
  };
}
