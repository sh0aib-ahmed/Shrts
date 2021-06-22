$(document).ready(function(){

    $("#longUrl")
        .on('keypress',function(e) {
            if(e.keyCode == 13) {
                e.preventDefault();
                $("#alias").focus();

            }
        });

    $("#alias")
        .on('keypress',function(e) {
            if(e.keyCode == 13) {
                e.preventDefault();
                $("#shortenBtn").click();

            }
        });

    $("#copy-btn")
        .on("click", function(){
            copyToClipboard();
            $('#copy-btn')
                .removeClass('btn-secondary')
                .addClass('btn-success')
                .html("Copied");
            setTimeout(function(){
                $('#copy-btn')
                    .removeClass('btn-success')
                    .addClass('btn-secondary')
                    .html("Copy");
             }, 2000);
        });

    $('#goToUrlBtn')
        .on('click', function(){
            var url = $("#shortUrl").val();
            window.open(url, '_blank');
        });
    
    $('#shortenBtn')
        .on('click', function(){
            $('#shortUrlContainer, #status, #qrImage').addClass('hide');
            $("#qrImage").attr("src", '');
            var longUrl = $('#longUrl').val();
            var alias = $('#alias').val()
            if(!checkForValidUrl(longUrl)) {
                $('#status').html("Long Url Not Valid").removeClass('hide');
                return 0;
            }
            if(isUrlShortened(longUrl)) {
                $('#status').html("shrts1.herokuapp.com/ URL can't be Shortened").removeClass('hide');
                return 0;
            }
            if(checkForValidAlias(alias)) {
                $('#status').html("Alias May Contain Only (A-Z),(a-z),(1-9),(-),(_)").removeClass('hide');
                return 0;
            }
            if(!checkForValidLengthOfAlias(alias)) {
                $('#status').html("Alias must be atleast 4 characters long").removeClass('hide');
                return 0;
            }
            loading();
            urlShorten(longUrl, alias);
        });
  });

  function copyToClipboard() {
    var copyText = document.getElementById("shortUrl");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
  }

  function checkForValidUrl(url) {
    var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
}

function isUrlShortened(url) {
    if (url.indexOf("https://shrts1.herokuapp.com") !== -1 || url.indexOf("http://shrts1.herokuapp.com") !== -1 || url.indexOf("shrts1.herokuapp.com") !== -1) {
        return true;
    }
    return false;
}


function checkForValidAlias(alias) {
    var regexp = /[^A-Za-z0-9_-]+/;
    return regexp.test(alias);
}

function checkForValidLengthOfAlias(alias){
    if(alias.length < 4 && alias.length > 0) return false;
    return true;
}

function urlShorten(longUrl, alias) {
    var t;
    var data = {
        'longUrl': longUrl
    };
    if(alias.length){
        data.shortCode = alias;
    }
    var xhr = $.ajax({
		type: 'POST',
    	url: 'https://shrts1.herokuapp.com/api/url/',
		data: data,
		error: function (err) {
            clearTimeout(t);
            removeLoader();
            $('#status').html('Server Not Responding, Try again later.').removeClass('hide');
            return 0;
		},
		success: function (response) {
            clearTimeout(t);
			try {
				handleActions(response);
			} catch (e) {
                removeLoader();
                $('#status').html(e.message).removeClass('hide');
                return 0;
            }
		}
    });
    
    t = setTimeout(function(){
        xhr.abort();
        removeLoader();
        $('#status').html('Server Not Responding, Try again later.').removeClass('hide');
        return 0;
    },8000)
}

function handleActions(response) {
    if(!response.success) {
        removeLoader();
        $('#status').html(response.message).removeClass('hide');
        return 0;
    }
    $("#longUrl").val('');
    $("#alias").val('');
    $("#shortUrl").val(response.shortUrl);
    removeLoader();
    generateQRCode(response.shortUrl);
    $('#shortUrlContainer').removeClass('hide');
    
}

function loading(){
    $('#shortenBtn').html('Loading...');
}

function removeLoader(){
    $('#shortenBtn').html('Shorten');
}

function generateQRCode(shortUrl) {
    $("#qrImage")
        .attr("src", 'http://chart.apis.google.com/chart?cht=qr&chs=180x180&choe=UTF-8&chld=H|0&chl=' + shortUrl );
    $('#qrImage')
        .removeClass('hide');
}