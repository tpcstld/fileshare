function handleSubmit() {
    if($('#fileupload').val() == '') {
        return displayError( "No file." );
    }

    var button = document.getElementById( "submit-button" );
    button.innerHTML = "Uploading...";
    button.disabled = true;
    document.getElementById( "file-link" ).style.display = "none";
	
	uploadFile();
}

function displayError( message ) {
    var downloadMessage = document.getElementById( "file-link" );
    downloadMessage.style.display = "block";
    downloadMessage.innerHTML = message;
    downloadMessage.classList.toggle( "error", true );
    return false;
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
            if ( errorThrown == "Bad Request" ) {
                return displayError( jqXHR.responseText );
            } else {
                return displayError( "<b>An internal error has occurred!</b>" );
            }
        },
        complete: function( data ) {
            var downloadMessage = document.getElementById( "file-link" );
            downloadMessage.style.display = "block";
            var button = document.getElementById( "submit-button" );
            button.innerHTML = "Start";
            button.disabled = false;
            $('#fileupload').val(null);
        }
    } );
}

$('#fileupload').on( 'dragenter', function(event) {
    if (event.target === this) {
        $('#fileupload').addClass('dragdrop');
    }
});

$('#fileupload').on( 'dragleave', function(event) {
    if (event.target === this) {
        $('#fileupload').removeClass('dragdrop');
    }
});

$('#fileupload').on( 'drop', function(event) {
    if (event.target === this) {
        $('#fileupload').removeClass('dragdrop');
    }
});

$('#submit-button').click( function(evt) {
    evt.preventDefault();
    handleSubmit();
});
