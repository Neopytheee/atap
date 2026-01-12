let keranjang = [];
let menuBox;
let villaSelect;

document.addEventListener('DOMContentLoaded', () => {
    menuBox = document.getElementById('menu-box');
    villaSelect = document.getElementById('villa-name');
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
                <div class="menu-img" onclick="bukaDetail(${item.id})" style="background-image: url('${item.gambar}'); cursor:pointer;"></div>
                <div class="menu-info">
                    <h3 onclick="bukaDetail(${item.id})" style="cursor:pointer;">${item.nama}</h3>
                    <p>${item.deskripsi.substring(0, 60)}...</p>
                    <span class="price">${item.harga}</span>
                    ${!isInfo && !isHabis ? `
                        <input type="text" id="note-${item.id}" placeholder="Catatan: pedas / extra bantal..." class="note-input">
                        <div class="order-controls">
                            <input type="number" id="qty-${item.id}" value="1" min="1" class="qty-input">
                            <button class="btn-wa" onclick="tambahKeKeranjang(${item.id})">TAMBAH</button>
                        </div>
                    ` : `
                        <div class="order-controls">
                            <div style="width: 70px;"></div>
                            <button class="btn-wa info-btn" onclick="bukaDetail(${item.id})">${isHabis ? 'STOK HABIS' : 'LIHAT INFO'}</button>
                        </div>
                    `}
                </div>
            </div>`;
    });
}

// --- FITUR DETAIL POP-UP ---
function bukaDetail(id) {
    const item = daftarLayanan.find(obj => obj.id === id);
    if (!item) return;

    document.getElementById('detail-nama').innerText = item.nama;
    document.getElementById('detail-harga').innerText = item.harga;
    document.getElementById('detail-deskripsi').style.whiteSpace = "pre-line";
    document.getElementById('detail-deskripsi').innerText = item.deskripsi;
    document.getElementById('detail-img').style.backgroundImage = `url('${item.gambar}')`;

    const btnTambah = document.getElementById('detail-btn-tambah');
    if (item.kategori === 'info' || item.tersedia === false) {
        btnTambah.style.display = 'none';
    } else {
        btnTambah.style.display = 'block';
        btnTambah.onclick = function() {
            tambahKeKeranjang(item.id);
            closeDetail();
        };
    }
    document.getElementById('detail-modal').style.display = 'flex';
}

function closeDetail() {
    document.getElementById('detail-modal').style.display = 'none';
}

// --- FITUR KERANJANG ---
function tambahKeKeranjang(id) {
    const item = daftarLayanan.find(obj => obj.id === id);
    const qtyInput = document.getElementById(`qty-${id}`);
    const noteInput = document.getElementById(`note-${id}`);
    
    // Ambil qty & note (cek apakah elemen ada, jika dari detail modal mungkin null)
    const qty = qtyInput ? parseInt(qtyInput.value) : 1;
    const note = (noteInput && noteInput.value) ? noteInput.value : "-";
    
    if (qty < 1) return;

    const index = keranjang.findIndex(k => k.id === id && k.note === note);
    if (index > -1) {
        keranjang[index].qty += qty;
    } else {
        keranjang.push({ ...item, qty, note });
    }
    
    if(qtyInput) qtyInput.value = 1;
    if(noteInput) noteInput.value = "";
    
    updateFloatingButton();
    alert(`✅ ${item.nama} masuk keranjang!`);
}

function updateFloatingButton() {
    let totalItems = keranjang.reduce((sum, item) => sum + item.qty, 0);
    const floatBtn = document.getElementById('floating-cart');
    floatBtn.style.display = totalItems > 0 ? 'flex' : 'none';
    floatBtn.innerHTML = `🛒 Lihat Keranjang (${totalItems})`;
}

function toggleModal() {
    const modal = document.getElementById('cart-modal');
    const isHidden = modal.style.display === 'none' || modal.style.display === '';
    modal.style.display = isHidden ? 'flex' : 'none';
    if (isHidden) renderCartItems();
}

function renderCartItems() {
    const listContainer = document.getElementById('cart-items-list');
    const totalDisplay = document.getElementById('cart-total-price');
    listContainer.innerHTML = "";
    let grandTotal = 0;

    if (keranjang.length === 0) {
        listContainer.innerHTML = "<p style='text-align:center; padding: 30px; color:#aaa;'>Keranjang kosong.</p>";
        totalDisplay.innerHTML = "";
        return;
    }

    keranjang.forEach((item, index) => {
        const hargaAngka = parseInt(item.harga.replace(/[^0-9]/g, '')) || 0;
        const subtotal = hargaAngka * item.qty;
        grandTotal += subtotal;

        listContainer.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:15px 0; border-bottom:1px solid #f0f0f0;">
                <div style="flex:1;">
                    <div style="font-weight:600; font-size:15px;">${item.nama} <span style="color:var(--forest-green); margin-left:5px;">x${item.qty}</span></div>
                    <div style="font-size:12px; color:#999; font-style:italic;">Note: ${item.note}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:14px; font-weight:600; margin-bottom:8px;">Rp ${subtotal.toLocaleString('id-ID')}</div>
                    <button onclick="hapusItem(${index})" style="background:var(--danger); color:white; border:none; width:32px; height:32px; border-radius:8px; cursor:pointer; font-weight:bold;">
                        ${item.qty > 1 ? '−' : '🗑️'}
                    </button>
                </div>
            </div>`;
    });
    totalDisplay.innerHTML = `Total Estimasi: Rp ${grandTotal.toLocaleString('id-ID')}`;
}

function hapusItem(index) {
    if (keranjang[index].qty > 1) {
        keranjang[index].qty -= 1;
    } else {
        keranjang.splice(index, 1);
    }
    renderCartItems();
    updateFloatingButton();
    if (keranjang.length === 0) toggleModal();
}

function sendWA() {
    const villa = document.getElementById('villa-name').value;
    if (!villa) {
        alert("⚠️ Mohon pilih Lokasi Villa Anda!");
        toggleModal();
        window.scrollTo({top: 0, behavior: 'smooth'});
        return;
    }

    let rincianPesanan = "";
    let totalBayar = 0;
    keranjang.forEach((item, index) => {
        const hargaAngka = parseInt(item.harga.replace(/[^0-9]/g, '')) || 0;
        totalBayar += (hargaAngka * item.qty);
        rincianPesanan += `${index + 1}. *${item.nama}* (${item.qty}x)\n   📝 Catatan: ${item.note}\n`;
    });

    const jam = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const pesan = `🏨 *PESANAN BARU - ATAP SINGGAH*\n` +
                  `------------------------------------------\n` +
                  `📍 *Lokasi:* *${villa}*\n` +
                  `🕒 *Waktu:* ${jam} WIB\n\n` +
                  `*Daftar Pesanan:*\n${rincianPesanan}\n` +
                  `------------------------------------------\n` +
                  `💵 *Total Estimasi:* Rp ${totalBayar.toLocaleString('id-ID')}\n` +
                  `------------------------------------------\n` +
                  `--! Wajib Isi Nama Pemesan !--\n\n` +
                  `Mohon segera diproses. Terima kasih!`;

    window.open(`https://wa.me/6285975409429?text=${encodeURIComponent(pesan)}`, '_blank');
}