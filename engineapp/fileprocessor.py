from flask import request
from google.appengine.ext import ndb
import base58
import mimetypes
from google.appengine.ext import blobstore

class FileKey(ndb.Model):
    blob_key = ndb.BlobKeyProperty()
    last_seen = ndb.DateTimeProperty(auto_now=True)

def save_file(key):
    file_key = FileKey(blob_key=blobstore.BlobKey(key))
    data_key = file_key.put()
    return base58.encode(data_key.integer_id())

def get_blob(blob_key):
    return blobstore.BlobInfo.get(blob_key)   

def delete_file(blob_key):
    blob = get_blob(blob_key)
    blob.delete()

def get_file(data_id):
    try:
        key = base58.decode(data_id)
    except:
        return None

    file_key = FileKey.get_by_id(key)
    if file_key is None:
        return None

    file_key.put()
    return blobstore.BlobInfo(file_key.blob_key)   
