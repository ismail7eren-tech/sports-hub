import os
import cv2
import base64
import numpy as np
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from face_engine import FaceEngine
from dotenv import load_dotenv

# Ortam değişkenlerini yükle
load_dotenv()

app = Flask(__name__)

# Frontend (React/Angular) ile iletişimde sorun yaşamamak için CORS ayarı
CORS(app)

# Loglama ayarları (Format hatası düzeltildi)
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Yüz tanıma motorunu başlat
engine = FaceEngine()


@app.route("/api/auth/local", methods=["GET"])
def authenticate_local():
    """Sadece geliştiricinin bilgisayarında (sunucu kamerasından) hızlı test yapmak için"""
    try:
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            logger.error("Kamera donanımına erişilemedi.")
            return jsonify({"status": "error", "message": "Kamera bulunamadı."}), 500

        ret, frame = cap.read()
        cap.release()

        if not ret:
            logger.error("Kameradan görüntü alınamadı.")
            return jsonify({"status": "error", "message": "Görüntü okunamadı."}), 500

        is_verified = engine.verify_face(frame)

        if is_verified:
            logger.info("GİRİŞ BAŞARILI: Yüz doğrulandı.")
            return jsonify(
                {"status": "success", "user": "İsmail Eren", "message": "Hoş geldin!"}
            )

        logger.warning("GİRİŞ REDDEDİLDİ: Yüz eşleşmedi.")
        return jsonify({"status": "failed", "message": "Kimlik doğrulanamadı."}), 401

    except Exception as e:
        logger.error(f"Sistem hatası: {str(e)}")
        return (
            jsonify({"status": "error", "message": "İşlem sırasında bir hata oluştu."}),
            500,
        )


@app.route("/api/auth/web", methods=["POST"])
def authenticate_web():
    """React vb. web önyüzünden gelen Base64 fotoğrafları doğrulamak için (Asıl profesyonel yöntem)"""
    try:
        data = request.get_json()
        if not data or "image" not in data:
            return jsonify({"status": "error", "message": "Görüntü verisi eksik."}), 400

        # Base64 verisini OpenCV formatına çevir (Frontend'den "data:image/jpeg;base64,..." şeklinde gelir)
        image_data = (
            data["image"].split(",")[1] if "," in data["image"] else data["image"]
        )
        image_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"status": "error", "message": "Görüntü işlenemedi."}), 400

        # DeepFace motoruna gönder
        is_verified = engine.verify_face(frame)

        if is_verified:
            logger.info("WEB GİRİŞİ BAŞARILI: Yüz eşleşti.")
            return jsonify(
                {"status": "success", "user": "İsmail Eren", "message": "Hoş geldin!"}
            )

        logger.warning("WEB GİRİŞİ REDDEDİLDİ: Eşleşme yok.")
        return jsonify({"status": "failed", "message": "Kimlik doğrulanamadı."}), 401

    except Exception as e:
        logger.error(f"Web API hatası: {str(e)}")
        return jsonify({"status": "error", "message": "Sunucu hatası."}), 500


if __name__ == "__main__":
    logger.info("-" * 40)
    logger.info("🚀 SportsHUB DeepFace Backend Başlatılıyor...")
    logger.info("-" * 40)

    port = int(os.getenv("PORT", 5000))
    debug_mode = os.getenv("FLASK_DEBUG", "False").lower() == "true"

    app.run(port=port, debug=debug_mode)
