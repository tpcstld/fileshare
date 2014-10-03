from flask import request
from google.appengine.ext import ndb
import base58
import mimetypes
from google.appengine.api import files

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif',
                        'docx', 'doc'])

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

def save_file(filedata):
    if not allowed_file(filedata.filename):
        return "This extension is not allowed."

    mime, encoding = mimetypes.guess_type(filedata.filename, True)
    return filedata.filename + " " + mime


    
