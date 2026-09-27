# Test

Contoh desain aplikasi: https://gradin.co.id/test/vue/mockup

## Guidelines:

1. General
   - Menggunakan Vue 3 + TypeScript + TailwindCSS
   - Tidak perlu simpan chat ke localstorage, tidak masalah chat hilang saat di refresh.
   - UI program pakai bahasa inggris
   - Warna theme, nama & logo aplikasi terserah, hias sebagus mungkin, buat kita bilang "Wow".
   - Gambar profile pakai gambar random person generator (misal: https://randomuser.me).
   - Fitur boleh lebih lengkap daripada contoh desain, tapi tidak boleh kurang.
2. Halaman Login
   - Pertama buka aplikasi tampilkan halaman login
   - Pakai email & password, login selalu berhasil,
   - Nama user = email sebelum @, tampilkan dengan title case
   - Misal email chris_evans@example.com, berarti nama user adalah Chris Evans
   - Hanya bisa login kalau email dan password diisi
3. Halaman daftar Chat
   - Tambahkan dummy minimum 20 chat (biar kelihatan penuh sampai bisa vertical scroll, boleh randomly generated, boleh hardcode)
   - Tidak perlu group chat, hanya chat perorangan saja
   - Tampilkan jumlah pesan belum dibaca
   - Format waktu:
     - Kurang dari 1 menit tampilkan "just now",
     - Hari yg sama, tampilkan HH:mm (e.g 13:05)
     - Beda hari, tampilkan d Mmm (e.g 10 Oct)
   - Search: berdasarkan nama user, tampilkan hasil search setiap kali keyword berubah (tidak perlu pencet enter / submit)
4. Halaman detail chat
   - Ketik pesan lalu enter untuk submit chat
   - Pesan yang diketik sendiri muncul sebagai bubble chat di sebelah kanan
   - Update juga kalimat chat di halaman daftar chat (dibawah nama user)
   - Tampilkan nama user di atas chat dan jam pesan dibuat.

## Fitur Vue yang wajib dipakai:

- script setup
- defineProps
- defineEmits
- computed
- watch
- vue router
- pinia

## Nilai tambah jika bisa:

- responsive
- unit test

## Disclaimer:

Proyek ini hanyalah fiktif belaka. Desain yang Anda submit menjadi milik Anda sepenuhnya. Silakan digunakan sebagai portfolio untuk melamar ke perusahaan lain atau menjadi proyek Anda sendiri.
