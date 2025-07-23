"""
WSGI entrypoint for the Wayfinding Service.

This is a simple Flask application that serves static HTML, CSS, and JS files
for directional arrow and elevator displays. All logic is handled by the
frontend, driven by URL parameters.
"""
from flask import Flask

# Create a Flask app where the 'ui' directory is the root for all files.
# static_url_path='' means that files can be accessed from the root URL.
# e.g., http://localhost:8083/arrow_view.html
app = Flask(__name__, static_folder='ui', static_url_path='')

@app.route('/')
def index():
    """Serves the default arrow view page as the homepage for demonstration."""
    return app.send_static_file('arrow_view.html')

@app.route('/<path:filename>')
def serve_content(filename: str):
    """Serves any requested file from the 'ui' directory."""
    return app.send_static_file(filename)

if __name__ == '__main__':
    # This block is for local development only.
    app.run(host='0.0.0.0', port=8080, debug=True)