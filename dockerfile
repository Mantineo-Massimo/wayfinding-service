# ==============================================================================
# EN: Dockerfile for indication-kiosk-display
#     Minimal and production-ready image with Python, Flask and Gunicorn.
#
# IT: Dockerfile per indication-kiosk-display
#     Immagine minimale pronta per la produzione con Python, Flask e Gunicorn.
# ==============================================================================

FROM python:3.11-slim

# Imposta directory di lavoro
WORKDIR /app

# Copia requirements e installa dipendenze
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia tutto il codice dell’app
COPY . .

# Esponi la porta 8000
EXPOSE 8080

# Avvia Gunicorn su 0.0.0.0:8000
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--timeout", "360", "run:app"]
