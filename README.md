# Auth

## Informasi Mahasiswa

- Nama : Naufal Rakan Ramadhan
- NIM : 2410501042
- Kelas : B

## Deskripsi Aplikasi

Aplikasi mobile berbasis React Native (Expo) yang mengimplementasikan sistem autentikasi lengkap menggunakan Firebase.

## Fitur yang Diimplementasikan

- **Firebase Authentication**: Alur lengkap pendaftaran dan masuk menggunakan email/password.
- **AuthContext & Protected Routes**: Manajemen state global untuk autentikasi dan pembatasan akses halaman berdasarkan status login.
- **Email Verification**: Validasi akun melalui link verifikasi email untuk memastikan keamanan data.
- **Password Reset**: Layanan pemulihan kata sandi yang dikirimkan langsung ke email pengguna.
- **Biometric Login**: Integrasi Fingerprint menggunakan `expo-local-authentication` untuk akses lebih cepat dan aman.
- **Session Persistence**: Menjaga sesi login tetap aktif meskipun aplikasi ditutup dan dibuka kembali.
- **Auto-Logout Idle**: Fitur keamanan yang otomatis mengeluarkan pengguna jika aplikasi tidak aktif/berada di latar belakang selama 5 menit.

## Langkah Pengujian

1. **Setup & Start**: Jalankan `npx expo start` dan scan QR code menggunakan aplikasi Expo Go di perangkat fisik (Fitur biometrik tidak didukung di emulator).
2. **Registrasi**: Daftarkan akun baru dan periksa email masuk untuk klik link verifikasi.
3. **Login & Persistence**: Masuk ke aplikasi, tutup aplikasi sepenuhnya, lalu buka kembali untuk memastikan sesi tetap tersimpan.
4. **Logout**: Pastikan proses logout mengarahkan kembali ke halaman login dengan benar.
5. **Forgot Password**: Uji fitur reset password dan verifikasi email pemulihan yang masuk.
6. **Biometric**: Tekan tombol biometrik untuk memicu prompt Face ID atau Fingerprint.

## Screenshot

### Login Screen
<p align="center">
  <img src="https://res.cloudinary.com/drrmbeiyk/image/upload/v1777562797/login_sp77jd.webp" alt="login" width="250" />
</p>

### Register Screen
<p align="center">
  <img src="https://res.cloudinary.com/drrmbeiyk/image/upload/v1777562797/register_hvklgm.webp" alt="register" width="250" />
</p>

### Forgot Password Screen
<p align="center">
  <img src="https://res.cloudinary.com/drrmbeiyk/image/upload/v1777562797/reset_c8fubd.webp" alt="forgot" width="250" />
</p>

### Home Screen
<p align="center">
  <img src="https://res.cloudinary.com/drrmbeiyk/image/upload/v1777562778/home_m4s99f.webp" alt="home" width="250" />
</p>

## Video demo

[Video Demo di Google Drive](https://drive.google.com/file/d/1_ySH6umjL0ZXruNJkKpdTz7HlEtXdNBp/view?usp=sharing)

## Cara Menjalankan

1. Clone the repository:
   ```bash
   git clone https://github.com/Ampasan/auth-praktikum.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npx expo start
   ```
