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
        displayCharts();
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

function parseAndDisplay(buckets){
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

function displayCharts(){
    var ctxCals = document.getElementById("chart-calories");
    var chartCals = new Chart(ctxCals, 
    {
        type: 'bar',
        data: {
            labels: getLastNMonthNames(6, 1),
            datasets: [{
                label: 'Total Calories per month',
                data: getLastNMonthsCalories(6, 1),
                borderWidth: 1,
                backgroundColor: "rgba(75,192,192,0.6)",
                borderColor: "rgba(75,192,192,1)",
                borderJoinStyle: 'miter',
                pointHitRadius: 10,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                            callback: function(value, index, values) {
                                return Math.round(value / 1000) + "k"
                            },
                    }
                }]
            },
            tooltips: {
                mode: 'label',
                callbacks: {
                    title: function(item, data) {
                        var title = "";
                        title += "Total Calorie outtake in " + item[0].xLabel + ": " + item[0].yLabel;
                        return title;
                    },
                    label: function(item, data){
                        var afterTitle = "";
                        var month = getMonthByName(item.xLabel)
                        afterTitle += "Average per day: " + Math.round(parseInt(item.yLabel) /  daysInMonth(month, (new Date()).getFullYear())); 
                        return afterTitle;
                    },
                    
                }
            },
            responsive: false
        }, 
    });
    
    
    var ctxDist = document.getElementById("chart-distance");
    var chartDistance = new Chart(ctxDist, 
    {
        type: 'line',
        data: {
            labels: getLastNMonthNames(6, 1),
            datasets: [{
                label: 'Total Distance per month',
                data: getLastNMonthsDistance(6, 1),
                borderWidth: 1,
                backgroundColor: "rgba(63,191,63,0.6)",
                borderColor: "rgba(63,191,63,1)",
                borderJoinStyle: 'miter',
                pointHitRadius: 10,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                                return Math.round(value) + " km"
                            },
                    }
                }]
            },
            tooltips: {
                mode: 'label',
                callbacks: {
                    title: function(item, data) {
                        var title = "";
                        title += "Total distance in " + item[0].xLabel + ": " + parseInt(item[0].yLabel)  + " km";
                        return title;
                    },
                    label: function(item, data){
                        var afterTitle = "";
                        var month = getMonthByName(item.xLabel)
                        afterTitle += "Average per day: " + ( (parseInt(item.yLabel) /  daysInMonth(month, (new Date()).getFullYear())) ).toFixed(2) + " km"; 
                        return afterTitle;
                    },
                    
                }
            },
            responsive: false
        }, 
    });
    
    var ctxSteps = document.getElementById("chart-steps");
    var chartSteps = new Chart(ctxSteps, 
    {
        type: 'bar',
        data: {
            labels: getLastNMonthNames(6, 1),
            datasets: [{
                label: 'Total step count per month',
                data: getLastNMonthsSteps(6, 1),
                borderWidth: 1,
                backgroundColor: "rgba(191,63,63,0.6)",
                borderColor: "rgba(191,63,63,1)",
                borderJoinStyle: 'miter',
                pointHitRadius: 10,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                            callback: function(value, index, values) {
                                return Math.round(value / 1000) + "k"
                            },
                    }
                }]
            },
            tooltips: {
                mode: 'label',
                callbacks: {
                    title: function(item, data) {
                        var title = "";
                        title += "Total step count in " + item[0].xLabel + ": " + parseInt(item[0].yLabel);
                        return title;
                    },
                    label: function(item, data){
                        var afterTitle = "";
                        var month = getMonthByName(item.xLabel)
                        afterTitle += "Average per day: " + Math.round( (parseInt(item.yLabel) /  daysInMonth(month, (new Date()).getFullYear())) ); 
                        return afterTitle;
                    },
                    
                }
            },
            responsive: false
        }, 
    });
    
    var datasetActivities = getLastNMonthsActivities(6, 1);
    var ctxActivities = document.getElementById("chart-activities");
    var chartActivities = new Chart(ctxActivities, 
    {
        type: 'line',
        data: {
            labels: getLastNMonthNames(6, 1),
            datasets: datasetActivities, 
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                            callback: function(value, index, values) {
                                return msToTime(value, "short");
                            },
                            stepSize: 10800000
                    },
                }]
            },
            tooltips: {
                    mode: 'label', //single or label 
                    callbacks: {
                        title: function(item, data) {
                            var title = "";
                            var totalDuration = 0;
                            for(var i = 0; i < item.length; i++){
                                totalDuration += item[i].yLabel;
                            }
                            title += "Total sport activity duration in " + item[0].xLabel + ": " + msToTime(totalDuration);
                            return title;
                        },
                        label: function(item, data){
                            var afterTitle = "";
                            var month = getMonthByName(item.xLabel);
                            afterTitle += data.datasets[item.datasetIndex].label;
                            afterTitle += " total: " + msToTime(item.yLabel, "short");
                            afterTitle += " Average per day: " +  msToTime( (item.yLabel /  daysInMonth(month, (new Date()).getFullYear())), "short" ); 
                            return afterTitle;
                        },
                    }
                },
            responsive: false
        }, 
    });
}






