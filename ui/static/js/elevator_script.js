/**
 * Script for the Elevator Information Display - MODIFIED FOR UNIFIED TIME
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
        currentLanguage: 'it',
        timeDifference: 0 // NUOVO: Differenza tra ora server e ora locale
    };
    var config = {
        languageToggleInterval: 15, // in secondi
        // NUOVO: URL del time service e intervallo di re-sync
        timeServiceUrl: 'http://172.16.32.13/api/time/', // !!! SOSTITUIRE con l'IP del server !!!
        dataRefreshInterval: 5 * 60
    };

    function fitContent() {
        const list = dom.contentList;
        const items = list.querySelectorAll('.content-item');
        if (!items || items.length === 0) return;
        items.forEach(item => item.style.fontSize = '');
        const availableHeight = list.clientHeight;
        const contentHeight = list.scrollHeight;
        if (contentHeight > availableHeight) {
            const scaleFactor = availableHeight / contentHeight;
            const initialFontSize = parseFloat(window.getComputedStyle(items[0]).fontSize);
            let newFontSize = Math.floor(initialFontSize * scaleFactor * 0.98);
            if (newFontSize < 16) { newFontSize = 16; }
            items.forEach(item => item.style.fontSize = newFontSize + 'px');
        }
    }
    
    var translations = {
        it: {
            days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
            months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
            phrases: { "PRIMO PIANO": "Primo Piano", "SECONDO PIANO": "Secondo Piano", "PIANO TERRA": "Piano Terra", "SEGRETERIA STUDENTI": "Segreteria Studenti", "AULE": "Aule", "STUDI DOCENTI": "Studi Docenti", "EDIFICIO": "Edificio", "BLOCCO 3": "Blocco 3", "AULE A-1-1 A-1-8": "Aule da A-1-1 a A-1-8", "LABORATORI RICERCA": "Laboratori di Ricerca", "SEGRETERIA AMMINISTRATIVA MIFT": "Segreteria Amministrativa Dipartimento MIFT", "DIREZIONE MIFT": "Direzione Dipartimento MIFT", "DIPARTIMENTO CHIBIOFARAM": "Dipartimento CHIBIOFARAM" }
        },
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            phrases: { "PRIMO PIANO": "First Floor", "SECONDO PIANO": "Second Floor", "PIANO TERRA": "Ground Floor", "SEGRETERIA STUDENTI": "Student Secretariat", "AULE": "Aule", "STUDI DOCENTI": "Professor Offices", "EDIFICIO": "Building", "BLOCCO 3": "Block 3", "AULE A-1-1 A-1-8": "Classrooms A-1-1 to A-1-8", "LABORATORI RICERCA": "Research Laboratories", "SEGRETERIA AMMINISTRATIVA MIFT": "Administrative Secretariat of the MIFT Department", "DIREZIONE MIFT": "Direction of the MIFT Department", "DIPARTIMENTO CHIBIOFARAM": "CHIBIOFARAM Department" }
        }
    };

    var padZero = function(n) { return n < 10 ? '0' + n : String(n); };
    function translatePhrase(text) { if (!text) return ''; var formattedText = text.replace(/_/g, ' '); var upperText = formattedText.toUpperCase(); return translations[state.currentLanguage].phrases[upperText] || formattedText; }

    // NUOVA FUNZIONE per sincronizzare l'orario con il server
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

    // MODIFICATO: Aggiorna orologio e data con l'ora del server
    function updateTimeDisplay() {
        var serverTime = new Date(new Date().getTime() + state.timeDifference);
        var lang = translations[state.currentLanguage];
        
        dom.clock.textContent = padZero(serverTime.getUTCHours()) + ':' + padZero(serverTime.getUTCMinutes()) + ':' + padZero(serverTime.getUTCSeconds());
        dom.date.textContent = lang.days[serverTime.getUTCDay()] + ' ' + serverTime.getUTCDate() + ' ' + lang.months[serverTime.getUTCMonth()] + ' ' + serverTime.getUTCFullYear();
    }
    
    function updateStaticUI() {
        var params = new URLSearchParams(window.location.search);
        var floorParam = params.get('floor') || '0_PIANO_TERRA';
        var floorParts = floorParam.split('_');
        dom.floorNumber.textContent = floorParts[0];
        dom.floorTitle.textContent = translatePhrase(floorParts.slice(1).join('_'));
        dom.contentList.innerHTML = '';
        var contentParam = params.get('content') || 'N/A';
        var items = contentParam.split(',');
        dom.contentList.classList.toggle('multi-column', items.length > 5);
        var fragment = document.createDocumentFragment();
        items.forEach(function(item) {
            var div = document.createElement('div');
            div.className = 'content-item';
            div.textContent = translatePhrase(item);
            fragment.appendChild(div);
        });
        dom.contentList.appendChild(fragment);
        var locationText = params.get('location');
        if (locationText) dom.location.textContent = translatePhrase(locationText);
        fitContent();
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