// ==========================================================
// 1. KODE PENGGERAK SLIDER BANNER GAMBAR (DOUBLE CLONE SYSTEM)
// ==========================================================
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

if (track && slides.length > 0) {
    let currentIndex = 0;
    const totalSlides = slides.length; // Jumlah asli (3)
    const duration = 4000; 
    let sliderInterval;

    // 🔥 KUNCI UTAMA: Kloning Slide 1 DAN Slide 2 ke ujung akhir rel
    const firstClone = slides[0].cloneNode(true);
    const secondClone = slides[1].cloneNode(true);
    track.appendChild(firstClone);
    track.appendChild(secondClone);

    function geserSlide() {
        currentIndex++;
        track.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Atur navigasi titik (dots) agar tidak eror saat di slide kloningan
        dots.forEach(dot => dot.classList.remove('active'));
        let dotIndex = currentIndex;
        if (currentIndex === totalSlides) {
            dotIndex = 0; // Kloning Slide 1 menggunakan dot index 0
        }
        if (dots[dotIndex]) dots[dotIndex].classList.add('active');
    }

    // TELEPORTASI GAIB: Terjadi tepat setelah animasi geser ke Kloning Slide 1 SELESAI
    track.addEventListener('transitionend', (e) => {
        // Filter khusus agar hanya memproses transisi geser rel utama
        if (e.target !== track || e.propertyName !== 'transform') return;

        // Jika sudah mentok di Kloning Slide 1 (posisi mirip slide 1 asli)
        if (currentIndex === totalSlides) {
            track.style.transition = "none"; // Matikan animasi instan
            currentIndex = 0;
            track.style.transform = `translateX(0%)`; // Kembalikan ke Slide 1 asli secara kasat mata
        }
    });

    // Jalankan & Pengaman Tab Browser
    function mulaiSlider() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(geserSlide, duration);
    }

    function stopSlider() {
        clearInterval(sliderInterval);
    }

    mulaiSlider();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopSlider();
        } else {
            mulaiSlider();
        }
    });

    // ==========================================================
    // LOGIKA INTERAKSI KLIK & ANIMASI REDIRECT Halaman
    // ==========================================================
    track.addEventListener('click', (e) => {
        // Cari elemen .carousel-slide terdekat dari posisi yang diklik mouse
        const slideAktif = e.target.closest('.carousel-slide');
        
        // Jika yang diklik bukan area slide atau tidak punya data-link, batalkan
        if (!slideAktif) return;
        const linkTujuan = slideAktif.getAttribute('data-link');
        if (!linkTujuan) return;

        // 1. Jalankan animasi klik dengan memicu class di CSS
        slideAktif.classList.add('clicked');

        // 2. Beri jeda waktu 200 milidetik (0.2 detik)
        // Tujuan: Agar mata user sempat melihat animasi boksnya mengecil/membal dulu, baru pindah halaman
        setTimeout(() => {
            window.location.href = linkTujuan;
        }, 200);
    });
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