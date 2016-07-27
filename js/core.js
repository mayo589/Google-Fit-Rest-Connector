$(document).ready(function () {
    refreshCodeInputs();
    
    if(typeof Cookies.get(COOKIE_GOOGLE_AUTH_CODE) != "undefined" && Cookies.get(COOKIE_GOOGLE_AUTH_CODE) != ""){
        if(typeof Cookies.get(COOKIE_ACCESS_TOKEN) == "undefined" || Cookies.get(COOKIE_ACCESS_TOKEN) == ""){
            requestRefreshToken();
        }

        $("#not-logged").hide();
        $("#logged-in").show();
    }
    else{
        $("#not-logged").show();
        $("#logged-in").hide();
    }
    
});


function requestGoogleAuthToken(){
    $.when(requestGoogleoAuthCode()).then(function(google_auth_code) {
        Cookies.set(COOKIE_GOOGLE_AUTH_CODE, google_auth_code, { expires: 365 });
        refreshCodeInputs();
        
        requestAccessTokens();
        
        $("#not-logged").hide();
        $("#logged-in").show();
    });
}

function requestAccessTokens(){
    var tokens =  getAccessToken(Cookies.set(COOKIE_GOOGLE_AUTH_CODE));
    if(tokens != null){
        var expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + tokens.expires_in);
        Cookies.set(COOKIE_ACCESS_TOKEN, tokens.access_token, { expires: expiration });
        Cookies.set(COOKIE_REFRESH_TOKEN, tokens.refresh_token, { expires: 365 });
        refreshCodeInputs();
    }   
}

function requestRefreshToken(){
    var tokens = refreshAccessToken(Cookies.set(COOKIE_REFRESH_TOKEN));
    if(tokens != null){
        var expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + tokens.expires_in);
        Cookies.set(COOKIE_ACCESS_TOKEN, tokens.access_token, { expires: expiration });
        refreshCodeInputs();
    }   
}

function refreshCodeInputs(){
    $("#inp-google-auth-code").val(Cookies.get(COOKIE_GOOGLE_AUTH_CODE));
    $("#inp-access_token").val(Cookies.get(COOKIE_ACCESS_TOKEN));
    $("#inp-refresh-token").val(Cookies.get(COOKIE_REFRESH_TOKEN));
}

function resetCookies(){
    Cookies.remove(COOKIE_GOOGLE_AUTH_CODE);
    Cookies.remove(COOKIE_ACCESS_TOKEN);
    Cookies.remove(COOKIE_REFRESH_TOKEN);
    window.location.reload();
}

function resetAccessToken(){
    Cookies.remove(COOKIE_ACCESS_TOKEN); 
    window.location.reload();
}