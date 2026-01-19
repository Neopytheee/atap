let keranjang = [];

document.addEventListener('DOMContentLoaded', () => {
    // Memastikan data villa dimuat saat awal
    initVilla();
    renderMenu();

    // Event listener untuk filter kategori
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const activeBtn = document.querySelector('.filter-btn.active');
            if (activeBtn) activeBtn.classList.remove('active');
            
            e.target.classList.add('active');
            renderMenu(e.target.dataset.target);
        });
    });
});

// Mengisi dropdown villa (yang sekarang ada di dalam modal)
function initVilla() {
    const vs = document.getElementById('villa-name');
    if (!vs) return;
    
    vs.innerHTML = '<option value="">-- Pilih Lokasi Villa --</option>';
    // Pastikan variabel 'daftarVilla' tersedia di data.js
    if (typeof daftarVilla !== 'undefined') {
        daftarVilla.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.nama;
            opt.textContent = v.nama;
            vs.appendChild(opt);
        });
    }
}

// Menampilkan produk berdasarkan kategori
function renderMenu(filter = 'semua') {
    const box = document.getElementById('menu-box');
    if (!box) return;
    
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

// Modal Detail Produk
function bukaDetail(id) {
    const item = daftarLayanan.find(obj => obj.id === id);
    if (!item) return;

    document.getElementById('detail-nama').innerText = item.nama;
    document.getElementById('detail-harga').innerText = item.harga;
    document.getElementById('detail-deskripsi').innerText = item.deskripsi;
    document.getElementById('detail-img').style.backgroundImage = `url('${item.gambar}')`;
    
    const btn = document.getElementById('detail-btn-tambah');
    btn.style.display = (item.kategori === 'info' || !item.tersedia) ? 'none' : 'block';
    btn.onclick = () => { tambahKeKeranjang(item.id); closeDetail(); };
    
    document.getElementById('detail-modal').style.display = 'flex';
}

function closeDetail() { 
    document.getElementById('detail-modal').style.display = 'none'; 
}

// Logika Keranjang
function tambahKeKeranjang(id) {
    const item = daftarLayanan.find(obj => obj.id === id);
    const qtyInput = document.getElementById(`qty-${id}`);
    
    const qty = parseInt(qtyInput?.value || 1);
    const note = "-"; // Catatan per item jika diperlukan di masa depan

    const idx = keranjang.findIndex(k => k.id === id);
    if (idx > -1) {
        keranjang[idx].qty += qty;
    } else {
        keranjang.push({ ...item, qty, note });
    }

    if(qtyInput) qtyInput.value = 1;

    updateFloatingButton();
    alert(`✅ ${item.nama} berhasil ditambah!`);
}

function updateFloatingButton() {
    const count = keranjang.reduce((s, i) => s + i.qty, 0);
    const btn = document.getElementById('floating-cart');
    if (!btn) return;

    // Hanya mengatur display, warna sudah diatur oleh CSS di atas
    btn.style.display = count > 0 ? 'flex' : 'none';
    btn.innerHTML = `🛒 Lihat Keranjang (${count})`;
}

function toggleModal() {
    const m = document.getElementById('cart-modal');
    if (!m) return;
    
    const isHidden = (m.style.display === 'none' || m.style.display === '');
    m.style.display = isHidden ? 'flex' : 'none';
    
    if (isHidden) renderCartItems();
}

function renderCartItems() {
    const list = document.getElementById('cart-items-list');
    const totalDisp = document.getElementById('cart-total-price');
    if (!list) return;

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
                    <button onclick="hapusItem(${i})" style="color:var(--danger); border:none; background:none; cursor:pointer; padding:5px;">🗑️</button>
                </div>
            </div>`;
    });
    totalDisp.innerText = `Total Estimasi: Rp ${total.toLocaleString()}`;
}

function updateQty(index, change) {
    keranjang[index].qty += change;

    if (keranjang[index].qty <= 0) {
        if (confirm(`Hapus ${keranjang[index].nama}?`)) {
            keranjang.splice(index, 1);
        } else {
            keranjang[index].qty = 1;
        }
    }

    renderCartItems();
    updateFloatingButton();
    if (keranjang.length === 0) toggleModal();
}

function hapusItem(i) {
    keranjang.splice(i, 1);
    renderCartItems();
    updateFloatingButton();
    if (keranjang.length === 0) toggleModal();
}

// Pengiriman Pesanan ke WhatsApp
function sendWA() {
    const villa = document.getElementById('villa-name').value;
    const nama = document.getElementById('customer-name').value.trim();
    const catatanGlobal = document.getElementById('global-note').value.trim() || "Tidak ada catatan.";

    // Validasi input di dalam modal
    if (!villa || !nama) {
        alert("⚠️ Mohon lengkapi Nama dan Lokasi Villa!");
        return;
    }

    // Generate Order ID
    const sekarang = new Date();
    const tgl = sekarang.getDate().toString().padStart(2, '0');
    const bln = (sekarang.getMonth() + 1).toString().padStart(2, '0');
    const thnShort = sekarang.getFullYear().toString().slice(-2);
    
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let kodeAcak = "";
    for (let i = 0; i < 3; i++) {
        kodeAcak += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const orderID = `AS.${kodeAcak}`;

    // Susun Rincian Pesanan
    let rincian = "";
    let grandTotal = 0;
    keranjang.forEach((item, i) => {
        const h = parseInt(item.harga.replace(/[^0-9]/g, '')) || 0;
        grandTotal += (h * item.qty);
        rincian += `${i + 1}. *${item.nama}* (x${item.qty})\n`;
    });

    const jamDisplay = sekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    const pesan = `🏨 *PESANAN BARU - ATAP SINGGAH*\n` +
                  `🆔 *Order ID: ${orderID}*\n` +
                  `------------------------------------------\n` +
                  `👤 *Pemesan:* ${nama}\n` +
                  `📍 *Lokasi:* ${villa}\n` +
                  `🕒 *Waktu:* ${jamDisplay} WIB - ${tgl}.${bln}.${thnShort}\n` +
                  `------------------------------------------\n\n` +
                  `*Daftar Pesanan:*\n${rincian}\n` +
                  `*📝 Catatan:* \n_${catatanGlobal}_\n\n` +
                  `------------------------------------------\n` +
                  `💵 *Total Estimasi: Rp ${grandTotal.toLocaleString()}*\n` +
                  `------------------------------------------\n\n` +
                  `_Mohon sertakan Order ID saat mengirim bukti transfer._`;

    window.open(`https://wa.me/6285975409429?text=${encodeURIComponent(pesan)}`, '_blank');
}