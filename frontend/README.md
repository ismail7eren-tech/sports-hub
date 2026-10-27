# 🛡️ SportsHUB | AI-Powered Facial Recognition & Football Analytics

**SportsHUB** is a full-stack web application developed as a course project during my Computer Programming studies at Istanbul Kültür University. The project combines AI-powered facial recognition with football data integration, bringing authentication and sports analytics together in a modern web interface.

**SportsHUB**, İstanbul Kültür Üniversitesi Bilgisayar Programcılığı eğitimim sırasında bir ders projesi olarak geliştirdiğim, yapay zekâ destekli yüz tanıma teknolojisini futbol verileriyle birleştiren full-stack bir web uygulamasıdır.

---

## 🇹🇷 Türkçe

### 📌 Proje Hakkında

SportsHUB, yüz tanıma tabanlı kullanıcı doğrulama ve futbol verilerinin görselleştirilmesini tek bir platformda bir araya getirmeyi amaçlayan bir web projesidir.

Proje kapsamında React ve TypeScript kullanılarak modern bir kullanıcı arayüzü, Python ve Flask ile bir backend servisi geliştirilmiştir. OpenCV ve DeepFace kütüphaneleri yüz tanıma süreçlerinde kullanılırken, Football-Data.org API üzerinden futbol verilerine erişim sağlanması hedeflenmiştir.

Bu çalışma sayesinde frontend ve backend entegrasyonu, harici API kullanımı, bilgisayarlı görü ve yapay zekâ kütüphanelerinin web uygulamalarına entegrasyonu gibi konularda pratik deneyim kazanılması amaçlanmıştır.

### ✨ Temel Özellikler

- **Yüz Tanıma ve Doğrulama:** OpenCV ve DeepFace kullanılarak yüz görüntülerinin işlenmesi ve yüz eşleştirme süreçlerinin uygulanması.
- **Futbol Verileri:** Football-Data.org API entegrasyonu aracılığıyla futbol verilerine erişim.
- **Yönetici Paneli:** Kullanıcı ve yüz kayıtlarının yönetilmesi, kullanıcı rollerinin düzenlenmesi için yönetim arayüzü.
- **Kamera Entegrasyonu:** Tarayıcı kamerası üzerinden yüz görüntüsü alma.
- **Modern Kullanıcı Arayüzü:** React, TypeScript ve Vite ile geliştirilen koyu temalı, modüler arayüz.
- **Ortam Değişkenleri:** API anahtarları ve yapılandırma bilgilerinin `.env` dosyası üzerinden yönetilmesi.

### 🛠️ Teknolojiler

| Alan | Teknolojiler |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Python, Flask |
| Yapay Zekâ ve Görüntü İşleme | OpenCV, DeepFace |
| Yüz Tanıma Modeli | VGG-Face |
| Veri Entegrasyonu | Football-Data.org REST API |
| Stil ve Arayüz | CSS3, Responsive UI |
| Yapılandırma | Environment Variables (`.env`) |

### 🏗️ Proje Mimarisi

SportsHUB, frontend ve backend katmanlarının ayrı geliştirildiği bir mimari kullanır.

- **Frontend:** Kullanıcı arayüzü, kamera etkileşimleri ve futbol verilerinin sunulması.
- **Backend:** Flask üzerinden yüz tanıma işlemlerinin ve ilgili uygulama mantığının yürütülmesi.
- **Harici API:** Futbol verilerinin üçüncü taraf bir servis üzerinden alınması.

### 🚀 Kurulum ve Çalıştırma

**Gereksinimler:** Python, Node.js ve npm.

#### 1. Backend

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Linux / macOS:

```bash
source .venv/bin/activate
```

Bağımlılıkları yükleyip backend'i başlat:

```bash
pip install -r requirements.txt
python app.py
```

#### 2. Frontend

Yeni bir terminal aç:

```bash
cd frontend
npm install
npm run dev
```

Vite tarafından belirtilen yerel adresi tarayıcıda açarak arayüze erişebilirsin.

### ⚙️ Yapılandırma

API anahtarları gibi hassas bilgileri kaynak koduna doğrudan eklemek yerine ortam değişkenleri üzerinden yapılandır.

Projenin ihtiyaçlarına göre `.env` dosyasını oluştur ve gerekli değişkenleri tanımla. Gerçek API anahtarlarını herkese açık depolarda paylaşma.

### 🎯 Projenin Amacı

Bu projenin amacı, modern frontend teknolojilerini Python tabanlı backend geliştirme, yapay zekâ destekli görüntü işleme ve harici API entegrasyonuyla bir araya getirerek full-stack web geliştirme alanındaki bilgi ve becerileri geliştirmektir.

### 👨‍💻 Geliştirici

**İsmail Eren Demirci**

Computer Programming | Full-Stack Development | AI & Computer Vision

---

## 🇬🇧 English

### 📌 About the Project

SportsHUB is a web application developed as a course project during my Computer Programming studies at Istanbul Kültür University. It brings together facial recognition, backend development, and football data integration within a modern web interface.

The project uses React and TypeScript for the frontend and Python with Flask for backend services. OpenCV and DeepFace are used for facial image processing and face matching, while the Football-Data.org API provides access to football-related data.

The main goal of the project is to gain practical experience in full-stack development, computer vision, AI library integration, and communication between frontend applications, backend services, and external APIs.

### ✨ Key Features

- **Facial Recognition:** Facial image processing and face matching using OpenCV and DeepFace.
- **Football Data Integration:** Access to football-related data through the Football-Data.org API.
- **Admin Panel:** An interface for managing user records, facial data, and user roles.
- **Camera Integration:** Capturing facial images through the browser camera.
- **Modern UI:** A dark-themed, modular interface built with React, TypeScript, and Vite.
- **Environment Configuration:** Managing API keys and application settings through environment variables.

### 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Python, Flask |
| AI & Computer Vision | OpenCV, DeepFace |
| Face Recognition Model | VGG-Face |
| Data Integration | Football-Data.org REST API |
| Styling | CSS3, Responsive UI |
| Configuration | Environment Variables (`.env`) |

### 🏗️ Architecture

SportsHUB separates the frontend interface from the backend services.

- **Frontend:** Handles the user interface, camera interactions, and presentation of football data.
- **Backend:** Uses Flask to process facial recognition requests and application logic.
- **External API:** Retrieves football-related data from a third-party service.

### 🚀 Getting Started

**Prerequisites:** Python, Node.js, and npm.

#### 1. Backend Setup

```bash
cd backend
python -m venv .venv
```

On Windows:

```bash
.venv\Scripts\activate
```

On Linux / macOS:

```bash
source .venv/bin/activate
```

Install the dependencies and start the backend:

```bash
pip install -r requirements.txt
python app.py
```

#### 2. Frontend Setup

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite in your browser.

### ⚙️ Configuration

Configure sensitive values, such as API keys, through environment variables instead of hardcoding them into the source code.

Create a `.env` file with the variables required by the project. Never commit real API credentials to a public repository.

### 🎯 Project Objective

SportsHUB was created to explore the integration of modern frontend technologies, Python-based backend development, AI-assisted image processing, and external REST APIs in a single web application.

### 👨‍💻 Developer

**İsmail Eren Demirci**

Computer Programming | Full-Stack Development | AI & Computer Vision
