/**
 * Script for the Directional Arrow Signage view.
 * - Parses URL parameters to determine which arrows and labels to display.
 * - Controls Lottie animations for arrows, including rotation.
 * - Manages bilingual text for labels and date overlays.
 */
document.addEventListener('DOMContentLoaded', () => {
    const getUrlParams = () => new URLSearchParams(window.location.search);
    const padZero = (n) => String(n).padStart(2, '0');
    let currentLanguage = 'en';

    const translations = {
        it: {
            days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
            months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
            words: {
                "USCITA": "Uscita",
                "AULE": "Aule",
                "BLOCCO": "Blocco",
                "EDIFICIO": "Edificio"
            }
        },
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            words: {
                "USCITA": "Exit",
                "AULE": "Classrooms",
                "BLOCCO": "Block",
                "EDIFICIO": "Building"
            }
        }
    };

    function translateText(text) {
        if (!text) return { line1: '', line2: '' };
        const parts = text.split('_');
        const langWords = translations[currentLanguage].words;
        const line1 = langWords[parts[0].toUpperCase()] || parts[0];
        const line2 = parts.slice(1).join(' ');
        return { line1, line2 };
    }

    // --- DOM Elements ---
    const dom = {
        clock: document.getElementById('clock'),
        date: document.getElementById('current-date'),
        location: document.getElementById('location-label'),
        container: document.querySelector('.container'),
        body: document.body
    };

    // --- Core UI Functions ---
    function updateClockAndDate() {
        const now = new Date();
        dom.clock.textContent = `${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;
        const lang = translations[currentLanguage];
        const dayName = lang.days[now.getDay()];
        const monthName = lang.months[now.getMonth()];
        dom.date.textContent = `${dayName} ${now.getDate()} ${now.getFullYear()}`;
    }

    function updateLabels() {
        const params = getUrlParams();
        // Update arrow labels
        ['left', 'center', 'right'].forEach(side => {
            const labelText = params.get(side);
            const container = document.getElementById(`${side}-container`);
            if (labelText && container) {
                const { line1, line2 } = translateText(labelText);
                container.querySelector('.label-line1').textContent = line1;
                container.querySelector('.label-line2').textContent = line2;
            }
        });
        // Update location label
        const locationText = params.get('location');
        if (locationText) {
            const { line1, line2 } = translateText(locationText);
            dom.location.innerHTML = `${line1} ${line2}`.trim();
        }
    }

    function toggleLanguage() {
        currentLanguage = (currentLanguage === 'en') ? 'it' : 'en';
        dom.body.classList.toggle('lang-en');
        dom.body.classList.toggle('lang-it');
        updateClockAndDate();
        updateLabels();
    }

// --- Initialization ---
    function init() {
        const params = getUrlParams();
        const sides = ['left', 'center', 'right'];
        const directions = {
            'down': 0, 'down-left': 45, 'left': 90, 'up-left': 135,
            'up': 180, 'up-right': 225, 'right': 270, 'down-right': 315
        };
        let visibleCount = 0;

        sides.forEach(side => {
            const labelText = params.get(side);
            if (!labelText) return;

            visibleCount++;
            const container = document.getElementById(`${side}-container`);
            container.style.display = 'flex';
            
            const arrowEl = document.getElementById(`${side}-arrow`);
            const direction = params.get(`${side}Direction`) || 'down';
            const rotation = directions[direction] || 0;
            arrowEl.style.transform = `rotate(${rotation}deg)`;

            lottie.loadAnimation({
                container: arrowEl,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                // MODIFICA: Aggiunto /wayfinding/ al percorso del file JSON
                path: '/wayfinding/assets/arrow.json'
            });
        });

        if (visibleCount === 2) {
            dom.container.classList.add('two-items');
        }

        updateClockAndDate();
        updateLabels();
        setInterval(updateClockAndDate, 1000);
        setInterval(toggleLanguage, 15000);
    }

    init();
});