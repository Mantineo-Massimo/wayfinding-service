/**
 * Script for the Elevator Information Display - Centered & Dynamic Text Version
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

    /**
     * Adatta la dimensione del font della lista per garantire che tutto il
     * contenuto sia visibile senza barre di scorrimento.
     */
    function fitContent() {
        const list = dom.contentList;
        const items = list.querySelectorAll('.content-item');

        if (!items || items.length === 0) return;

        // Resetta lo stile per ricalcolare dal CSS base
        items.forEach(item => item.style.fontSize = '');

        const availableHeight = list.clientHeight;
        const contentHeight = list.scrollHeight;

        // Se il contenuto fuoriesce, calcola il fattore di scala e applicalo
        if (contentHeight > availableHeight) {
            const scaleFactor = availableHeight / contentHeight;
            const initialFontSize = parseFloat(window.getComputedStyle(items[0]).fontSize);
            let newFontSize = Math.floor(initialFontSize * scaleFactor * 0.98); // 0.98 per un piccolo margine di sicurezza

            // Imposta un limite minimo per la leggibilità
            if (newFontSize < 16) {
                newFontSize = 16;
            }

            items.forEach(item => item.style.fontSize = newFontSize + 'px');
        }
    }
    
    // --- Dizionario con le traduzioni ---
    var translations = {
        it: {
            days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
            months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
            phrases: { "PRIMO PIANO": "Primo Piano", "SECONDO PIANO": "Secondo Piano", "PIANO TERRA": "Piano Terra", "SEGRETERIA STUDENTI": "Segreteria Studenti", "AULE": "Aule", "STUDI DOCENTI": "Studi Docenti", "EDIFICIO": "Edificio", "BLOCCO 3": "Blocco 3", "AULE A-1-1 A-1-8": "Aule da A-1-1 a A-1-8", "LABORATORI RICERCA": "Laboratori di Ricerca", "SEGRETERIA AMMINISTRATIVA MIFT": "Segreteria Amministrativa Dipartimento MIFT", "DIREZIONE MIFT": "Direzione Dipartimento MIFT" }
        },
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            phrases: { "PRIMO PIANO": "First Floor", "SECONDO PIANO": "Second Floor", "PIANO TERRA": "Ground Floor", "SEGRETERIA STUDENTI": "Student Secretariat", "AULE": "Aule", "STUDI DOCENTI": "Professor Offices", "EDIFICIO": "Building", "BLOCCO 3": "Block 3", "AULE A-1-1 A-1-8": "Classrooms A-1-1 to A-1-8", "LABORATORI RICERCA": "Research Laboratories", "SEGRETERIA AMMINISTRATIVA MIFT": "Administrative Secretariat of the MIFT Department", "DIREZIONE MIFT": "Direction of the MIFT Department" }
        }
    };

    // Correzione per compatibilità
    var padZero = function(n) { return n < 10 ? '0' + n : String(n); };
    function translatePhrase(text) { if (!text) return ''; var formattedText = text.replace(/_/g, ' '); var upperText = formattedText.toUpperCase(); return translations[state.currentLanguage].phrases[upperText] || formattedText; }
    function updateClock() { var now = new Date(); dom.clock.textContent = padZero(now.getHours()) + ':' + padZero(now.getMinutes()) + ':' + padZero(now.getSeconds()); }

    function updateStaticUI() {
        var lang = translations[state.currentLanguage];
        var now = new Date();
        dom.date.textContent = lang.days[now.getDay()] + ' ' + now.getDate() + ' ' + lang.months[now.getMonth()] + ' ' + now.getFullYear();

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

        // Adatta il testo dopo averlo inserito
        fitContent();
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
        dom.body.className = 'lang-' + state.currentLanguage;
        updateStaticUI();

        setInterval(updateClock, 1000);
        setInterval(toggleLanguage, config.languageToggleInterval * 1000);

        // Ricarica periodica per prevenire problemi a lungo termine
        setTimeout(() => window.location.reload(true), 4 * 60 * 60 * 1000);
    }

    init();
});