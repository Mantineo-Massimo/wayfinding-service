/**
 * Script for the Directional Arrow Signage view - Robust & Legacy Browser Compatible Version.
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- Riferimenti al DOM ---
    var dom = {
        clock: document.getElementById('clock'),
        date: document.getElementById('current-date'),
        location: document.getElementById('location-label'),
        container: document.querySelector('.container'),
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

    // Correzione per compatibilità
    var padZero = function(n) { return n < 10 ? '0' + n : String(n); };

    function translateText(text) {
        if (!text) return { line1: '', line2: '' };
        var parts = text.split('_');
        var langWords = translations[state.currentLanguage].words;
        var line1 = langWords[parts[0].toUpperCase()] || parts[0];
        var line2 = parts.slice(1).join(' ');
        return { line1: line1, line2: line2 };
    }

    function updateClock() {
        var now = new Date();
        dom.clock.textContent = padZero(now.getHours()) + ':' + padZero(now.getMinutes()) + ':' + padZero(now.getSeconds());
    }

    function updateStaticUI() {
        var lang = translations[state.currentLanguage];
        var now = new Date();
        var dayName = lang.days[now.getDay()];
        var monthName = lang.months[now.getMonth()];
        dom.date.textContent = dayName + ' ' + now.getDate() + ' ' + monthName + ' ' + now.getFullYear();

        var params = new URLSearchParams(window.location.search);
        ['left', 'center', 'right'].forEach(function(side) {
            var labelText = params.get(side);
            var container = document.getElementById(side + '-container');
            if (labelText && container) {
                var translated = translateText(labelText);
                container.querySelector('.label-line1').textContent = translated.line1;
                container.querySelector('.label-line2').textContent = translated.line2;
            }
        });
        var locationText = params.get('location');
        if (locationText) {
            var translatedLocation = translateText(locationText);
            dom.location.innerHTML = (translatedLocation.line1 + ' ' + translatedLocation.line2).trim();
        }
    }

    function toggleLanguage() {
        state.currentLanguage = (state.currentLanguage === 'en') ? 'it' : 'en';
        dom.body.className = 'lang-' + state.currentLanguage;
        updateStaticUI();
    }

    // --- Logica per la Schermata di Caricamento ---
    // Aspetta che l'intera pagina (immagini, stili, etc.) sia completamente caricata
    window.onload = function() {
        var loader = document.getElementById('loader');
        if (loader) {
            // Aggiunge la classe 'hidden' per far scomparire il loader con una transizione
            loader.classList.add('hidden');
        }
    };

    function init() {
        var params = new URLSearchParams(window.location.search);
        var sides = ['left', 'center', 'right'];
        var directions = {
            'down': 0, 'down-left': 45, 'left': 90, 'up-left': 135,
            'up': 180, 'up-right': 225, 'right': 270, 'down-right': 315
        };
        var visibleCount = 0;

        sides.forEach(function(side) {
            var labelText = params.get(side);
            if (!labelText) return;

            visibleCount++;
            var container = document.getElementById(side + '-container');
            container.style.display = 'flex';
            
            var arrowEl = document.getElementById(side + '-arrow');
            var direction = params.get(side + 'Direction') || 'down';
            var rotation = directions[direction] || 0;
            arrowEl.style.transform = 'rotate(' + rotation + 'deg)';

            try {
                if (lottie) {
                    lottie.loadAnimation({
                        container: arrowEl,
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        path: '/wayfinding/assets/arrow.json'
                    });
                }
            } catch (e) {
                console.error("Lottie animation failed to load:", e);
            }
        });

        if (visibleCount === 2) {
            dom.container.classList.add('two-items');
        }

        dom.body.className = 'lang-' + state.currentLanguage;
        updateStaticUI();

        var secondsCounter = 0;
        // Aggiunto try...catch per robustezza
        setInterval(function() {
            try {
                secondsCounter++;
                updateClock();

                if (secondsCounter % config.languageToggleInterval === 0) {
                    toggleLanguage();
                }
            } catch (e) {
                console.error("Errore nell'intervallo principale:", e);
            }
        }, 1000);

        // Aggiunto ricaricamento pagina per stabilità
        setTimeout(function() { 
            window.location.reload(true); 
        }, 4 * 60 * 60 * 1000);
    }

    init();
});