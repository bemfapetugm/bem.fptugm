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
// 3. LOGIKA CAROUSEL GALERI FOTO (FULLY DYNAMIC MULTI-SLIDE)
// ==========================================================
const gTrack = document.querySelector('.galeri-track');
let gSlides = document.querySelectorAll('.galeri-slide'); 
const gDots = document.querySelectorAll('.galeri-dots .g-dot');
const gWrapper = document.querySelector('.galeri-wrapper'); 
const btnPrevGaleri = document.getElementById('galeri-prev');
const btnNextGaleri = document.getElementById('galeri-next');

if (gTrack && gSlides.length > 0 && gWrapper && btnPrevGaleri && btnNextGaleri) {
    // Otomatis membaca jumlah asli berdasarkan jumlah dots di HTML (sekarang = 5)
    const gTotalOriginal = gDots.length; 
    let gTimer;
    let isTransitioning = false; 

    // --- 1. PROSES KLONING OTOMATIS BERDASARKAN INDEKS (ANTI-BINGUNG) ---
    const cloneFirst = gSlides[0].cloneNode(true);                  // Slide 1
    const cloneSecond = gSlides[1].cloneNode(true);                 // Slide 2
    const cloneLast = gSlides[gSlides.length - 1].cloneNode(true);   // Slide Terakhir (Slide 5)
    const cloneSecondLast = gSlides[gSlides.length - 2].cloneNode(true); // Slide Sebelum Terakhir (Slide 4)

    // Tempel 2 clone di ekor (kanan)
    gTrack.appendChild(cloneFirst); 
    gTrack.appendChild(cloneSecond); 

    // Tempel 2 clone di kepala (kiri) secara mundur presisi
    gTrack.insertBefore(cloneLast, gSlides[0]); 
    gTrack.insertBefore(cloneSecondLast, cloneLast); 

    // Perbarui daftar slide pasca klon ganda
    gSlides = document.querySelectorAll('.galeri-slide');
    
    // KUNCI KOORDINAT: Start selalu di Index 2 (Slide 1 Asli) karena ada 2 tameng kloning di kiri
    let gIndex = 2; 

    function perbaruiGaleri(pakeAnimasi = true) {
        const wrapperWidth = gWrapper.offsetWidth;
        const slideWidth = gSlides[0].offsetWidth;
        
        if (slideWidth === 0) return;
        
        if (pakeAnimasi) {
            gTrack.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
        } else {
            gTrack.style.transition = "none";
        }
        
        // Rumus koordinat tengah otomatis
        const koordinatTengah = -gIndex * slideWidth + (wrapperWidth - slideWidth) / 2;
        gTrack.style.transform = `translateX(${koordinatTengah}px)`;
        
        // Rumus lingkaran dots dinamis (Bisa untuk 3, 5, atau berapa pun jumlah slidenya)
        let indexAsli = (gIndex - 2 + gTotalOriginal) % gTotalOriginal;
        if (indexAsli < 0) indexAsli = (indexAsli + gTotalOriginal) % gTotalOriginal;
        
        // Efek perbesaran slide aktif
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

    // --- 2. MEKANISME TELEPORTASI SEAMLESS MULTI-CLONE ---
    gTrack.addEventListener('transitionend', (e) => {
        if (e.target !== gTrack || e.propertyName !== 'transform') return;
        
        isTransitioning = false;
        
        // JIKA MENTOK KANAN: Pas geser sampai di Kloning Slide 1 (Index 7 jika total slide ada 5)
        if (gIndex === gTotalOriginal + 2) { 
            gTrack.style.transition = "none"; 
            gIndex = 2; // Lempar instan balik ke Slide 1 Asli
            perbaruiGaleri(false); 
        }
        
        // JIKA MENTOK KIRI: Pas geser sampai di Kloning Slide Terakhir (Index 1)
        if (gIndex === 1) {
            gTrack.style.transition = "none"; 
            gIndex = gTotalOriginal + 1; // Lempar instan balik ke Slide Terakhir Asli (Index 5)
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
            gIndex = idx + 2; // Melewati 2 clone awal
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

    window.addEventListener('load', () => perbaruiGaleri(false));
    window.addEventListener('resize', () => perbaruiGaleri(false));

    perbaruiGaleri(false);
    mulaiSiklusOtomatis();
}

// ==========================================================
// 4. LOGIKA BACKGROUND HERO SLIDESHOW (PURE SMOOTH CROSS-FADE)
// ==========================================================
const heroSection = document.querySelector('.content');

const kumpulanGambarHero = [
    'assets/home-1.svg',
    'assets/home-2.svg',
    'assets/home-3.svg',
    'assets/home-4.svg'
];

if (heroSection && kumpulanGambarHero.length > 0) {
    let indeksGambarSekarang = 0;
    const durasiGanti = 4000; 

    // Set kondisi awal gambar secara presisi
    heroSection.style.setProperty('--bg-current', `url('${kumpulanGambarHero[0]}')`);
    heroSection.style.setProperty('--bg-next', `url('${kumpulanGambarHero[1]}')`);

    function gantiLatarBelakang() {
        let indeksBerikutnya = (indeksGambarSekarang + 1) % kumpulanGambarHero.length;

        // Lapisan depan memudar maju secara halus menutupi background dasar
        heroSection.classList.add('is-crossfading');

        // Tunggu hingga durasi fade-in selesai sempurna (1.2 detik)
        setTimeout(() => {
            // 👉 LANGKAH A: Ubah gambar dasar di belakang mumpung masih ketutup tameng depan
            heroSection.style.setProperty('--bg-current', `url('${kumpulanGambarHero[indeksBerikutnya]}')`);
            
            // 👉 LANGKAH B (KUNCI SAKTI): Beri jeda mikro 100ms agar browser selesai melukis SVG baru tersebut
            setTimeout(() => {
                // Setelah gambar dasar di belakang matang & kembar murni, baru copot kelas transisinya
                heroSection.classList.remove('is-crossfading');

                // Perbarui tracker indeks saat ini
                indeksGambarSekarang = indeksBerikutnya;

                // Preload gambar berikutnya lagi di lapisan depan yang sudah kosong
                let indeksPreload = (indeksBerikutnya + 1) % kumpulanGambarHero.length;
                heroSection.style.setProperty('--bg-next', `url('${kumpulanGambarHero[indeksPreload]}')`);
            }, 100); // Jeda aman anti-stuttering browser
            
        }, 1200); 
    }

    let bgInterval = setInterval(gantiLatarBelakang, durasiGanti);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(bgInterval);
        } else {
            clearInterval(bgInterval);
            bgInterval = setInterval(gantiLatarBelakang, durasiGanti);
        }
    });
}