import { useState } from 'react';
import './App.css';
import { getTeamData } from './services/api';
import AdminPanel from './Admin';

const SUPER_LIG_TEAMS = [
  { id: 610, name: "Galatasaray", logo: "🦁", color: "#eab308" },
  { id: 611, name: "Fenerbahçe", logo: "🐦", color: "#3b82f6" },
  { id: 613, name: "Beşiktaş", logo: "🦅", color: "#94a3b8" },
  { id: 615, name: "Trabzonspor", logo: "🌊", color: "#f43f5e" }
];

const DEFAULT_SQUADS: Record<string, string[]> = {
  "Galatasaray": ["Muslera", "Davinson Sanchez", "Abdülkerim Bardakcı", "Torreira", "Lemina", "Sane", "Barış Alper", "Yunus Akgün", "Sara", "Icardi", "Osimhen"],
  "Fenerbahçe": ["Ederson", "Skriniar", "Oosterwolde", "Fred", "İsmail Yüksek", "Talisca", "Tadić", "Szymański", "En-Nesyri", "Dzeko", "Maximin"],
  "Beşiktaş": ["Mert Günok", "Paulista", "Masuaku", "Orkun Kökçü", "Ndidi", "Rafa Silva", "Rashica", "Muçi", "Immobile", "El Bilal", "Semih Kılıçsoy"],
  "Trabzonspor": ["Uğurcan Çakır", "Savic", "Benshabini", "Mendy", "Ozan Tufan", "Zubkov", "Visca", "Dragus", "Onuachu", "Banza", "Cham"]
};

export default function App() {
  const [currentView, setCurrentView] = useState<'main' | 'admin'>('main');
  const [faceOK, setFaceOK] = useState(false);
  const [status, setStatus] = useState("Sistem Kilitli");
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (currentView === 'admin') {
    return <AdminPanel onBack={() => setCurrentView('main')} />;
  }

  const handleFaceID = async () => {
    setStatus("Biyometrik Veriler İşleniyor...");
    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/local");
      if (res.ok) {
        const data = await res.json();
        if (data.status === "success") {
          setFaceOK(true);
          setStatus(`Erişim Verildi: ${data.user}`);
        } else {
          setStatus("Kimlik Doğrulanamadı!");
        }
      } else {
        setStatus("Yüz Eşleşmedi!");
      }
    } catch (err) {
      setStatus("Sunucu Bağlantı Hatası!");
    }
  };

  const handleTeamSelect = async (team: any) => {
    setSelectedTeam(team);
    setLoading(true);

    const apiRes = await getTeamData(team.name);

    if (apiRes && apiRes.squad.length > 0) {
      setTeamData({
        info: {
          venue: { name: apiRes.venue, city: team.name === "Trabzonspor" ? "Trabzon" : "İstanbul" },
          manager: { name: apiRes.coach }
        },
        players: apiRes.squad
      });
    } else {
      setTeamData({
        info: {
          venue: {
            name: team.name === "Galatasaray" ? "RAMS Park" : team.name === "Fenerbahçe" ? "Şükrü Saracoğlu" : team.name === "Beşiktaş" ? "Tüpraş Stadyumu" : "Papara Park",
            city: team.name === "Trabzonspor" ? "Trabzon" : "İstanbul"
          },
          manager: { name: "Teknik Heyet" }
        },
        players: DEFAULT_SQUADS[team.name] || []
      });
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-badge">AI</div>
          <div className="brand-text">
            <h1>SportsHUB</h1>
            <span>Güvenlik Protokolü</span>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('admin')}
          className="admin-nav-btn"
        >
          <span className="btn-icon">⚙️</span> Yönetici Paneli
        </button>

        <div className={`auth-card ${faceOK ? 'unlocked' : ''}`}>
          <div className="biometric-avatar">
            {faceOK ? "🔓" : "🛡️"}
          </div>
          <button onClick={handleFaceID} className="auth-btn">
            {faceOK ? "Oturum Açık" : "FaceID ile Doğrula"}
          </button>
          <p className="status-label">{status}</p>
        </div>

        {faceOK && (
          <nav className="team-navigation">
            <label className="nav-label">SÜPER LİG TAKIMLARI</label>
            <div className="team-btn-group">
              {SUPER_LIG_TEAMS.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleTeamSelect(t)}
                  className={`team-select-btn ${selectedTeam?.id === t.id ? "active" : ""}`}
                >
                  <span className="team-emoji">{t.logo}</span>
                  <span className="team-name">{t.name}</span>
                </button>
              ))}
            </div>
          </nav>
        )}
      </aside>

      <main className="content-area">
        {!faceOK ? (
          <div className="lock-screen">
            <div className="lock-card">
              <div className="shield-logo">🔒</div>
              <h2>Erişim Kısıtlandı</h2>
              <p>Süper Lig canlı taktik analiz verilerine erişmek için biyometrik yüz doğrulamasını tamamlayın.</p>
            </div>
          </div>
        ) : selectedTeam ? (
          <div className="analysis-page">
            <header className="team-hero">
              <div className="team-badge-large">{selectedTeam.logo}</div>
              <div className="team-title-block">
                <h1>{selectedTeam.name}</h1>
                <p>Football-Data Canlı Veri Akışı</p>
              </div>
            </header>

            <div className="dashboard-grid">
              <div className="card tactic-board">
                <div className="card-header">
                  <h3>📋 Güncel Kadro (İlk 11)</h3>
                </div>
                {loading ? (
                  <div className="loading-state">Veriler yükleniyor...</div>
                ) : (
                  <div className="pitch-preview">
                    {teamData?.players?.length > 0 ? (
                      teamData.players.map((p: string, idx: number) => (
                        <div key={idx} className="player-tag">
                          <span className="player-num">{idx + 1}</span>
                          <span className="player-name">{p}</span>
                        </div>
                      ))
                    ) : (
                      <p className="no-data">Kadro bilgisi alınamadı.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="card scout-report">
                <div className="card-header">
                  <h3>🔍 Takım Detayları</h3>
                </div>
                {loading ? (
                  <div className="loading-state">Yükleniyor...</div>
                ) : (
                  <div className="info-list">
                    <div className="info-item">
                      <span className="info-label">Stadyum</span>
                      <span className="info-val">{teamData?.info?.venue?.name || 'Bilinmiyor'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Şehir</span>
                      <span className="info-val">{teamData?.info?.venue?.city || 'Bilinmiyor'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Teknik Direktör</span>
                      <span className="info-val">{teamData?.info?.manager?.name || 'Teknik Heyet'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="welcome-hero">
            <div className="welcome-card">
              <h2>Sistem Doğrulandı ✅</h2>
              <p>Sol taraftaki menüden analiz etmek istediğiniz takımı seçin.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}