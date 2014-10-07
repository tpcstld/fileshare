function handleSubmit() {
    // Check if there's no file.
    if($('#fileupload').val() == '') {
        return displayError( "No file." );
    }

    // Disable the submit button 
    var button = document.getElementById( "submit-button" );
    button.innerHTML = "Uploading...";
    button.disabled = true;

    // Hide the result callout panel
    document.getElementById( "file-link" ).style.display = "none";
	
	uploadFile();
}

// Displays the error message in the callout panel
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
            } else if( errorThrown == "Not Found" ) {
                return displayError( "Error uploading file. Please refresh the page." );
            } else {
                return displayError( "An internal error has occurred! Please contact the creator of this site." );
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
