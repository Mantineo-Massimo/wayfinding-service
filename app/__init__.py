"""
EN: Application factory for the Wayfinding Service.
IT: "Application factory" per il Wayfinding Service.
"""
from flask import Flask
from flask_cors import CORS
from flask_talisman import Talisman
from . import config

def create_app():
    """
    EN: Creates and configures the Flask application instance.
    IT: Crea e configura l'istanza dell'applicazione Flask.
    """
    app = Flask(
        __name__,
        static_folder='../ui/static',
        template_folder='../ui'
    )
    
    app.config.from_object(config)
    
    # EN: Define a Content Security Policy (CSP) for Lottie and inline styles.
    # IT: Definisce una Content Security Policy (CSP) per Lottie e gli stili inline.
    csp = {
        'default-src': "'self'",
        'script-src': ["'self'", "https://cdnjs.cloudflare.com"],
        'style-src': ["'self'", "'unsafe-inline'"],
    }

    CORS(app)
    Talisman(app, force_https=False, content_security_policy=csp)

    # EN: Register the blueprint containing all routes.
    # IT: Registra il blueprint contenente tutte le rotte.
    from app.api.routes import bp as wayfinding_bp
    app.register_blueprint(wayfinding_bp, url_prefix='/wayfinding')
    
    return app