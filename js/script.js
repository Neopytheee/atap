let keranjang = [];

document.addEventListener('DOMContentLoaded', () => {
    initVilla();
    renderMenu();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            e.target.classList.add('active');
            renderMenu(e.target.dataset.target);
        });
    });
});

function initVilla() {
    const vs = document.getElementById('villa-name');
    if (!vs) return;
    vs.innerHTML = '<option value="">-- Pilih Lokasi Villa --</option>';
    daftarVilla.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.nama;
        opt.textContent = v.nama;
        vs.appendChild(opt);
    });
}

function renderMenu(filter = 'semua') {
    const box = document.getElementById('menu-box');
    box.innerHTML = "";
    const filtered = filter === 'semua' ? daftarLayanan : daftarLayanan.filter(i => i.kategori === filter);

    filtered.forEach(item => {
        const isInfo = item.kategori === 'info';
        const isHabis = item.tersedia === false;

        box.innerHTML += `
            <div class="menu-card ${isHabis ? 'out-of-stock' : ''}">
                <div class="menu-img" onclick="bukaDetail(${item.id})" style="background-image: url('${item.gambar}')"></div>
                <div class="menu-info">
                    <h3 onclick="bukaDetail(${item.id})" style="cursor:pointer">${item.nama}</h3>
                    <p>${item.deskripsi.substring(0, 65)}...</p>
                    
                    <div class="menu-footer">
                        <span class="price">${item.harga}</span>
                        ${!isInfo && !isHabis ? `
                            <div class="order-controls">
                                <input type="number" id="qty-${item.id}" value="1" min="1" class="qty-input">
                                <button class="btn-wa" style="flex:1" onclick="tambahKeKeranjang(${item.id})">TAMBAH</button>
                            </div>
                        ` : `
                            <button class="btn-wa" style="width:100%; background:#666" onclick="bukaDetail(${item.id})">
                                ${isHabis ? 'STOK HABIS' : 'LIHAT INFO'}
                            </button>
                        `}
                    </div>
                </div>
            </div>`;
    });
}

function bukaDetail(id) {
    const item = daftarLayanan.find(obj => obj.id === id);
    document.getElementById('detail-nama').innerText = item.nama;
    document.getElementById('detail-harga').innerText = item.harga;
    document.getElementById('detail-deskripsi').innerText = item.deskripsi;
    document.getElementById('detail-img').style.backgroundImage = `url('${item.gambar}')`;
    
    const btn = document.getElementById('detail-btn-tambah');
    btn.style.display = (item.kategori === 'info' || !item.tersedia) ? 'none' : 'block';
    btn.onclick = () => { tambahKeKeranjang(item.id); closeDetail(); };
    
    document.getElementById('detail-modal').style.display = 'flex';
}

function closeDetail() { document.getElementById('detail-modal').style.display = 'none'; }

function tambahKeKeranjang(id) {
    const item = daftarLayanan.find(obj => obj.id === id);
    const qtyInput = document.getElementById(`qty-${id}`);
    const noteInput = document.getElementById(`note-${id}`);
    
    const qty = parseInt(qtyInput?.value || 1);
    const note = noteInput?.value || "-";

    const idx = keranjang.findIndex(k => k.id === id && k.note === note);
    if (idx > -1) keranjang[idx].qty += qty;
    else keranjang.push({ ...item, qty, note });

    if(qtyInput) qtyInput.value = 1;
    if(noteInput) noteInput.value = "";

    updateFloatingButton();
    alert(`✅ ${item.nama} masuk keranjang!`);
}

function updateFloatingButton() {
    const count = keranjang.reduce((s, i) => s + i.qty, 0);
    const btn = document.getElementById('floating-cart');
    btn.style.display = count > 0 ? 'flex' : 'none';
    btn.innerHTML = `🛒 Lihat Keranjang (${count})`;
}

function toggleModal() {
    const m = document.getElementById('cart-modal');
    m.style.display = (m.style.display === 'none' || m.style.display === '') ? 'flex' : 'none';
    renderCartItems();
}

