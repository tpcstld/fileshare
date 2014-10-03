from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
from flask import make_response
from werkzeug.http import parse_options_header
import fileprocesser
import logging
from google.appengine.ext import blobstore

app = Flask(__name__)
app.debug = True
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Note: We don't need to call run() since our application is embedded within
# the App Engine WSGI application server.

@app.route('/')
def upload_file():
    upload_url = blobstore.create_upload_url('/upload')
    return render_template('upload_file.html', upload_url=upload_url)


@app.route('/upload', methods=['POST'])
def handle_upload():
    filedata = request.files['filedata']
    if not filedata:
        return "No file."
    header = filedata.headers['Content-Type']
    parsed_header = parse_options_header(header)
    blob_key = parsed_header[1]['blob-key']
    address = request.host_url + "serve/" + blob_key
    return "<a href=\"" + address + "\">" + address + "</a>"

@app.route('/serve/<blobstore_key>')
def view_file(blobstore_key):
    blob_info = blobstore.get(blobstore_key)
    if not blob_info:
        return "The file at this url does not exist or has expired.", 404
    response = make_response(blob_info.open().read())
    response.headers['Content-Type'] = blob_info.content_type
    response.headers['Content-Disposition'] = "filename=" + blob_info.filename
    return response


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404

@app.errorhandler(413)
def file_too_large(e):
    return "Only files below 16mb are allowed."
