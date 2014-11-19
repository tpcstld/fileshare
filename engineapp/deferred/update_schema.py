import logging
from google.appengine.ext import deferred
from fileprocessor import FileKey
import datetime

def add_create_date():
    logging.info("started adding creation dates")
    keys = FileKey.query().fetch()
    for key in keys:
        if key.created_time is None:
            key.created_time = (datetime.datetime.min)
            key.put()
    logging.info("finished adding creation dates")