function renderCartItems() {
    const list = document.getElementById('cart-items-list');
    const totalDisp = document.getElementById('cart-total-price');
    list.innerHTML = "";
    let total = 0;

    if (keranjang.length === 0) {
        list.innerHTML = "<p style='text-align:center; padding:20px; color:#aaa;'>Keranjang kosong.</p>";
        totalDisp.innerText = "";
        return;
    }

    keranjang.forEach((item, i) => {
        const h = parseInt(item.harga.replace(/[^0-9]/g, '')) || 0;
        const sub = h * item.qty;
        total += sub;
        
        list.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:15px 0; border-bottom:1px solid #f0f0f0;">
                <div style="flex:1;">
                    <div style="font-weight:600; font-size:14px;">${item.nama}</div>
                    <div style="font-size:13px; color:var(--forest-green); font-weight:600;">Rp ${sub.toLocaleString()}</div>
                </div>
                
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="display:flex; align-items:center; background:#f0f0f0; border-radius:8px; padding:2px;">
                        <button onclick="updateQty(${i}, -1)" style="border:none; background:none; padding:5px 10px; cursor:pointer; font-weight:bold;">-</button>
                        <span style="min-width:20px; text-align:center; font-weight:600; font-size:14px;">${item.qty}</span>
                        <button onclick="updateQty(${i}, 1)" style="border:none; background:none; padding:5px 10px; cursor:pointer; font-weight:bold;">+</button>
                    </div>
                    
                    <button onclick="hapusItem(${i})" style="color:var(--danger); border:none; background:none; cursor:pointer; padding:5px;">
                        🗑️
                    </button>
                </div>
            </div>`;
    });
    totalDisp.innerText = `Total Estimasi: Rp ${total.toLocaleString()}`;
}

function updateQty(index, change) {
    // Update jumlah
    keranjang[index].qty += change;

    // Jika jumlah jadi 0 atau kurang, hapus item tersebut
    if (keranjang[index].qty <= 0) {
        if (confirm(`Hapus ${keranjang[index].nama} dari keranjang?`)) {
            keranjang.splice(index, 1);
        } else {
            keranjang[index].qty = 1; // Kembalikan ke 1 jika batal hapus
        }
    }

    // Refresh tampilan keranjang dan tombol melayang
    renderCartItems();
    updateFloatingButton();
    
    // Jika keranjang kosong setelah dikurangi, tutup modal
    if (keranjang.length === 0) {
        setTimeout(() => toggleModal(), 300);
    }
}

function hapusItem(i) {
    keranjang.splice(i, 1);
    renderCartItems();
    updateFloatingButton();
    if (keranjang.length === 0) toggleModal();
}

function sendWA() {
    const villa = document.getElementById('villa-name').value;
    const nama = document.getElementById('customer-name').value;
    const catatanGlobal = document.getElementById('global-note').value || "Tidak ada catatan.";

    if (!villa || !nama) {
        alert("⚠️ Mohon isi Nama Pemesan dan Lokasi Villa!");
        return;
    }

    // MEMBUAT ORDER ID UNIK (Contoh: AS-240521-X9)
    const tgl = new Date();
    const formatTgl = tgl.toISOString().slice(2, 10).replace(/-/g, ''); // Ambil YYMMDD
    const randomID = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 Karakter acak
    const orderID = `AS-${formatTgl}-${randomID}`;

    let rincian = "";
    let grandTotal = 0;
    keranjang.forEach((item, i) => {
        const h = parseInt(item.harga.replace(/[^0-9]/g, '')) || 0;
        grandTotal += (h * item.qty);
        rincian += `${i + 1}. *${item.nama}* (x${item.qty})\n`;
    });

    const jam = tgl.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    // FORMAT PESAN DENGAN ORDER ID
    const pesan = `🏨 *PESANAN BARU - ATAP SINGGAH*\n` +
                  `🆔 *Order ID:* #${orderID}\n` +
                  `------------------------------------------\n` +
                  `👤 *Pemesan:* ${nama}\n` +
                  `📍 *Lokasi:* *${villa}*\n` +
                  `🕒 *Waktu:* ${jam} WIB\n` +
                  `------------------------------------------\n\n` +
                  `*Daftar Pesanan:*\n${rincian}\n` +
                  `📝 *Catatan Tambahan:*\n_${catatanGlobal}_\n\n` +
                  `------------------------------------------\n` +
                  `💵 *Total Estimasi:* Rp ${grandTotal.toLocaleString()}\n` +
                  `------------------------------------------\n\n` +
                  `_Silakan simpan Order ID Anda untuk konfirmasi pembayaran._`;

    window.open(`https://wa.me/6285975409429?text=${encodeURIComponent(pesan)}`, '_blank');
}