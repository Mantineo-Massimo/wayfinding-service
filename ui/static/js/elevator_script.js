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

    var translations = {
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

    var padZero = function(n) { return String(n).padStart(2, '0'); };

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

    function updateStaticUI() {
        var lang = translations[state.currentLanguage];
        var now = new Date();
        var dayName = lang.days[now.getDay()];
        var monthName = lang.months[now.getMonth()];
        dom.date.textContent = dayName + ' ' + now.getDate() + ' ' + now.getFullYear();

        var params = new URLSearchParams(window.location.search);
        
        // Aggiorna Header Piano
        var floorParam = params.get('floor') || '0_PIANO_TERRA';
        var floorParts = floorParam.split('_');
        dom.floorNumber.textContent = floorParts[0];
        dom.floorTitle.textContent = translatePhrase(floorParts.slice(1).join('_'));

        // Aggiorna Lista Contenuti
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

        // Aggiorna Etichetta Location
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
