/**
 * Script for the Elevator Information Display.
 * - Parses URL parameters to dynamically display floor number, title, and a list of contents.
 * - Manages bilingual text for all displayed information.
 * - Adapts to a multi-column layout for longer content lists.
 */
document.addEventListener('DOMContentLoaded', () => {
    const getUrlParams = () => new URLSearchParams(window.location.search);
    const padZero = (n) => String(n).padStart(2, '0');
    let currentLanguage = 'en';
    const translations = {
        it: {
            days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
            months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
            phrases: {
                "PRIMO PIANO": "Primo Piano", "SECONDO PIANO": "Secondo Piano", "PIANO TERRA": "Piano Terra",
                "SEGRETERIA STUDENTI": "Segreteria Studenti", "AULE": "Aule", "STUDI DOCENTI": "Studi Docenti",
                "EDIFICIO": "Edificio"
            }
        },
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            phrases: {
                "PRIMO PIANO": "First Floor", "SECONDO PIANO": "Second Floor", "PIANO TERRA": "Ground Floor",
                "SEGRETERIA STUDENTI": "Student Secretariat", "AULE": "Classrooms", "STUDI DOCENTI": "Professor Offices",
                "EDIFICIO": "Building"
            }
        }
    };
    function translatePhrase(text) {
        if (!text) return '';
        const formattedText = text.replace(/_/g, ' ');
        const upperText = formattedText.toUpperCase();
        return translations[currentLanguage].phrases[upperText] || formattedText;
    }

    // --- DOM Elements ---
    const dom = {
        clock: document.getElementById('clock'),
        date: document.getElementById('current-date'),
        location: document.getElementById('location-label'),
        floorNumber: document.getElementById('floor-number-circle'),
        floorTitle: document.getElementById('floor-title-text'),
        contentList: document.getElementById('content-list'),
        body: document.body
    };

    // --- Core UI Functions ---
    function updateClockAndDate() {
        const now = new Date();
        dom.clock.textContent = `${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;
        const lang = translations[currentLanguage];
        const dayName = lang.days[now.getDay()];
        const monthName = lang.months[now.getMonth()];
        dom.date.textContent = `${dayName} ${now.getDate()} ${monthName} ${now.getFullYear()}`;
    }

    function updateDisplayContent() {
        const params = getUrlParams();
        
        // Update Floor Header
        const floorParam = params.get('floor') || '0_PIANO_TERRA';
        const floorParts = floorParam.split('_');
        dom.floorNumber.textContent = floorParts[0];
        dom.floorTitle.textContent = translatePhrase(floorParts.slice(1).join('_'));

        // Update Content List
        dom.contentList.innerHTML = '';
        const contentParam = params.get('content') || 'N/A';
        const items = contentParam.split(',');
        
        if (items.length > 4) {
            dom.contentList.classList.add('multi-column');
        } else {
            dom.contentList.classList.remove('multi-column');
        }
        
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'content-item';
            div.textContent = translatePhrase(item);
            dom.contentList.appendChild(div);
        });

        // Update Location Label
        const locationText = params.get('location');
        if (locationText) {
           dom.location.textContent = translatePhrase(locationText);
        }
    }
    
    function toggleLanguage() {
        currentLanguage = (currentLanguage === 'en') ? 'it' : 'en';
        dom.body.classList.toggle('lang-en');
        dom.body.classList.toggle('lang-it');
        updateClockAndDate();
        updateDisplayContent();
    }

    // --- Initialization ---
    function init() {
        updateClockAndDate();
        updateDisplayContent();
        setInterval(updateClockAndDate, 1000);
        setInterval(toggleLanguage, 15000);
    }

    init();
});