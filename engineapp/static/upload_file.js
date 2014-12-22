function handleSubmit() {
    if ( !validateFile() ) {
        return false;
    }
    // Disable the submit button 
    var button = document.getElementById( "submit-button" );
    button.innerHTML = "Uploading...";
    button.disabled = true;
    toggleLoadingBar( true );
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
    toggleLoadingBar( false );
    return !isError;
}

function toggleLoadingBar( show ) {
    $('#progress-meter').css('width','0%');
    if ( show ) {
        $('#progress-bar').css('display', 'block');
    } else {
        $('#progress-bar').css('display', 'none');
    }
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
    if( size > 30 * 1024 * 1024 ) {
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
            var json = JSON.parse(jqXHR.responseText);
            return displayMessage( json['message'], true );
        } else if( errorThrown == "Not Found" ) {
            return displayMessage( "Error uploading file. Please refresh the page.", true );
        } else {
            return displayMessage( "An internal error has occurred! Please contact the creator of this site.", true );
        }
    },
    uploadProgress: function( evt, position, total, percentComplete ) {
        $('#progress-meter').css( "width", percentComplete + "%" );
    },
    success: function( data ) {
        var json = JSON.parse( data );
        var url = window.location.origin + "/" + json['data_id'];
        displayMessage( "<a href=\"" + url + "\">" + url + "</a>", false );
    },
};

$('#fileupload-form').ajaxForm(options);

$('#submit-button').click( function(evt) {
    evt.preventDefault();
    $('#fileupload-form').ajaxSubmit(options);
    return false;
});
