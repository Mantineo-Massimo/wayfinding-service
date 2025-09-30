"""
EN: Automated tests for the Wayfinding Service API endpoints.
IT: Test automatici per gli endpoint API del Wayfinding Service.
"""
import pytest
import requests

# EN: The base URL points to the Nginx proxy.
# IT: L'URL di base punta al proxy Nginx.
BASE_URL = "http://127.0.0.1:80"


def test_health_check_endpoint():
    """
    EN: Tests the /health endpoint for a 200 OK response.
    IT: Testa l'endpoint /health per una risposta 200 OK.
    """
    response = requests.get(f"{BASE_URL}/wayfinding/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_arrow_view_success():
    """
    EN: Tests that the main arrow_view.html page loads correctly.
    IT: Testa che la pagina principale arrow_view.html si carichi correttamente.
    """
    response = requests.get(f"{BASE_URL}/wayfinding/arrow_view.html")
    assert response.status_code == 200
    assert "text/html" in response.headers['Content-Type']

def test_elevator_view_success():
    """
    EN: Tests that the main elevator_view.html page loads correctly.
    IT: Testa che la pagina principale elevator_view.html si carichi correttamente.
    """
    response = requests.get(f"{BASE_URL}/wayfinding/elevator_view.html")
    assert response.status_code == 200
    assert "text/html" in response.headers['Content-Type']


def test_non_existent_page_not_found():
    """
    EN: Tests that requesting a non-existent page returns a 404 Not Found.
    IT: Testa che la richiesta di una pagina inesistente restituisca 404 Not Found.
    """
    response = requests.get(f"{BASE_URL}/wayfinding/pagina_che_non_esiste.html")
    assert response.status_code == 404