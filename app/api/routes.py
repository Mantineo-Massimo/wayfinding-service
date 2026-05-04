"""
EN: Defines all web routes for the static Wayfinding Service.
IT: Definisce tutte le rotte web per il Wayfinding Service statico.
"""
import os
from flask import Blueprint, jsonify, send_from_directory, current_app

bp = Blueprint('wayfinding', __name__)

# --- UI Serving Routes ---
@bp.route('/arrow_view.html')
def serve_arrow_view():
    """EN: Serves the arrow view HTML page. / IT: Serve la pagina HTML della vista frecce."""
    return send_from_directory(current_app.template_folder, 'arrow_view.html')

@bp.route('/elevator_view.html')
def serve_elevator_view():
    """EN: Serves the elevator view HTML page. / IT: Serve la pagina HTML della vista ascensore."""
    return send_from_directory(current_app.template_folder, 'elevator_view.html')

@bp.route('/assets/<path:path>')
def serve_assets(path):
    """EN: Serves asset files like images. / IT: Serve file di risorse come le immagini."""
    assets_folder = os.path.abspath(os.path.join(current_app.root_path, '..', 'ui', 'assets'))
    return send_from_directory(assets_folder, path)

@bp.route('/favicon.ico')
def favicon():
    """EN: Serves the favicon. / IT: Serve la favicon."""
    assets_folder = os.path.abspath(os.path.join(current_app.root_path, '..', 'ui', 'assets'))
    return send_from_directory(assets_folder, 'favicon.ico')

@bp.route('/health')
def health_check():
    """EN: Health check endpoint. / IT: Endpoint di health check."""
    return jsonify({"status": "ok"})