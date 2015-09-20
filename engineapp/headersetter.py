def set_content_disposition(blob_info):
    # "safe" mime types
    browser_mimes = [ 'application/pdf', 'image/', 'text/plain']

    # allow only above mime types to be displayed in browser
    content_disposition = "filename=" + blob_info.filename
    if any(x for x in browser_mimes if x in blob_info.content_type):
        return content_disposition

    return "attachment; " + content_disposition
