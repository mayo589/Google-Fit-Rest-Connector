$(document).ready(function () {
    
    $.datetimepicker.setLocale('en');
    
    $('#startDatePicker').datetimepicker({
        timepicker: false,
        format:'Y/m/d',
    });
    
    $('#endDatePicker').datetimepicker({
        timepicker: false,
        format:'Y/m/d',
    });
    
    $("#btn-request").on("click", function (){
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
       parseAndDisplay(result, dataTypeName);
    });
    
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

function parseAndDisplay(data, dataTypeName){
    if($("#request-result").length > 0){
        var resultContainser = $("#request-result");
        resultContainser.empty();
        
        for(var i = 0; i < data.bucket.length; i++){
            var bucket = data.bucket[i];
            var bucketSpan = "<span>";
            
            bucketSpan += " start: ";
            var startDate = new Date( parseInt(bucket.startTimeMillis) );
            bucketSpan += startDate.toJSON();
            
            bucketSpan += " end: ";
            var endDate = new Date( parseInt(bucket.endTimeMillis) );
            bucketSpan += endDate.toJSON();
            
            var value = "";
            switch(dataTypeName) {
            case DataTypeName.CALORIES:
            case DataTypeName.DISTANCE:
                value = data.bucket[i].dataset[0].point[0].value[0].fpVal;
                break;
            case  DataTypeName.STEPS:
                value = data.bucket[i].dataset[0].point[0].value[0].intVal; 
                break;
            case DataTypeName.ACTIVITIES:
            {
                value = "";
                for(var j = 0; j < data.bucket[i].dataset[0].point.length; j++){
                    var activity = data.bucket[i].dataset[0].point[j];
                    value += "<br>";
                    value += "Activity: " + activity.value[0].intVal;
                    value += " Duration: " + activity.value[1].intVal;
                    value += " Start: " +  (new Date( parseInt(activity.startTimeNanos.substr(0, activity.startTimeNanos.length-6) ))).toString();  
                    value += " End: " +  (new Date( parseInt(activity.endTimeNanos.substr(0, activity.endTimeNanos.length-6) ))).toString();
                }
                break;
            }
            default:
                break;
            }
            
            bucketSpan +=  " value: " + value;
            
            bucketSpan += "</span><br>";
            
            $(resultContainser).append(bucketSpan);
        }
    }
}