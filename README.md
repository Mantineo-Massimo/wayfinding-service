# Wayfinding Service

![Python](https://img.shields.io/badge/Python-3.11-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![Status](https://img.shields.io/badge/Status-Production-brightgreen)

Un microservizio per mostrare indicazioni direzionali animate e informazioni sui piani, configurabile interamente tramite URL.

![Showcase del Servizio Arrow](https://github.com/Mantineo-Massimo/DigitalSignageSuite/blob/master/docs/wayfinding-arrow-showcase.png?raw=true)
![Showcase del Servizio Elevator](https://github.com/Mantineo-Massimo/DigitalSignageSuite/blob/master/docs/wayfinding-elevator-showcase.png?raw=true)

---

## Descrizione

Il **Wayfinding Service** è un microservizio leggero basato su Flask che fornisce due tipi di visualizzazioni per la guida all'interno di un edificio:

1.  **Vista Frecce (`arrow_view.html`)**: Mostra fino a tre frecce animate con etichette personalizzabili per guidare gli utenti.
2.  **Vista Ascensore (`elevator_view.html`)**: Mostra le informazioni relative a un piano specifico, come uffici, aule o dipartimenti.

La caratteristica principale del servizio è la sua **configurabilità dinamica**. Tutto il contenuto, incluse le etichette, le direzioni e le informazioni sui piani, viene passato direttamente tramite i parametri dell'URL, rendendolo estremamente versatile e facile da integrare.

---

## Funzionalità

* **Due Modalità di Visualizzazione**: Segnaletica direzionale (frecce) e informativa (ascensore).
* **Contenuto 100% Dinamico**: Tutto è configurato al volo tramite l'URL, senza dati salvati nel codice.
* **Supporto Bilingue**: Alterna automaticamente tra Italiano e Inglese per tutte le etichette.
* **Grafica Animata**: Utilizza la libreria Lottie per animazioni delle frecce fluide e leggere.
* **Servizio Dockerizzato**: Funziona come un container indipendente, facile da gestire e distribuire con Docker Compose.

---

## Tecnologie Utilizzate

* **Backend**: Python, Flask, Gunicorn
* **Frontend**: HTML5, CSS3, JavaScript
* **Animazione**: Lottie
* **Deployment**: Docker

---

## Avvio

Questo servizio è parte della `DigitalSignageSuite` e viene avviato tramite il file `docker-compose.yml` nella directory principale del progetto.

1.  Assicurati di essere nella cartella `DigitalSignageSuite`.
2.  Esegui il comando:
    ```bash
    docker compose up --build -d
    ```
3.  Il servizio sarà accessibile sulla porta **8083**.

---

## Configurazione e URL di Esempio

Per utilizzare il servizio, costruisci un URL specificando la vista e i parametri desiderati.

### Vista Frecce Direzionali (`arrow_view.html`)

Mostra frecce con indicazioni per aule e uscita.

* **URL:** `http://localhost:8083/arrow_view.html?left=Aule_1-10&leftDirection=left&center=Uscita&centerDirection=up&location=Blocco_A`

* **Parametri Disponibili:**

| Parametro       | Descrizione                                                                                           | Esempio                |
| :-------------- | :---------------------------------------------------------------------------------------------------- | :--------------------- |
| `left`, `center`, `right` | Il testo da mostrare per ogni freccia. Usa `_` per andare a capo.                                  | `Aule_1-10`            |
| `...Direction`  | L'orientamento della freccia. Valori: `up`, `down`, `left`, `right`, `up-left`, `up-right`, `down-left`, `down-right`. | `leftDirection=left`   |
| `location`      | Il testo da mostrare in basso a destra (es. la posizione attuale).                                    | `location=Blocco_A`    |

### Vista Display Ascensore (`elevator_view.html`)

Mostra le informazioni per un piano specifico.

* **URL:** `http://localhost:8083/elevator_view.html?floor=1_PRIMO_PIANO&content=AULE_1-5,STUDI_DOCENTI,SEGRETERIA&location=EDIFICIO_B`

* **Parametri Disponibili:**

| Parametro  | Descrizione                                                               | Esempio                            |
| :--------- | :------------------------------------------------------------------------ | :--------------------------------- |
| `floor`    | Il numero e il nome del piano, separati da `_`.                           | `floor=1_PRIMO_PIANO`              |
| `content`  | Elenco degli uffici/aule presenti sul piano, separati da virgola.          | `content=AULE_1-5,SEGRETERIA`      |
| `location` | L'edificio o la posizione attuale, mostrata in basso a destra.            | `location=EDIFICIO_B`              |