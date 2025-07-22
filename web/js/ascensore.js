// web/js/ascensore.js
;(function() {
  'use strict';

  // ===================================================================
  // FUNZIONI DI SUPPORTO
  // ===================================================================

  function getUrlParams() {
    var params = {};
    var search = window.location.search.substring(1);
    if (search) {
      var parts = search.split('&');
      for (var i = 0; i < parts.length; i++) {
        var pair = parts[i].split('=');
        if (pair[0]) {
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
      }
    }
    return {
      get: function(name) {
        return params[name] || null;
      }
    };
  }

  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  // ===================================================================
  // SISTEMA DI TRADUZIONE
  // ===================================================================

  const translations = {
    // Frasi Intere
    'PRIMO PIANO': 'First Floor', 'SECONDO PIANO': 'Second Floor',
    'TERZO PIANO': 'Third Floor', 'QUARTO PIANO': 'Fourth Floor',
    'PIANO TERRA': 'Ground Floor', 'STUDI DOCENTI': 'Teacher Offices',
    'LABORATORI DI RICERCA': 'Research Labs', 'SEGRETERIA STUDENTI': 'Student Secretariat',
    'SEGRETERIA AMMINISTRATIVA': 'Administrative Secretariat',

    // Parole Singole
    'PIANO': 'Floor', 'TERRA': 'Ground', 'PRIMO': 'First', 'SECONDO': 'Second', 'TERZO': 'Third', 'QUARTO': 'Fourth',
    'DIREZIONE': 'Direction', 'SEGRETERIA': 'Secretariat', 'AMMINISTRATIVA': 'Administrative',
    'STUDI': 'Offices', 'DOCENTI': 'Teachers', 'AULE': 'Classrooms', 'BLOCCO': 'Block', 
    'LABORATORI': 'Labs', 'DI': 'Of', 'RICERCA': 'Research',
    'DA': 'from', 'A': 'to', 'DIP.': 'Dep.', 'DIP': 'Dep.'
  };

  function translatePhrase(phrase) {
    if (currentLang !== 'en' || !phrase) {
        return phrase.replace(/_/g, ' ').replace(/\|/g, ' | ');
    }
    const formattedPhrase = phrase.replace(/_/g, ' ').replace(/\|/g, ' | ');
    const upperPhrase = formattedPhrase.toUpperCase();
    if (translations[upperPhrase]) {
        return translations[upperPhrase];
    }
    return formattedPhrase.split(' ').map(word => {
        const upperWord = word.toUpperCase();
        return translations[upperWord] || word;
    }).join(' ');
  }

  // ===================================================================
  // RIFERIMENTI AL DOM E CONFIGURAZIONE
  // ===================================================================
  const clockElem = document.getElementById('clock');
  const dateElem = document.getElementById('current-date');
  const blockLabelElm = document.getElementById('floor-label');
  const floorNumberCircle = document.getElementById('floor-number-circle');
  const floorTitleText = document.getElementById('floor-title-text');
  const contentList = document.getElementById('content-list');
  const params = getUrlParams();
  const LANGS = ['it', 'en'];
  let langIndex = 0;
  let currentLang = LANGS[0];
  const dayNamesIt = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const monthNamesIt = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dateParam = params.get('date') || new Date().toISOString().split('T')[0];

  // ===================================================================
  // FUNZIONI DI AGGIORNAMENTO
  // ===================================================================
  function updateClock() { const now = new Date(); clockElem.textContent = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`; }

  function formatDate(iso) {
    const [yy, mm, dd] = iso.split('-').map(s => parseInt(s, 10));
    const d = new Date(yy, mm - 1, dd);
    if (isNaN(d.getTime())) return '';
    let day, month;
    if (currentLang === 'it') {
        day = dayNamesIt[d.getDay()];
        month = monthNamesIt[mm - 1];
    } else {
        day = dayNamesEn[d.getDay()];
        month = monthNamesEn[mm - 1];
    }
    if (day) {
        day = day.charAt(0).toUpperCase() + day.slice(1);
    }
    return `${day} ${dd} ${month} ${yy}`;
  }

  function updateDate() {
    dateElem.textContent = formatDate(dateParam);
  }

  function updateElevatorDisplay() {
    const pianoRaw = params.get('piano');
    if (pianoRaw) {
        const parts = pianoRaw.split('_');
        if (floorNumberCircle) floorNumberCircle.textContent = parts[0] || '';
        if (floorTitleText) floorTitleText.textContent = translatePhrase(parts.slice(1).join('_'));
    }
    const contentRaw = params.get('contenuto');
    if (contentList && contentRaw) {
        contentList.innerHTML = '';
        const items = contentRaw.split(',');
        if (items.length > 4) {
            contentList.classList.add('multi-column');
        } else {
            contentList.classList.remove('multi-column');
        }
        items.forEach(function(item) {
            const div = document.createElement('div');
            div.className = 'content-item';
            div.innerHTML = translatePhrase(item.replace(/__/g, '<br>'));
            contentList.appendChild(div);
        });
    }
  }
  
  function updateBlockLabel() {
    const blockRaw = params.get('block');
    if (!blockRaw || !blockLabelElm) return;
    blockLabelElm.innerHTML = '';
    let idx = blockRaw.indexOf('_');
    if (idx === -1) { idx = blockRaw.indexOf(' '); }
    if (idx > -1) {
        const div1 = document.createElement('div'); div1.className = 'label-line1';
        div1.textContent = translatePhrase(blockRaw.slice(0, idx));
        const div2 = document.createElement('div'); div2.className = 'label-line2';
        div2.textContent = translatePhrase(blockRaw.slice(idx + 1));
        blockLabelElm.appendChild(div1); blockLabelElm.appendChild(div2);
    } else {
        blockLabelElm.textContent = translatePhrase(blockRaw);
    }
  }

  function toggleLang() {
    langIndex = 1 - langIndex;
    currentLang = LANGS[langIndex];
    document.body.classList.toggle('lang-it');
    document.body.classList.toggle('en');
    updateDate();
    updateElevatorDisplay();
    updateBlockLabel();
  }

  // ===================================================================
  // AVVIO
  // ===================================================================
  document.body.classList.add('lang-it');
  updateClock();
  updateDate();
  updateElevatorDisplay();
  updateBlockLabel();
  setInterval(updateClock, 1000);
  setInterval(toggleLang, 15000);
})();