var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}

function getMonthByName(monthName){
    for(var i = 0; i < monthNames.length; i++){
        if(monthNames[i] == monthName)
            return i;
    }
}


function getLastNMonthNames(numOfMonth, offset){
    var retMonthNames = [];
    for(var i = 0; i < numOfMonth; i++){
        var d = new Date();
        d.setMonth(d.getMonth()-i-offset);
        retMonthNames.push(monthNames[d.getMonth()]);
    }
    return retMonthNames.reverse();
}



function getLastNMonthsCalories(numOfMonth, offset){
    var monthCals = [];
    for(var i = 0; i < numOfMonth; i++){
        var today = new Date();
        var startDate = new Date(today.getFullYear(), today.getMonth()-i-offset, 1, 0, 0, 0, 0)
        var endDate = new Date(today.getFullYear(), today.getMonth()-i-offset+1, 0, 0, 0, 0, 0)
        
        var result = getAggregatedData(DataTypeName.CALORIES, startDate, endDate, BucketTimeMillis.MONTH )
        monthCals.push(Math.round(result[0].value));
    }
    return monthCals.reverse();
}

function getLastNMonthsSteps(numOfMonth, offset){
    var monthCals = [];
    for(var i = 0; i < numOfMonth; i++){
        var today = new Date();
        var startDate = new Date(today.getFullYear(), today.getMonth()-i-offset, 1, 0, 0, 0, 0)
        var endDate = new Date(today.getFullYear(), today.getMonth()-i-offset+1, 0, 0, 0, 0, 0)
        
        var result = getAggregatedData(DataTypeName.STEPS, startDate, endDate, BucketTimeMillis.MONTH )
        monthCals.push(Math.round(result[0].value));
    }
    return monthCals.reverse();
}

function getLastNMonthsDistance(numOfMonth, offset){
    var monthDist = [];
    for(var i = 0; i < numOfMonth; i++){
        var today = new Date();
        var startDate = new Date(today.getFullYear(), today.getMonth()-i-offset, 1, 0, 0, 0, 0)
        var endDate = new Date(today.getFullYear(), today.getMonth()-i-offset+1, 0, 0, 0, 0, 0)
        
        var result = getAggregatedData(DataTypeName.DISTANCE, startDate, endDate, BucketTimeMillis.MONTH )
        monthDist.push(Math.round(result[0].value) / 1000);
    }
    return monthDist.reverse();
}

function getLastNMonthsActivities(numOfMonth, offset){
    var monthActivities = [];
    
    for(var i = 0; i < numOfMonth; i++){
        var today = new Date();
        var startDate = new Date(today.getFullYear(), today.getMonth()-i-offset, 1, 0, 0, 0, 0)
        var endDate = new Date(today.getFullYear(), today.getMonth()-i-offset+1, 0, 0, 0, 0, 0)
        
        var result = getAggregatedData(DataTypeName.ACTIVITIES, startDate, endDate, BucketTimeMillis.MONTH )
        
        
        for(var j = 0; j < result[0].activities.length; j++){
            var activity = result[0].activities[j];
            if(activity.name.match(/still/i) ||
               activity.name.match(/sleep/i) ||
               activity.name.match(/vehicle/i) ||
               activity.name.match(/walking/i) ){
                   continue;
               }
            
            if(typeof monthActivities[activity.type] == "undefined"){
                var color = randomColor({
                    luminosity: 'light',
                    format: 'rgba',
                    alpha: 0.6 
                });
                monthActivities[activity.type] = {
                    label: activity.name,
                 
                    data: Array.apply(null, Array(numOfMonth)).map(function() { return 0 }),
                    borderWidth: 1,
                    backgroundColor: color,
                    borderColor: color.replace("0.6", "1"),
                    borderJoinStyle: 'miter',
                    pointHitRadius: 10,       
                };
                
            }
            
            monthActivities[activity.type].data[numOfMonth - i - 1] = activity.durationMillis;
        }        
    }
    return monthActivities.filter(function(val){return val});
}

function msToTime(s, type) {
    var strSecs, strHours, strMins = "";
    if(type == "short"){
        strHours = "h ";
        strMins = "m ";
        strSecs = "s ";
    }
    else{
        strHours = " hours ";
        strMins = " minutes ";
        strSecs = " seconds ";
    }
    
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  var retVal = "";
  if(hrs > 0){
        retVal += hrs + strHours; 
  }
  if(mins > 0){
      retVal += mins + strMins;
  }
  if(secs > 0 || retVal == ""){
      retVal += secs + strSecs;
  }
  return retVal;
}