function handleSubmit() {
    if ( !validateFile() ) {
        return false;
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

function validateFile() {
    // Check if there's no file.
    if($('#fileupload').val() == '') {
        return displayError( "No file." );
    }
    // Check if the file is too big.
    if ( !checkFileSize() ) {
        return displayError( "Upload must be smaller than 16MB." );
    }

    return true;
}

function checkFileSize() {
    var size = $('#fileupload')[0].files[0].size;
    if( size > 16 * 1024 * 1024 ) {
        return false;
    }
    return true;
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
            button.innerHTML = "Upload";
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
