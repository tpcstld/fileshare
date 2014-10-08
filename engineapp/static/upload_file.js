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
    return true;
}

// Displays the error message in the callout panel
function displayMessage( message, isError ) {
    var downloadMessage = document.getElementById( "file-link" );
    downloadMessage.style.display = "block";
    downloadMessage.innerHTML = message;
    downloadMessage.classList.toggle( "error", isError );
    var button = document.getElementById( "submit-button" );
    button.innerHTML = "Upload";
    button.disabled = false;
    return !isError;
}

function validateFile() {
    // Check if there's no file.
    if($('#fileupload').val() == '') {
        return displayMessage( "No file.", true );
    }
    // Check if the file is too big.
    if ( !checkFileSize() ) {
        return displayMessage( "Upload must be smaller than 16MB.", true );
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

var options = {
    beforeSubmit: handleSubmit,
    resetForm: true,
    error: function( jqXHR, textStatus, errorThrown ) {
        if ( errorThrown == "Bad Request" ) {
            return displayMessage( jqXHR.responseText, true );
        } else if( errorThrown == "Not Found" ) {
            return displayMessage( "Error uploading file. Please refresh the page.", true );
        } else {
            return displayMessage( "An internal error has occurred! Please contact the creator of this site.", true );
        }
    },
    success: function( data ) {
        displayMessage( data, false );
    },
};

$('#fileupload-form').ajaxForm(options);

$('#submit-button').click( function(evt) {
    evt.preventDefault();
    $('#fileupload-form').ajaxSubmit(options);
    return false;
});
