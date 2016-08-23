/*
    Author:     Marek Mihalech
    Year:       2016
*/

$(document).ready(function () {
    initializeDateTimePickers();
    refreshCodeInputs();
    
    if(typeof Cookies.get(COOKIE_GOOGLE_AUTH_CODE) != "undefined" && Cookies.get(COOKIE_GOOGLE_AUTH_CODE) !== ""){
        if(typeof Cookies.get(COOKIE_ACCESS_TOKEN) == "undefined" || Cookies.get(COOKIE_ACCESS_TOKEN) === ""){
            requestRefreshToken();
        }

        $("#not-logged").hide();
        $("#logged-in").show();
        displayCharts();
        displayCalendar();
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
    if(tokens !== null){
        var expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + tokens.expires_in);
        Cookies.set(COOKIE_ACCESS_TOKEN, tokens.access_token, { expires: expiration });
        Cookies.set(COOKIE_REFRESH_TOKEN, tokens.refresh_token, { expires: 365 });
        window.location.reload();
    }   
}

function requestRefreshToken(){
    var tokens = refreshAccessToken(Cookies.set(COOKIE_REFRESH_TOKEN));
    if(tokens !== null){
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

function parseAndDisplayBuckets(buckets){
    if($("#request-result").length > 0){
        var resultContainser = $("#request-result");
        resultContainser.empty();
        
        for(var i = 0; i < buckets.length; i++){
            var bucket = buckets[i];
            var bucketSpan = "<span>";
            
            bucketSpan += " start: " + bucket.startDate.toString();
            
            bucketSpan += " end: " + bucket.endDate.toString();
            
            if(typeof bucket.value != "undefined"){
                bucketSpan +=  " value: " + bucket.value;    
            }
            if(typeof bucket.activities != "undefined"){
                for(var j = 0; j < bucket.activities.length; j++){
                    var activity = bucket.activities[j];
                    bucketSpan += "<br><span style='margin-left: 50px;'></span>";
                    bucketSpan += " Activity type: " + activity.type + " - " + activity.name; 
                    bucketSpan += " Start: " + activity.startDate.toString();
                    bucketSpan += " End: " + activity.endDate.toString();
                    bucketSpan += " Duration: " + activity.durationMillis;
                }
            }
            
            bucketSpan += "</span><br>";
            
            $(resultContainser).append(bucketSpan);
        }
    }
}

function initializeDateTimePickers(){
    $.datetimepicker.setLocale('en');
    
    $('#startDatePicker').datetimepicker({
        timepicker: false,
        format:'Y/m/d',
    });
    
    $('#endDatePicker').datetimepicker({
        timepicker: false,
        format:'Y/m/d',
    });
}

function btnRequestClick(){
    //TODO validate input fields
    var startDate = new Date($("#startDatePicker").val());
    var endDate = new Date($("#endDatePicker").val());

    var selectedTypeVal = $("#select-datatype").val();
    var dataTypeName = "";
    switch(selectedTypeVal) {
        case "calories":
            dataTypeName = DataTypeName.CALORIES;
            break;
        case "activities":
            dataTypeName = DataTypeName.ACTIVITIES;
            break;
        case "steps":
            dataTypeName = DataTypeName.STEPS;
            break;
        case "distance":
            dataTypeName = DataTypeName.DISTANCE;
            break;
        default:
            break;
    }

    var selectedBucketBy = $("#select-bucketby").val();
    var bucketBy = "";
    switch(selectedBucketBy) {
        case "hour":
            bucketBy = BucketTimeMillis.HOUR;
            break;
        case "day":
            bucketBy =BucketTimeMillis.DAY;
            break;
        case "week":
            bucketBy = BucketTimeMillis.WEEK;
            break;
        case "month":
            bucketBy = BucketTimeMillis.MONTH;
            break;
        default:
            break;
    }

    var result = getAggregatedData(dataTypeName, startDate, endDate, bucketBy);
    parseAndDisplayBuckets(result, dataTypeName);
}