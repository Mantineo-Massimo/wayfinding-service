from flask import Flask

# Creo un'app Flask che serve la cartella 'web' come static
app = Flask(__name__, static_folder='web', static_url_path='')

# root → index.html
@app.route('/')
def index():
    return app.send_static_file('index.html')

# qualsiasi altro path → file statico
@app.route('/<path:filename>')
def static_files(filename):
    return app.send_static_file(filename)

if __name__ == '__main__':
    # Modalità di debug locale
    app.run(host='0.0.0.0', port=8000, debug=True)
