// DATABASE LOKASI VILLA
const daftarVilla = [
    { id: 1, nama: "Villa Atap Singgah 1 (Cisarua)" },
    { id: 2, nama: "Villa Atap Singgah 2 (Puncak)" },
    { id: 3, nama: "Villa Kayu Manis" },
    { id: 4, nama: "Villa Evergreen" },
    { id: 5, nama: "Guest House Utama" }
];

// DATABASE LAYANAN (MENU & SEWA)
const daftarLayanan = [
    // --- KATEGORI: MAKANAN (KULINER) ---
    {
    id: 101,
    nama: "Nasi Goreng Spesial Atap Singgah",
    kategori: "makanan",
    harga: "Rp 35.000",
    deskripsi: "Nasi goreng premium yang dimasak dengan bumbu rempah rahasia.\n\n" +
               "📍 Bahan: Beras pilihan, telur dadar suwir, potongan ayam fillet, dan bakso sapi.\n" +
               "📍 Pelengkap: Acar segar, kerupuk udang besar, dan sambal terasi terpisah.\n" +
               "📍 Porsi: Kenyang untuk 1 orang dewasa.",
    gambar: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=500&q=80",
    tersedia: true
    },
    {
        id: 102,
        nama: "Mie Goreng Jawa",
        kategori: "makanan",
        harga: "Rp 22.000",
        deskripsi: "Mie goreng khas Jawa dengan sayuran segar dan bakso ayam.",
        gambar: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400",
        tersedia: true
    },
    {
        id: 103,
        nama: "Ayam Bakar Madu",
        kategori: "makanan",
        harga: "Rp 35.000",
        deskripsi: "Ayam bakar bumbu madu disajikan dengan sambal terasi dan lalapan.",
        gambar: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400",
        tersedia: false // Contoh menu habis
    },

    // --- KATEGORI: MINUMAN (COFFEE/NON-COFFEE) ---
    {
        id: 201,
        nama: "Es Kopi Susu Gula Aren",
        kategori: "minuman",
        harga: "Rp 18.000",
        deskripsi: "Kopi espresso pilihan dengan susu segar dan gula aren murni.",
        gambar: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=400",
        tersedia: true
    },
    {
        id: 202,
        nama: "Matcha Latte Ice",
        kategori: "minuman",
        harga: "Rp 20.000",
        deskripsi: "Teh hijau Jepang kualitas premium dengan susu creamy.",
        gambar: "https://images.unsplash.com/photo-1536819114556-1e10f967fb61?w=400",
        tersedia: true
    },

    // --- KATEGORI: PENYEWAAN ALAT ---
    {
        id: 301,
        nama: "Extra Bed Set",
        kategori: "sewa",
        harga: "Rp 75.000",
        deskripsi: "Kasur tambahan, bantal, dan selimut bersih untuk 1 orang.",
        gambar: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400",
        tersedia: true
    },
    {
        id: 302,
        nama: "Alat Barbeque (Lengkap)",
        kategori: "sewa",
        harga: "Rp 100.000",
        deskripsi: "Panggangan, arang, jepitan, dan bumbu oles dasar.",
        gambar: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
        tersedia: true
    },

    // --- KATEGORI: INFORMASI ---
    {
        id: 401,
        nama: "Jam Operasional",
        kategori: "info",
        harga: "Buka 08:00 - 21:00",
        deskripsi: "Pemesanan di luar jam tersebut akan diproses keesokan harinya.",
        gambar: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=400",
        tersedia: true
    },
    {
        id: 402,
        nama: "Ketentuan Kerusakan",
        kategori: "info",
        harga: "Patuhi Aturan",
        deskripsi: "Setiap kerusakan alat sewa menjadi tanggung jawab penyewa.",
        gambar: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400",
        tersedia: true
    }
];