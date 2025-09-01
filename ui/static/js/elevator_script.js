/**
 * Script for the Elevator Information Display - Legacy Browser Compatible Version.
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- Riferimenti al DOM ---
    var dom = {
        clock: document.getElementById('clock'),
        date: document.getElementById('current-date'),
        location: document.getElementById('location-label'),
        floorNumber: document.getElementById('floor-number-circle'),
        floorTitle: document.getElementById('floor-title-text'),
        contentList: document.getElementById('content-list'),
        body: document.body
    };

    // --- Stato e Configurazione ---
    var state = {
        currentLanguage: 'it'
    };

    var config = {
        languageToggleInterval: 15 // in secondi
    };

    // --- DIZIONARIO AGGIORNATO CON CAPITALIZZAZIONE CORRETTA ---
    var translations = {
        it: {
            days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
            months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
            phrases: {
                "PRIMO PIANO": "Primo Piano", 
                "SECONDO PIANO": "Secondo Piano", 
                "PIANO TERRA": "Piano Terra",
                "SEGRETERIA STUDENTI": "Segreteria Studenti", 
                "AULE": "Aule", 
                "STUDI DOCENTI": "Studi Docenti",
                "EDIFICIO": "Edificio",
                "BLOCCO 3": "Blocco 3",
                "AULE A-1-1 A-1-8": "Aule da A-1-1 a A-1-8",
                "LABORATORI RICERCA": "Laboratori di Ricerca",
                "SEGRETERIA AMMINISTRATIVA MIFT": "Segreteria Amministrativa MIFT",
                "DIREZIONE MIFT": "Direzione MIFT"
            }
        },
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            phrases: {
                "PRIMO PIANO": "First Floor", 
                "SECONDO PIANO": "Second Floor", 
                "PIANO TERRA": "Ground Floor",
                "SEGRETERIA STUDENTI": "Student Secretariat", 
                "AULE": "Aule", 
                "STUDI DOCENTI": "Professor Offices",
                "EDIFICIO": "Building",
                "BLOCCO 3": "Block 3",
                "AULE A-1-1 A-1-8": "Classrooms A-1-1 to  A-1-8",
                "LABORATORI RICERCA": "Research Laboratories",
                "SEGRETERIA AMMINISTRATIVA MIFT": "Administrative Secretariat of the MIFT",
                "DIREZIONE MIFT": "Direction of the MIFT"
            }
        }
    };

    var padZero = function(n) { return n < 10 ? '0' + n : String(n); };

    function translatePhrase(text) {
        if (!text) return '';
        var formattedText = text.replace(/_/g, ' ');
        var upperText = formattedText.toUpperCase();
        return translations[state.currentLanguage].phrases[upperText] || formattedText;
    }

    // --- Funzioni di Aggiornamento UI ---
    function updateClock() {
        var now = new Date();
        dom.clock.textContent = padZero(now.getHours()) + ':' + padZero(now.getMinutes()) + ':' + padZero(now.getSeconds());
    }

    // --- FUNZIONE AGGIORNATA SENZA .toLowerCase() ---
    function updateStaticUI() {
        var lang = translations[state.currentLanguage];
        var now = new Date();
        var dayName = lang.days[now.getDay()];
        var monthName = lang.months[now.getMonth()];
        dom.date.textContent = dayName + ' ' + now.getDate() + ' ' + monthName + ' ' + now.getFullYear();

        var params = new URLSearchParams(window.location.search);
        
        var floorParam = params.get('floor') || '0_PIANO_TERRA';
        var floorParts = floorParam.split('_');
        dom.floorNumber.textContent = floorParts[0];
        dom.floorTitle.textContent = translatePhrase(floorParts.slice(1).join('_'));

        dom.contentList.innerHTML = '';
        var contentParam = params.get('content') || 'N/A';
        var items = contentParam.split(',');
        
        if (items.length > 4) {
            dom.contentList.classList.add('multi-column');
        } else {
            dom.contentList.classList.remove('multi-column');
        }
        
        var fragment = document.createDocumentFragment();
        items.forEach(function(item) {
            var div = document.createElement('div');
            div.className = 'content-item';
            div.textContent = translatePhrase(item);
            fragment.appendChild(div);
        });
        dom.contentList.appendChild(fragment);

        var locationText = params.get('location');
        if (locationText) {
           dom.location.textContent = translatePhrase(locationText);
        }
    }
    
    function toggleLanguage() {
        state.currentLanguage = (state.currentLanguage === 'en') ? 'it' : 'en';
        dom.body.className = 'lang-' + state.currentLanguage;
        updateStaticUI();
    }

    // --- Inizializzazione ---
    function init() {
        dom.body.className = 'lang-' + state.currentLanguage;
        updateStaticUI();

        var secondsCounter = 0;
        setInterval(function() {
            secondsCounter++;
            updateClock();
            if (secondsCounter % config.languageToggleInterval === 0) {
                toggleLanguage();
            }
        }, 1000);
    }

    init();
});