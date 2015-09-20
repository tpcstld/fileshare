def set_content_disposition(blob_info):
    """Sets the content_disposition HTTP header on the file.

    The content disposition header determines the filename, and also
    determines whether or not the file should be displayed inside the browser.
    Sometimes displaying files in-browser is often inconvienent, or may open up
    XSS security holes. (.html files covers both cases.) Because of this, we
    only allow certain file types to be displayed in browser.

    Args:
        blob_info: The info on the blob to be sent.

    Returns:
        The content_disposition header to be attached to the file.
    """
    # "Safe" MIME types
    browser_mimes = [ 'application/pdf', 'image/', 'text/plain']

    # Allow only the above MIME types to be displayed in browser
    content_disposition = "filename=" + blob_info.filename
    if any(x for x in browser_mimes if x in blob_info.content_type):
        return content_disposition

    # The attachment keyword tells the browser to only download the file, and
    # not to try to display it in the browser
    return "attachment; " + content_disposition
