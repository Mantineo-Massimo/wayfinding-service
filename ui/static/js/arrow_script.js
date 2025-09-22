/**
 * Script for the Directional Arrow Signage view - MODIFIED FOR UNIFIED TIME
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
        currentLanguage: 'it',
        timeDifference: 0 // NUOVO: Differenza tra ora server e ora locale
    };

    var config = {
        languageToggleInterval: 15, // in secondi
        // NUOVO: URL del time service e intervallo di re-sync
        timeServiceUrl: 'http://172.16.32.13/api/time/', // !!! SOSTITUIRE con l'IP del server !!!
        dataRefreshInterval: 5 * 60
    };

    var translations = {
        it: {
            days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
            months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
            words: { "USCITA": "Uscita", "AULE": "Aule", "BLOCCO": "Blocco", "EDIFICIO": "Edificio" }
        },
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            words: { "USCITA": "Exit", "AULE": "Classrooms", "BLOCCO": "Block", "EDIFICIO": "Building" }
        }
    };

    var padZero = function(n) { return n < 10 ? '0' + n : String(n); };

    function translateText(text) {
        if (!text) return { line1: '', line2: '' };
        var parts = text.split('_');
        var langWords = translations[state.currentLanguage].words;
        var line1 = langWords[parts[0].toUpperCase()] || parts[0];
        var line2 = parts.slice(1).join(' ');
        return { line1: line1, line2: line2 };
    }

    // NUOVA FUNZIONE per sincronizzare l'orario con il server
    function syncTimeWithServer() {
        fetch(config.timeServiceUrl)
            .then(function(response) { if (!response.ok) throw new Error('Time API failed'); return response.json(); })
            .then(function(data) {
                state.timeDifference = new Date(data.time) - new Date();
                dom.clock.style.color = ''; // Rimuove il colore rosso se la sync ha successo
            })
            .catch(function(error) {
                console.error('Could not sync time:', error);
                state.timeDifference = 0;
                dom.clock.style.color = 'red';
            });
    }

    // MODIFICATO: Aggiorna orologio e data con l'ora del server
    function updateTimeDisplay() {
        var serverTime = new Date(new Date().getTime() + state.timeDifference);
        var lang = translations[state.currentLanguage];
        
        // Aggiorna l'orologio (UTC)
        dom.clock.textContent = padZero(serverTime.getUTCHours()) + ':' + padZero(serverTime.getUTCMinutes()) + ':' + padZero(serverTime.getUTCSeconds());
        
        // Aggiorna la data (UTC)
        dom.date.textContent = lang.days[serverTime.getUTCDay()] + ' ' + serverTime.getUTCDate() + ' ' + lang.months[serverTime.getUTCMonth()] + ' ' + serverTime.getUTCFullYear();
    }

    function updateStaticUI() {
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

    window.onload = function() {
        var loader = document.getElementById('loader');
        if (loader) { loader.classList.add('hidden'); }
    };

    // MODIFICATO: Funzione di avvio
    function init() {
        var params = new URLSearchParams(window.location.search);
        var sides = ['left', 'center', 'right'];
        var directions = { 'down': 0, 'down-left': 45, 'left': 90, 'up-left': 135, 'up': 180, 'up-right': 225, 'right': 270, 'down-right': 315 };
        var visibleCount = 0;

        sides.forEach(function(side) {
            var labelText = params.get(side);
            if (!labelText) return;
            visibleCount++;
            var container = document.getElementById(side + '-container');
            container.style.display = 'flex';
            var arrowEl = document.getElementById(side + '-arrow');
            var direction = params.get(side + 'Direction') || 'down';
            arrowEl.style.transform = 'rotate(' + (directions[direction] || 0) + 'deg)';
            try {
                if (lottie) { lottie.loadAnimation({ container: arrowEl, renderer: 'svg', loop: true, autoplay: true, path: '/wayfinding/assets/arrow.json' }); }
            } catch (e) { console.error("Lottie animation failed:", e); }
        });

        if (visibleCount === 2) { dom.container.classList.add('two-items'); }

        dom.body.className = 'lang-' + state.currentLanguage;
        updateStaticUI();
        syncTimeWithServer(); // Sincronizza all'avvio

        var secondsCounter = 0;
        setInterval(function() {
            try {
                secondsCounter++;
                updateTimeDisplay(); // Aggiorna ora e data sincronizzate

                if (secondsCounter % config.languageToggleInterval === 0) {
                    toggleLanguage();
                }
                if (secondsCounter % config.dataRefreshInterval === 0) {
                    syncTimeWithServer(); // Risincronizza periodicamente
                }
            } catch (e) { console.error("Errore nell'intervallo principale:", e); }
        }, 1000);

        setTimeout(function() { window.location.reload(true); }, 4 * 60 * 60 * 1000);
    }

    init();
});