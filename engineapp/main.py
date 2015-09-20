from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
from flask import Response
from werkzeug.http import parse_options_header
from google.appengine.ext import blobstore
import fileprocessor
import base58
import logging
import headersetter
import json

app = Flask(__name__)
app.debug = True
MAX_FILE_SIZE = 30 * 1024 * 1024

# Note: We don't need to call run() since our application is embedded within
# the App Engine WSGI application server.

@app.route('/')
def upload_file():
    upload_url = blobstore.create_upload_url('/upload')
    return render_template('upload_file.html', upload_url=upload_url)

@app.route('/upload', methods=['POST'])
def handle_upload():
    # check if a file exists
    # return an error it it doesn't exist
    filedata = request.files['filedata']
    if not filedata:
        return json.dumps({'message' : "No file."}), 400

    # extract the blob-key from the header
    header = filedata.headers['Content-Type']
    parsed_header = parse_options_header(header)
    blob_key = parsed_header[1]['blob-key']

    # check for the file size
    # delete the blob and return an error if it's too big.
    blob = fileprocessor.get_blob(blob_key)
    if blob.size > MAX_FILE_SIZE:
        fileprocessor.delete_file(blob_key)
        return json.dumps({'message' : "Upload must be smaller than 30MB."}), 400

    # save the blob key in a datastore for ordering
    # save_file returns the base58 datastore key
    data_id = fileprocessor.save_file(blob_key)

    # return a formatted url of the location of the file
    address = request.host_url + data_id
    return json.dumps({'data_id': data_id})

def generate_history(file_keys):
    output = []
    for file_key in file_keys:
        blob = blobstore.BlobInfo(file_key.blob_key)
        output.append({
            'url': base58.encode(file_key.key.id()),
            'filename' : blob.filename,
            'last_seen' : file_key.last_seen.isoformat() + "Z",
            'created_time' : file_key.created_time.isoformat() + "Z"
        })
    return output
@app.route('/history')
def show_history():
    upload_items = generate_history(fileprocessor.get_last_uploaded_files(10))
    viewed_items = generate_history(fileprocessor.get_last_viewed_files(10))
    return render_template('show_history.html', upload_items=upload_items, viewed_items=viewed_items)

@app.route('/search')
def search():
    filename = request.args.get('filename')
    if filename is None:
        return render_template('search.html', filename="")


    return render_template('search.html', filename=filename)

@app.route('/<data_key>')
def view_file(data_key):
    blob_info = fileprocessor.get_file(data_key)
    if not blob_info:
        return "The file at this url does not exist or has expired.", 404
    response = Response()
    response.headers['X-AppEngine-BlobKey'] = blob_info.key()
    response.headers['Content-Type'] = blob_info.content_type
    response.headers['Content-Length'] = blob_info.size
    response.headers['Content-Disposition'] = headersetter.set_content_disposition(blob_info)
    return response

@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404

@app.errorhandler(413)
def file_too_large(e):
    return "Only files below 30mb are allowed."
