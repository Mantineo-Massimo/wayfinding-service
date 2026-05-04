/**
 * Script for the STATIC Directional Arrow Signage view.
 */
document.addEventListener('DOMContentLoaded', function () {
    // EN: DOM element references. / IT: Riferimenti agli elementi del DOM.
    var dom = {
        clock: document.getElementById('clock'),
        date: document.getElementById('current-date'),
        location: document.getElementById('location-label'),
        container: document.querySelector('.container'),
        body: document.body,
        loader: document.getElementById('loader')
    };

    // EN: Application state. / IT: Stato dell'applicazione.
    var state = {
        currentLanguage: 'it',
        timeDifference: 0,
        /**
         * EN: Helper to get URL parameters without URLSearchParams.
         */
        getUrlParameter: function(name) {
            var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }
    };

    // EN: Static configuration. / IT: Configurazione statica.
    var config = {
        languageToggleInterval: 15,
        timeServiceUrl: '/api/time/',
        dataRefreshInterval: 5 * 60
    };

    // EN: Translation strings. / IT: Stringhe per la traduzione.
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

    /**
     * EN: Translates a static label from the URL parameter (e.g., "AULE_1-10").
     * IT: Traduce un'etichetta statica dal parametro URL (es. "AULE_1-10").
     */
    function translateText(text) {
        if (!text) return { line1: '', line2: '' };
        var parts = text.split('_');
        var langWords = translations[state.currentLanguage].words;
        var line1 = langWords[parts[0].toUpperCase()] || parts[0];
        var line2 = parts.slice(1).join(' ');
        return { line1: line1, line2: line2 };
    }

    /**
     * EN: Syncs time with the server.
     * IT: Sincronizza l'ora con il server.
     */
    function syncTimeWithServer() {
        fetch(config.timeServiceUrl)
            .then(function(response) { if (!response.ok) throw new Error('Time API failed'); return response.json(); })
            .then(function(data) {
                state.timeDifference = new Date(data.time) - new Date();
                dom.clock.style.color = '';
            })
            .catch(function(error) {
                console.error('Could not sync time:', error);
                state.timeDifference = 0;
                dom.clock.style.color = 'red';
            });
    }

    /**
     * EN: Updates the clock and date display using Rome's timezone.
     * IT: Aggiorna l'orologio e la data usando il fuso orario di Roma.
     */
    function updateTimeDisplay() {
        var serverTime = new Date(new Date().getTime() + state.timeDifference);
        var timeOptions = { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        dom.clock.textContent = serverTime.toLocaleTimeString('it-IT', timeOptions);

        var dateOptions = { timeZone: 'Europe/Rome', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var locale = (state.currentLanguage === 'it') ? 'it-IT' : 'en-GB';
        var formattedDate = serverTime.toLocaleDateString(locale, dateOptions);
        dom.date.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }

    /**
     * EN: Reads URL parameters and updates the static labels on the page.
     * IT: Legge i parametri URL e aggiorna le etichette statiche sulla pagina.
     */
    function updateStaticUI() {
        ['left', 'center', 'right'].forEach(function(side) {
            var labelText = state.getUrlParameter(side);
            var container = document.getElementById(side + '-container');
            if (labelText && container) {
                var translated = translateText(labelText);
                container.querySelector('.label-line1').textContent = translated.line1;
                container.querySelector('.label-line2').textContent = translated.line2;
            }
        });
        var locationText = state.getUrlParameter('location');
        if (locationText) {
            var translatedLocation = translateText(locationText);
            dom.location.innerHTML = (translatedLocation.line1 + ' ' + translatedLocation.line2).trim();
        }
    }

    /**
     * EN: Toggles language and updates static text.
     * IT: Cambia lingua e aggiorna il testo statico.
     */
    function toggleLanguage() {
        state.currentLanguage = (state.currentLanguage === 'en') ? 'it' : 'en';
        dom.body.className = 'lang-' + state.currentLanguage;
        updateStaticUI();
    }

    window.onload = function() { if (dom.loader) dom.loader.classList.add('hidden'); };

    /**
     * EN: Main initialization function.
     * IT: Funzione di inizializzazione principale.
     */
    function init() {
        var sides = ['left', 'center', 'right'];
        var directions = { 'down': 0, 'down-left': 45, 'left': 90, 'up-left': 135, 'up': 180, 'up-right': 225, 'right': 270, 'down-right': 315 };

        sides.forEach(function(side) {
            var labelText = state.getUrlParameter(side);
            if (!labelText) return;

            var container = document.getElementById(side + '-container');
            container.style.display = 'flex';

            var arrowEl = document.getElementById(side + '-arrow');
            var direction = state.getUrlParameter(side + 'Direction') || 'down';
            arrowEl.style.transform = 'rotate(' + (directions[direction] || 0) + 'deg)';
            lottie.loadAnimation({ container: arrowEl, renderer: 'canvas', loop: true, autoplay: true, path: '/wayfinding/assets/arrow.json' });
        });

        dom.body.className = 'lang-' + state.currentLanguage;
        updateStaticUI();
        syncTimeWithServer();

        var secondsCounter = 0;
        setInterval(function() {
            secondsCounter++;
            updateTimeDisplay();
            if (secondsCounter % config.languageToggleInterval === 0) toggleLanguage();
            if (secondsCounter % config.dataRefreshInterval === 0) syncTimeWithServer();
        }, 1000);

        setTimeout(function() { window.location.reload(true); }, 4 * 60 * 60 * 1000);
    }

    init();
});