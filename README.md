# Admin PWKWI

Repo ini menyiapkan dashboard Admin PWKWI untuk GitHub Pages sebagai PWA shell. Halaman GitHub Pages memuat antarmuka Management dari Web App Apps Script agar `google.script.run` tetap berjalan di dalam halaman Apps Script.

## Isi repo
- `site/`: shell PWA GitHub Pages; secara default membuka URL Web App Apps Script PWKWI yang sudah dikonfigurasi.
- `apps-script/`: file yang perlu dipasang di proyek Apps Script (`Dashboard.gs` dan `Management.html`).
- `.github/workflows/pages.yml`: workflow deployment GitHub Pages.

## Setup
1. Pasang `apps-script/Dashboard.gs` dan `apps-script/Management.html` pada proyek Apps Script yang memiliki `doGet()` dan fungsi `getDashboardData()`.
2. Deploy sebagai Web App dan pastikan izin akses deployment sesuai kebijakan admin/klien.
3. Pada GitHub, buka **Settings → Pages** dan pilih **GitHub Actions** sebagai source.
4. Setelah workflow selesai, buka URL Pages; dashboard admin PWKWI akan terbuka otomatis.
5. Untuk pemasangan di HP, buka URL Pages di Chrome/Safari lalu pilih **Add to Home Screen / Tambahkan ke Layar Utama**.

## Keamanan
GitHub Pages umumnya menyajikan situs secara publik, termasuk jika sumber repo private. Shell ini tidak memuat data karyawan, tetapi dashboard Apps Script harus memiliki pembatasan akses yang tepat. Jangan gunakan deployment Apps Script yang mengizinkan siapa pun melihat data absensi tanpa otorisasi.

