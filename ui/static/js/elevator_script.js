/**
 * EN: Script for the Elevator Information Display.
 * IT: Script per il Display Informativo dell'Ascensore.
 */
document.addEventListener('DOMContentLoaded', function() {
    // EN: DOM element references. / IT: Riferimenti agli elementi del DOM.
    const dom = {
        clock: document.getElementById('clock'),
        date: document.getElementById('current-date'),
        location: document.getElementById('location-label'),
        floorNumber: document.getElementById('floor-number-circle'),
        floorTitle: document.getElementById('floor-title-text'),
        contentList: document.getElementById('content-list'),
        body: document.body,
        loader: document.getElementById('loader')
    };

    // EN: Application state. / IT: Stato dell'applicazione.
    const state = {
        currentLanguage: 'it',
        timeDifference: 0
    };

    // EN: Static configuration. / IT: Configurazione statica.
    const config = {
        languageToggleInterval: 15,
        timeServiceUrl: '/api/time/',
        dataRefreshInterval: 5 * 60
    };
    
    // EN: Translation strings for all static text.
    // IT: Stringhe per la traduzione di tutto il testo statico.
    const translations = {
        it: {
            phrases: { "PRIMO PIANO": "Primo Piano", "SECONDO PIANO": "Secondo Piano", "PIANO TERRA": "Piano Terra", "SEGRETERIA STUDENTI": "Segreteria Studenti", "AULE": "Aule", "STUDI DOCENTI": "Studi Docenti", "EDIFICIO": "Edificio", "BLOCCO 3": "Blocco 3", "AULE A-1-1 A-1-8": "Aule da A-1-1 a A-1-8", "LABORATORI RICERCA": "Laboratori di Ricerca", "SEGRETERIA AMMINISTRATIVA MIFT": "Segreteria Amministrativa Dipartimento MIFT", "DIREZIONE MIFT": "Direzione Dipartimento MIFT", "DIPARTIMENTO CHIBIOFARAM": "Dipartimento CHIBIOFARAM" }
        },
        en: {
            phrases: { "PRIMO PIANO": "First Floor", "SECONDO PIANO": "Second Floor", "PIANO TERRA": "Ground Floor", "SEGRETERIA STUDENTI": "Student Secretariat", "AULE": "Classrooms", "STUDI DOCENTI": "Professor Offices", "EDIFICIO": "Building", "BLOCCO 3": "Block 3", "AULE A-1-1 A-1-8": "Classrooms A-1-1 to A-1-8", "LABORATORI RICERCA": "Research Laboratories", "SEGRETERIA AMMINISTRATIVA MIFT": "Administrative Secretariat of the MIFT Department", "DIREZIONE MIFT": "Direction of the MIFT Department", "DIPARTIMENTO CHIBIOFARAM": "CHIBIOFARAM Department" }
        }
    };

    /**
     * EN: Dynamically adjusts font size to make long lists fit in the container.
     * IT: Regola dinamicamente la dimensione del font per far entrare le liste lunghe nel contenitore.
     */
    function fitContent() {
        const list = dom.contentList;
        const items = list.querySelectorAll('.content-item');
        if (!items || items.length === 0) return;
        items.forEach(item => item.style.fontSize = '');
        if (list.scrollHeight > list.clientHeight) {
            const scaleFactor = list.clientHeight / list.scrollHeight;
            const initialFontSize = parseFloat(window.getComputedStyle(items[0]).fontSize);
            const newFontSize = Math.floor(initialFontSize * scaleFactor * 0.98);
            items.forEach(item => item.style.fontSize = `${Math.max(16, newFontSize)}px`);
        }
    }
    
    /**
     * EN: Translates a phrase key from the URL into the current language.
     * IT: Traduce una chiave di frase dall'URL nella lingua corrente.
     */
    function translatePhrase(text) { 
        if (!text) return ''; 
        const formattedText = text.replace(/_/g, ' '); 
        const upperText = formattedText.toUpperCase(); 
        return translations[state.currentLanguage].phrases[upperText] || formattedText; 
    }

    /**
     * EN: Syncs time with the server.
     * IT: Sincronizza l'ora con il server.
     */
    function syncTimeWithServer() {
        fetch(config.timeServiceUrl)
            .then(response => { if (!response.ok) throw new Error('Time API failed'); return response.json(); })
            .then(data => {
                state.timeDifference = new Date(data.time) - new Date();
                dom.clock.style.color = '';
            })
            .catch(error => {
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
        const serverTime = new Date(new Date().getTime() + state.timeDifference);
        const timeOptions = { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        dom.clock.textContent = serverTime.toLocaleTimeString('it-IT', timeOptions);
        
        const dateOptions = { timeZone: 'Europe/Rome', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const locale = (state.currentLanguage === 'it') ? 'it-IT' : 'en-GB';
        const formattedDate = serverTime.toLocaleDateString(locale, dateOptions);
        dom.date.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    
    /**
     * EN: Reads URL parameters and updates the static content on the page.
     * IT: Legge i parametri URL e aggiorna il contenuto statico della pagina.
     */
    function updateStaticUI() {
        const params = new URLSearchParams(window.location.search);
        const floorParam = params.get('floor') || '0_PIANO_TERRA';
        const floorParts = floorParam.split('_');
        dom.floorNumber.textContent = floorParts[0];
        dom.floorTitle.textContent = translatePhrase(floorParts.slice(1).join('_'));
        
        dom.contentList.innerHTML = '';
        const contentParam = params.get('content') || 'N/A';
        const items = contentParam.split(',');
        dom.contentList.classList.toggle('multi-column', items.length > 5);
        
        const fragment = document.createDocumentFragment();
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'content-item';
            div.textContent = translatePhrase(item);
            fragment.appendChild(div);
        });
        dom.contentList.appendChild(fragment);
        
        const locationText = params.get('location');
        if (locationText) dom.location.textContent = translatePhrase(locationText);
        fitContent();
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
    
    window.onload = () => { if (dom.loader) dom.loader.classList.add('hidden'); };

    /**
     * EN: Main initialization function.
     * IT: Funzione di inizializzazione principale.
     */
    function init() {
        dom.body.className = 'lang-' + state.currentLanguage;
        updateStaticUI();
        syncTimeWithServer();

        let secondsCounter = 0;
        setInterval(() => {
            try {
                secondsCounter++;
                updateTimeDisplay();
                if (secondsCounter % config.languageToggleInterval === 0) toggleLanguage();
                if (secondsCounter % config.dataRefreshInterval === 0) syncTimeWithServer();
            } catch (e) { console.error("Error in main interval:", e); }
        }, 1000);

        setTimeout(() => window.location.reload(true), 4 * 60 * 60 * 1000);
    }

    init();
});