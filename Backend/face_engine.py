import os
import cv2
import json
import uuid
import base64
import numpy as np
from deepface import DeepFace


class FaceEngine:
    def __init__(self):
        # Yüz veritabanı klasörü
        self.db_path = "faces"
        self.registry_file = os.path.join(self.db_path, "registry.json")

        # Klasörü oluştur
        os.makedirs(self.db_path, exist_ok=True)

        # Registry dosyasını yükle veya oluştur
        if not os.path.exists(self.registry_file):
            self._save_registry({})

        print(f"[INFO] Kayıtlı yüz sayısı: {len(self._load_registry())}")

    def _load_registry(self):
        """Kayıt defterini yükle"""
        try:
            with open(self.registry_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}

    def _save_registry(self, registry):
        """Kayıt defterini kaydet"""
        with open(self.registry_file, "w", encoding="utf-8") as f:
            json.dump(registry, f, ensure_ascii=False, indent=2)

    def get_registered_users(self):
        """Kayıtlı kullanıcıları listele"""
        registry = self._load_registry()
        users = []
        for user_id, data in registry.items():
            users.append(
                {
                    "id": user_id,
                    "name": data["name"],
                    "role": data.get("role", "user"),
                    "created_at": data.get("created_at", ""),
                    "photo_count": len(data.get("photos", [])),
                }
            )
        return users

    def add_user(self, name, role, image_data):
        """Yeni kullanıcı ekle (base64 fotoğraf ile)"""
        registry = self._load_registry()
        user_id = str(uuid.uuid4())[:8]

        # Base64'ten resim dosyasına dönüştür
        if "," in image_data:
            image_data = image_data.split(",")[1]

        image_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return None, "Görüntü işlenemedi"

        # Yüz algılama kontrolü
        try:
            faces = DeepFace.extract_faces(
                img_path=frame, detector_backend="opencv", enforce_detection=True
            )
            if not faces:
                return None, "Fotoğrafta yüz algılanamadı"
        except Exception as e:
            return None, f"Yüz algılama hatası: {str(e)}"

        # Fotoğrafı kaydet
        photo_filename = f"{user_id}_1.jpg"
        photo_path = os.path.join(self.db_path, photo_filename)
        cv2.imwrite(photo_path, frame)

        # Registry'ye ekle
        from datetime import datetime

        registry[user_id] = {
            "name": name,
            "role": role,
            "created_at": datetime.now().isoformat(),
            "photos": [photo_filename],
        }
        self._save_registry(registry)

        return user_id, "Kullanıcı başarıyla kaydedildi"

    def remove_user(self, user_id):
        """Kullanıcıyı sil"""
        registry = self._load_registry()
        if user_id not in registry:
            return False, "Kullanıcı bulunamadı"

        # Fotoğrafları sil
        for photo in registry[user_id].get("photos", []):
            photo_path = os.path.join(self.db_path, photo)
            if os.path.exists(photo_path):
                os.remove(photo_path)

        # Registry'den kaldır
        del registry[user_id]
        self._save_registry(registry)

        return True, "Kullanıcı silindi"

    def verify_face(self, frame):
        """Gelen yüzü tüm kayıtlı kullanıcılarla karşılaştır"""
        registry = self._load_registry()

        if not registry:
            print("[WARN] Kayıtlı kullanıcı yok!")
            return False, None

        temp_path = "temp_capture.jpg"

        try:
            cv2.imwrite(temp_path, frame)

            for user_id, data in registry.items():
                for photo in data.get("photos", []):
                    ref_path = os.path.join(self.db_path, photo)
                    if not os.path.exists(ref_path):
                        continue

                    try:
                        result = DeepFace.verify(
                            img1_path=temp_path,
                            img2_path=ref_path,
                            model_name="VGG-Face",
                            distance_metric="cosine",
                            enforce_detection=False,
                            detector_backend="opencv",
                        )

                        dist = result.get("distance", 0)
                        thresh = result.get("threshold", 0)
                        print(
                            f"[DEBUG] {data['name']} -> Skor: {dist:.4f} / Limit: {thresh:.4f}"
                        )

                        if result.get("verified", False):
                            return True, data["name"]

                    except Exception as e:
                        print(f"[WARN] {data['name']} karşılaştırma hatası: {e}")
                        continue

            return False, None

        except Exception as e:
            print(f"[ERR] DeepFace: {e}")
            return False, None

        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
