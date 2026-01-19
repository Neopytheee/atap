// Import semua data dari file masing-masing
import { daftarMakanan } from './data/makanan.js';
import { daftarMinuman } from './data/minuman.js';
import { daftarJunkfood } from './data/junkfood.js';
import { daftarSewa } from './data/sewa.js';
import { daftarVilla } from './data/villa.js';
import { daftarInfo } from './data/info.js';

// Gabungkan semua layanan agar script.js bisa melakukan filter/pencarian
export const daftarLayanan = [
    ...daftarMakanan,
    ...daftarJunkfood,
    ...daftarMinuman,
    ...daftarSewa,
    ...daftarInfo,
];

// Export daftar villa secara terpisah
export { daftarVilla };