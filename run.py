"""
EN: WSGI entry point for the Wayfinding Service.
IT: Punto di ingresso WSGI per il Wayfinding Service.
"""
from app import create_app

application = create_app()

if __name__ == '__main__':
    application.run(host='0.0.0.0', port=8080, debug=True)