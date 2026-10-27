import { useState, useEffect, useRef, useCallback } from 'react';
import './Admin.css';

interface RegisteredUser {
  id: string;
  name: string;
  role: string;
  created_at: string;
  photo_count: number;
}

interface Stats {
  total_users: number;
  total_photos: number;
  engine: string;
  metric: string;
}

const API_BASE = 'http://127.0.0.1:5000';

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [addStatus, setAddStatus] = useState<{ type: string; msg: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/users`),
        fetch(`${API_BASE}/api/admin/stats`)
      ]);
      const usersData = await usersRes.json();
      const statsData = await statsRes.json();
      if (usersData.status === 'success') setUsers(usersData.users);
      if (statsData.status === 'success') setStats(statsData.stats);
    } catch (err) {
      console.error('Veri çekme hatası:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      setCapturedImage(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });

      streamRef.current = stream;

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.error("Oynatma hatası:", e));
        }
      }, 100);

    } catch (err) {
      console.error("Kamera hatası:", err);
      setAddStatus({ type: 'error', msg: 'Kamera erişimi başarısız.' });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleAddUser = async () => {
    if (!newName.trim()) {
      setAddStatus({ type: 'error', msg: 'İsim alanı boş bırakılamaz.' });
      return;
    }
    if (!capturedImage) {
      setAddStatus({ type: 'error', msg: 'Lütfen bir fotoğraf çekin.' });
      return;
    }

    setAddStatus({ type: 'loading', msg: 'Yüz kaydediliyor...' });

    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          role: newRole,
          image: capturedImage
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setAddStatus({ type: 'success', msg: `✅ ${newName} başarıyla kaydedildi!` });
        setNewName('');
        setNewRole('user');
        setCapturedImage(null);
        fetchData();
        setTimeout(() => {
          setShowAddModal(false);
          setAddStatus(null);
        }, 1500);
      } else {
        setAddStatus({ type: 'error', msg: data.message || 'Kayıt başarısız.' });
      }
    } catch (err) {
      setAddStatus({ type: 'error', msg: 'Sunucu bağlantı hatası.' });
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchData();
      }
    } catch (err) {
      console.error('Silme hatası:', err);
    }
    setDeleteConfirm(null);
  };

  const closeModal = () => {
    stopCamera();
    setShowAddModal(false);
    setAddStatus(null);
    setCapturedImage(null);
    setNewName('');
    setNewRole('user');
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      admin: '👑 Admin',
      user: '👤 Kullanıcı',
      vip: '⭐ VIP',
      security: '🛡️ Güvenlik'
    };
    return roles[role] || role;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <button className="back-btn" onClick={onBack}>
            <span className="back-icon">←</span>
            <span>Ana Sayfa</span>
          </button>
          <div className="admin-title">
            <h1>🛡️ Yüz Tanıma Yönetim Paneli</h1>
            <p className="admin-subtitle">DeepFace Biyometrik Sistemi</p>
          </div>
        </div>
        <button className="add-user-btn" onClick={() => { setShowAddModal(true); }}>
          <span className="plus-icon">+</span>
          Yeni Yüz Kaydet
        </button>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-users">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.total_users ?? '—'}</span>
            <span className="stat-label">Kayıtlı Kullanıcı</span>
          </div>
        </div>
        <div className="stat-card stat-photos">
          <div className="stat-icon">📸</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.total_photos ?? '—'}</span>
            <span className="stat-label">Referans Fotoğraf</span>
          </div>
        </div>
        <div className="stat-card stat-engine">
          <div className="stat-icon">🧠</div>
          <div className="stat-info">
            <span className="stat-value">VGG-Face</span>
            <span className="stat-label">AI Model</span>
          </div>
        </div>
        <div className="stat-card stat-metric">
          <div className="stat-icon">📐</div>
          <div className="stat-info">
            <span className="stat-value">Cosine</span>
            <span className="stat-label">Mesafe Metriği</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-section">
        <div className="section-header">
          <h2>Kayıtlı Kullanıcılar</h2>
          <button className="refresh-btn" onClick={fetchData}>
            🔄 Yenile
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Veriler yükleniyor...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>Henüz Kayıtlı Yüz Yok</h3>
            <p>Sisteme giriş yapabilmek için en az bir yüz kaydı oluşturun.</p>
            <button className="add-user-btn" onClick={() => setShowAddModal(true)}>
              + İlk Yüzü Kaydet
            </button>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ad Soyad</th>
                  <th>Rol</th>
                  <th>Fotoğraf</th>
                  <th>Kayıt Tarihi</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                    <td>
                      <code className="user-id">{user.id}</code>
                    </td>
                    <td>
                      <div className="user-name-cell">
                        <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td>
                      <span className="photo-count">{user.photo_count} 📷</span>
                    </td>
                    <td className="date-cell">{formatDate(user.created_at)}</td>
                    <td>
                      {deleteConfirm === user.id ? (
                        <div className="delete-confirm">
                          <button className="confirm-yes" onClick={() => handleDelete(user.id)}>
                            Evet, Sil
                          </button>
                          <button className="confirm-no" onClick={() => setDeleteConfirm(null)}>
                            İptal
                          </button>
                        </div>
                      ) : (
                        <button
                          className="delete-btn"
                          onClick={() => setDeleteConfirm(user.id)}
                        >
                          🗑️ Sil
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🆕 Yeni Kullanıcı Kaydet</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="modal-body">
              {/* Form Fields */}
              <div className="form-group">
                <label htmlFor="userName">Ad Soyad</label>
                <input
                  id="userName"
                  type="text"
                  placeholder="Örn: İsmail Eren"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="userRole">Rol</label>
                <select
                  id="userRole"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="form-select"
                >
                  <option value="admin">👑 Admin</option>
                  <option value="user">👤 Kullanıcı</option>
                  <option value="vip">⭐ VIP</option>
                  <option value="security">🛡️ Güvenlik</option>
                </select>
              </div>

              {/* Camera Section */}
              <div className="camera-section">
                <label>Yüz Fotoğrafı</label>

                {!isCapturing && !capturedImage && (
                  <button className="camera-start-btn" onClick={startCamera}>
                    📷 Kamerayı Aç
                  </button>
                )}

                {isCapturing && (
                  <div className="camera-preview">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="camera-video"
                    />
                    <div className="face-guide">
                      <div className="face-oval"></div>
                    </div>
                    <button className="capture-btn" onClick={capturePhoto}>
                      📸 Fotoğraf Çek
                    </button>
                  </div>
                )}

                {capturedImage && (
                  <div className="captured-preview">
                    <img src={capturedImage} alt="Çekilen fotoğraf" className="captured-img" />
                    <div className="captured-actions">
                      <span className="captured-ok">✅ Fotoğraf hazır</span>
                      <button className="retake-btn" onClick={startCamera}>
                        🔄 Tekrar Çek
                      </button>
                    </div>
                  </div>
                )}

                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>

              {/* Status Message */}
              {addStatus && (
                <div className={`add-status ${addStatus.type}`}>
                  {addStatus.type === 'loading' && <div className="mini-spinner"></div>}
                  {addStatus.msg}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeModal}>İptal</button>
              <button
                className="save-btn"
                onClick={handleAddUser}
                disabled={!newName.trim() || !capturedImage || addStatus?.type === 'loading'}
              >
                💾 Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}