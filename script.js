// ==========================================================
// 1. KODE PENGGERAK SLIDER BANNER GAMBAR (YANG SUDAH AMAN)
// ==========================================================
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

let currentIndex = 0;
const totalSlides = slides.length;
const duration = 4000; 

const firstClone = slides[0].cloneNode(true);
track.appendChild(firstClone);

function geserSlide() {
    currentIndex++;
    track.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    dots.forEach(dot => dot.classList.remove('active'));
    if (currentIndex === totalSlides) {
        dots[0].classList.add('active');
    } else {
        dots[currentIndex].classList.add('active');
    }
}

track.addEventListener('transitionend', () => {
    if (currentIndex === totalSlides) {
        track.style.transition = "none"; 
        currentIndex = 0;
        track.style.transform = `translateX(0%)`; 
    }
});

setInterval(geserSlide, duration);


// ==========================================================
// 2. LOGIKA BARU: TRANSLATE OTOMATIS VIA COOKIE (ANTI-GAGAL)
// ==========================================================
const langOptions = document.querySelectorAll('.lang-option');
const activeLangText = document.getElementById('active-lang');

// [A] LANGKAH UTAMA: Cek status bahasa setiap kali halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    const bahasaSaatIni = ambilCookie('googtrans');
    
    // Menggunakan .includes agar deteksi membaca kata 'en' lebih akurat dan anti-gagal
    if (bahasaSaatIni && bahasaSaatIni.includes('en')) {
        if (activeLangText) activeLangText.textContent = 'English';
    } else {
        if (activeLangText) activeLangText.textContent = 'Indonesia';
    }
});

// [B] LANGKAH DETEKSI KLIK: Set nilai cookie baru lalu reload halaman
langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        
        const pilihanBahasa = option.getAttribute('data-lang'); // Ambil 'id' atau 'en'
        
        if (pilihanBahasa === 'en') {
            buatCookie('googtrans', '/id/en', 1); // Perintah terjemahan Indonesia ke Inggris
        } else {
            buatCookie('googtrans', '/id/id', 1); // Kembalikan ke Indonesia asli
        }
        
        // Segarkan halaman instan agar Google Translate membaca cookie baru kita
        window.location.reload();
    });
});

// [C] FUNGSI ALAT BANTU: Membuat cookie memori di browser
function buatCookie(nama, nilai, hari) {
    const d = new Date();
    d.setTime(d.getTime() + (hari * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = nama + "=" + nilai + ";" + expires + ";path=/";
}

// [D] FUNGSI ALAT BANTU: Membaca status cookie di browser
function ambilCookie(nama) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}