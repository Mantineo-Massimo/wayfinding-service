import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='ui')

# --- Rotte per Servire i File dell'Interfaccia Utente ---

@app.route('/arrow_view.html')
def serve_arrow_view():
    return send_from_directory(app.static_folder, 'arrow_view.html')

@app.route('/elevator_view.html')
def serve_elevator_view():
    return send_from_directory(app.static_folder, 'elevator_view.html')

# --- Rotte Esplicite per Risorse Statiche ---

@app.route('/static/<path:path>')
def serve_static_files(path):
    return send_from_directory(os.path.join(app.static_folder, 'static'), path)

@app.route('/assets/<path:path>')
def serve_assets(path):
    return send_from_directory(os.path.join(app.static_folder, 'assets'), path)

@app.route('/favicon.ico')
def favicon():
    # Assumendo che il favicon sia in ui/assets/
    return send_from_directory(os.path.join(app.static_folder, 'assets'), 'favicon.ico')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)