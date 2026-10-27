const API_TOKEN = import.meta.env.VITE_FOOTBALL_DATA_TOKEN;
const BASE_URL = 'https://api.football-data.org/v4';

// Takımların Football-Data ID'leri
const TEAM_IDS: Record<string, number> = {
    "Galatasaray": 610,
    "Fenerbahçe": 611,
    "Beşiktaş": 613,
    "Trabzonspor": 615
};

export const getTeamData = async (teamName: string) => {
    const teamId = TEAM_IDS[teamName];
    if (!teamId) return null;

    try {
        const response = await fetch(`${BASE_URL}/teams/${teamId}`, {
            headers: {
                'X-Auth-Token': API_TOKEN ?? ''
            }
        });

        if (!response.ok) throw new Error(`API Hatası: ${response.status}`);

        const data = await response.json();

        return {
            venue: data.venue || 'Bilinmiyor',
            coach: data.coach?.name || 'Teknik Heyet',
            squad: data.squad ? data.squad.slice(0, 11).map((p: any) => p.name) : []
        };
    } catch (error) {
        console.error('[ERR] Football-Data API verisi alınamadı:', error);
        return null;
    }
};