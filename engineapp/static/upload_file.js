function handleSubmit() {
    if($('#fileupload').val() == '') {
        var downloadMessage = document.getElementById( "file-link" );
        downloadMessage.style.display = "block";
        downloadMessage.innerHTML = "No file.";
        return false;
    }

    var button = document.getElementById( "submit-button" );
    button.innerHTML = "Processing...";
    button.disabled = true;
    document.getElementById( "file-link" ).style.display = "none";
	
	uploadFile();
}

function uploadFile() {
    $.ajax( {
        url: $('#blobstore-url').data("url"),
        type: "POST",
        data: new FormData( $("form[name='fileupload-form']").get(0) ),
        processData: false,
        contentType: false,
        success: function( data ) {
            var downloadMessage = document.getElementById( "file-link" );
            downloadMessage.classList.toggle( "error", false );
            downloadMessage.innerHTML = data;
        },
        error: function( jqXHR, textStatus, errorThrown ) {
            var downloadMessage = document.getElementById( "file-link" );
            if ( errorThrown == "Bad Request" ) {
                downloadMessage.innerHTML = jqXHR.responseText;
            } else {
                downloadMessage.innerHTML = "<b>An internal error has occured!</b>"
            }
            downloadMessage.classList.toggle( "error", true );
        },
        complete: function( data ) {
            var downloadMessage = document.getElementById( "file-link" );
            downloadMessage.style.display = "block";
            var button = document.getElementById( "submit-button" );
            button.innerHTML = "Start";
            button.disabled = false;
        }
    } );
}
