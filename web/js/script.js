// web/js/script.js
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
  
  /**
   * Traduce una singola parola se la lingua è inglese.
   * @param {string} text Il testo da tradurre.
   * @returns {string} Il testo tradotto o l'originale.
   */
  function translate(text) {
      if (currentLang === 'en') {
          const upperText = text.toUpperCase();
          switch (upperText) {
              case 'Dipartimento': return 'Department';
              case 'USCITA': return 'EXIT';
              case 'BLOCCO': return 'BLOCK';
              // Aggiungi altre traduzioni qui
              default: return text;
          }
      }
      return text;
  }


  // ===================================================================
  // RIFERIMENTI AL DOM E CONFIGURAZIONE
  // ===================================================================

  const clockElem      = document.getElementById('clock');
  const dateElem       = document.getElementById('current-date');
  const blockLabelElm  = document.getElementById('floor-label');
  const container      = document.querySelector('.container');

  const params = getUrlParams();
  const sides = ['left', 'center', 'right'];


  // ===================================================================
  // GESTIONE OROLOGIO, DATA E LINGUA
  // ===================================================================

  const LANGS       = ['it', 'en'];
  let   langIndex   = 0;
  let   currentLang = LANGS[0];

  const dayNamesIt   = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const monthNamesIt = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  
  const dateParam = params.get('date') || new Date().toISOString().split('T')[0];

  function updateClock() {
    const now = new Date();
    clockElem.textContent = pad2(now.getHours()) + ':' + pad2(now.getMinutes()) + ':' + pad2(now.getSeconds());
  }

  function formatDate(iso) {
    const dateParts = iso.split('-');
    const yy = parseInt(dateParts[0], 10);
    const mm = parseInt(dateParts[1], 10);
    const dd = parseInt(dateParts[2], 10);
    const d = new Date(yy, mm - 1, dd);
    let day, month;

    if (currentLang === 'it') {
      day = dayNamesIt[d.getDay()];
      month = monthNamesIt[d.getMonth()];
    } else {
      day = d.toLocaleDateString('en-GB', { weekday: 'long' });
      month = d.toLocaleDateString('en-GB', { month: 'long' });
    }
    
    return day.charAt(0).toUpperCase() + day.slice(1) + ' ' + dd + ' ' + month + ' ' + yy;
  }

  function updateDate() {
    dateElem.textContent = formatDate(dateParam);
  }

  function updateLabels() {
    sides.forEach(function(side) {
        const raw = params.get(side);
        if (!raw) return;

        const cont = document.getElementById(side + '-container');
        const l1 = cont.querySelector('.label-line1');
        const l2 = cont.querySelector('.label-line2');
        
        let idx = raw.indexOf('_');
        if (idx === -1) { idx = raw.indexOf(' '); }
        
        if (idx > -1) {
            l1.textContent = translate(raw.slice(0, idx));
            l2.textContent = translate(raw.slice(idx + 1));
            l1.style.display = 'block';
        } else {
            l1.style.display = 'none';
            l2.textContent = translate(raw);
        }
    });
  }
  
  function updateBlockLabel() {
    const blockRaw = params.get('block');
    if (!blockRaw || !blockLabelElm) return;

    let idx = blockRaw.indexOf('_');
    if (idx === -1) { idx = blockRaw.indexOf(' '); }

    let div1 = blockLabelElm.querySelector('.label-line1');
    let div2 = blockLabelElm.querySelector('.label-line2');

    if (!div1) {
      blockLabelElm.innerHTML = '';
      div1 = document.createElement('div');
      div2 = document.createElement('div');
      div1.className = 'label-line1';
      div2.className = 'label-line2';
      blockLabelElm.appendChild(div1);
      blockLabelElm.appendChild(div2);
    }
    
    if (idx > -1) {
      div1.textContent = translate(blockRaw.slice(0, idx));
      div2.textContent = translate(blockRaw.slice(idx + 1));
      div1.style.display = 'inline';
    } else {
      div1.style.display = 'none';
      div2.textContent = translate(blockRaw);
    }
  }

  function toggleLang() {
    langIndex = 1 - langIndex;
    currentLang = LANGS[langIndex];
    document.body.classList.toggle('lang-it');
    document.body.classList.toggle('lang-en');
    updateDate();
    updateLabels();
    updateBlockLabel();
  }


  // ===================================================================
  // IMPOSTAZIONE INIZIALE
  // ===================================================================
  
  const defaultDir = (params.get('direction') || 'down').toLowerCase();
  let visibleCount = 0;

  sides.forEach(function(side) {
    const raw = params.get(side);
    if (!raw) return;
    
    visibleCount++;

    const cont = document.getElementById(side + '-container');
    const arrow = document.getElementById(side + '-arrow');
    
    cont.style.display = 'flex';

    const anim = lottie.loadAnimation({
      container: arrow,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/arrow.json'
    });

    anim.addEventListener('DOMLoaded', function() {
      const sideDir = params.get(side + 'Direction');
      const dir = (sideDir || defaultDir).toLowerCase();
      let deg = 0;
      switch (dir) {
        case 'down':       deg = 0;   break;
        case 'down-left':  deg = 45;  break;
        case 'left':       deg = 90;  break;
        case 'up-left':    deg = 135; break;
        case 'up':         deg = 180; break;
        case 'up-right':   deg = 225; break;
        case 'right':      deg = 270; break;
        case 'down-right': deg = 315; break;
      }
      arrow.style.transform = 'rotate(' + deg + 'deg)';
    });
  });

  if (visibleCount === 2) {
    container.classList.add('two-items');
  }


  // ===================================================================
  // AVVIO
  // ===================================================================

  document.body.classList.add('lang-it');
  updateClock();
  updateDate();
  updateLabels();
  updateBlockLabel();
  
  setInterval(updateClock, 1000);
  setInterval(toggleLang, 15000);

})();