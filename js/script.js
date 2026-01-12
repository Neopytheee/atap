document.addEventListener('DOMContentLoaded', () => {
    const menuBox = document.getElementById('menu-box');
    const villaSelect = document.getElementById('villa-name');

    function initVilla() {
        if (!villaSelect) return;
        villaSelect.innerHTML = '<option value="">-- Pilih Lokasi Villa --</option>';
        daftarVilla.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.nama;
            opt.textContent = v.nama;
            villaSelect.appendChild(opt);
        });
    }

    function renderMenu(filter = 'semua') {
    if (!menuBox) return;
    menuBox.innerHTML = "";
    const filtered = filter === 'semua' ? daftarLayanan : daftarLayanan.filter(i => i.kategori === filter);

    filtered.forEach(item => {
        const isInfo = item.kategori === 'info';
        const isHabis = item.tersedia === false;

        menuBox.innerHTML += `
            <div class="menu-card ${isHabis ? 'out-of-stock' : ''}">
                <div class="menu-img" style="background-image: url('${item.gambar}')"></div>
                <div class="menu-info">
                    <h3>${item.nama}</h3>
                    <p>${item.deskripsi}</p>
                    <span class="price">${item.harga}</span>
                    
                    ${!isInfo && !isHabis ? `
                        <input type="text" id="note-${item.id}" placeholder="Catatan (contoh: pedas/extra bantal)" class="note-input">
                        <div class="order-controls">
                            <input type="number" id="qty-${item.id}" value="1" min="1" class="qty-input">
                            <button class="btn-wa" onclick="sendWA(${item.id})">PESAN SEKARANG</button>
                        </div>
                    ` : isHabis ? `
                        <div class="order-controls">
                            <div style="width: 70px;"></div> <button class="btn-wa habis-btn" disabled>STOK HABIS</button>
                        </div>
                    ` : `
                        <div class="order-controls">
                            <div style="width: 70px;"></div> <button class="btn-wa info-btn" disabled>INFO LAYANAN</button>
                        </div>
                    `}
                </div>
            </div>`;
    });
}

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            e.target.classList.add('active');
            renderMenu(e.target.dataset.target);
        });
    });

    initVilla();
    renderMenu();
});

function sendWA(id) {
    const item = daftarLayanan.find(obj => obj.id === id);
    const qty = document.getElementById(`qty-${id}`).value;
    const villa = document.getElementById('villa-name').value;
    const note = document.getElementById(`note-${id}`).value || "-";
    
    if (!villa) {
        alert("Pilih Villa Anda di bagian atas!");
        document.getElementById('villa-name').focus();
        return;
    }

    // Hitung Total Otomatis
    const hargaAngka = parseInt(item.harga.replace(/[^0-9]/g, '')) || 0;
    const totalHarga = (hargaAngka * qty).toLocaleString('id-ID');
    const jamPesanan = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const nomorWA = "6285975409429"; 
    const pesan = `🏨 *PESANAN BARU - ATAP SINGGAH*\n` +
                  `------------------------------------------\n` +
                  `👤 *Nama:* (WAJIB)\n` +
                  `📍 *Lokasi:* *${villa}*\n` +
                  `🕒 *Waktu:* ${jamPesanan} WIB\n\n` +
                  `*Rincian Pesanan:*\n` +
                  `🍴 *${item.nama}*\n` +
                  `🔢 *Jumlah:* ${qty}x\n` +
                  `💰 *Harga Satuan:* ${item.harga}\n` +
                  `💵 *Total Estimasi:* Rp ${totalHarga}\n\n` +
                  `📝 *Catatan:* ${note}\n` +
                  `------------------------------------------\n` +
                  `Mohon segera diproses. Terima kasih!`;

    window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`, '_blank');
}