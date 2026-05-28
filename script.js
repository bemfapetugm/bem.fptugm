// ==========================================================
// 1. KODE PENGGERAK SLIDER BANNER GAMBAR
// ==========================================================
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

if (track && slides.length > 0) {
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
            if (dots[0]) dots[0].classList.add('active');
        } else {
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');
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
}


// ==========================================================
// 2. LOGIKA PENUKAR BAHASA VIA LOCALSTORAGE
// ==========================================================
const langOptions = document.querySelectorAll('.lang-option');
const activeLangText = document.getElementById('active-lang');

// [A] SAKSI UTAMA: Kunci tulisan tombol berdasarkan tracker mandiri
document.addEventListener("DOMContentLoaded", () => {
    const bahasaSaved = localStorage.getItem('pilihan_bahasa_user');
    
    if (bahasaSaved === 'en') {
        if (activeLangText) activeLangText.textContent = 'English';
    } else {
        if (activeLangText) activeLangText.textContent = 'Indonesia';
    }
});

// [B] PROSES KLIK: Simpan perintah ke Google sekaligus ke Tracker
langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        const pilihanBahasa = option.getAttribute('data-lang'); 
        
        if (pilihanBahasa === 'en') {
            buatCookie('googtrans', '/id/en', 1);               
            localStorage.setItem('pilihan_bahasa_user', 'en'); 
        } else {
            buatCookie('googtrans', '/id/id', 1);               
            localStorage.setItem('pilihan_bahasa_user', 'id'); 
        }
        
        window.location.reload();
    });
});

// Fungsi pembuat cookie untuk jembatan Google (Cukup Tulis 1 Kali)
function buatCookie(nama, nilai, hari) {
    const d = new Date();
    d.setTime(d.getTime() + (hari * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = nama + "=" + nilai + ";" + expires + ";path=/";
}


// ==========================================================
// 3. LOGIKA CAROUSEL GALERI FOTO (DOUBLE INFINITE CLONE)
// ==========================================================
const gTrack = document.querySelector('.galeri-track');
let gSlides = document.querySelectorAll('.galeri-slide'); 
const gDots = document.querySelectorAll('.galeri-dots .g-dot');
const gWrapper = document.querySelector('.galeri-wrapper'); // OPTIMASI: Ditarik ke global
const btnPrevGaleri = document.getElementById('galeri-prev');
const btnNextGaleri = document.getElementById('galeri-next');

// PENGAMAN MULTI-PAGE: Hanya jalan jika elemen galeri lengkap ada di halaman tersebut
if (gTrack && gSlides.length > 0 && gWrapper && btnPrevGaleri && btnNextGaleri) {
    const gTotalOriginal = gDots.length; 
    let gTimer;
    let isTransitioning = false; 

    // --- PROSES KLONING GAIB (DUAL SIDE) ---
    const firstClone = gSlides[0].cloneNode(true);
    const lastClone = gSlides[gSlides.length - 1].cloneNode(true);

    gTrack.appendChild(firstClone); 
    gTrack.insertBefore(lastClone, gSlides[0]); 

    // Perbarui daftar slide pasca klon
    gSlides = document.querySelectorAll('.galeri-slide');
    const gTotalReal = gSlides.length; 
    let gIndex = 1; 

    function perbaruiGaleri(pakeAnimasi = true) {
        const wrapperWidth = gWrapper.offsetWidth;
        const slideWidth = gSlides[0].offsetWidth;
        
        if (slideWidth === 0) return;
        
        if (pakeAnimasi) {
            gTrack.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
        } else {
            gTrack.style.transition = "none";
        }
        
        // Hitung koordinat tengah otomatis
        const koordinatTengah = -gIndex * slideWidth + (wrapperWidth - slideWidth) / 2;
        gTrack.style.transform = `translateX(${koordinatTengah}px)`;
        
        // Hitung index aktif untuk indikator dots
        let indexAsli = gIndex - 1;
        if (gIndex === 0) indexAsli = gTotalOriginal - 1;
        if (gIndex === gTotalReal - 1) indexAsli = 0;
        
        // Atur skala perbesaran gambar aktif
        gSlides.forEach((slide, idx) => {
            slide.style.transition = pakeAnimasi ? "all 0.5s ease" : "none";
            if (idx === gIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        gDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === indexAsli);
        });
    }

    function jalanKanan() {
        if (isTransitioning) return;
        isTransitioning = true;
        gIndex++;
        perbaruiGaleri(true);
    }

    function jalanKiri() {
        if (isTransitioning) return;
        isTransitioning = true;
        gIndex--;
        perbaruiGaleri(true);
    }

    // --- MEKANISME TELEPORTASI INFINITE ---
    gTrack.addEventListener('transitionend', (e) => {
        if (e.target !== gTrack || e.propertyName !== 'transform') return;
        
        isTransitioning = false;
        
        if (gIndex === gTotalReal - 1) {
            gTrack.style.transition = "none"; 
            gIndex = 1;
            perbaruiGaleri(false); 
        }
        
        if (gIndex === 0) {
            gTrack.style.transition = "none"; 
            gIndex = gTotalReal - 2;
            perbaruiGaleri(false); 
        }
    });

    // Kontrol Navigasi Tombol & Dots
    btnNextGaleri.addEventListener('click', () => {
        jalanKanan();
        segarkanSiklusOtomatis();
    });

    btnPrevGaleri.addEventListener('click', () => {
        jalanKiri();
        segarkanSiklusOtomatis();
    });

    gDots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            if (isTransitioning) return;
            gIndex = idx + 1;
            perbaruiGaleri(true);
            segarkanSiklusOtomatis();
        });
    });

    function mulaiSiklusOtomatis() {
        gTimer = setInterval(jalanKanan, 5000);
    }

    function segarkanSiklusOtomatis() {
        clearInterval(gTimer);
        mulaiSiklusOtomatis();
    }

    // Jembatan kalkulasi ulang saat halaman termuat sempurna atau ukuran layar berubah
    window.addEventListener('load', () => perbaruiGaleri(false));
    window.addEventListener('resize', () => perbaruiGaleri(false));

    // Inisialisasi Eksekusi Awal
    perbaruiGaleri(false);
    mulaiSiklusOtomatis();
}