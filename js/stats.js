/*
    Author:     Marek Mihalech
    Year:       2016
*/

function displayCharts(){
    $.when(getLastNMonthsValues(6, 1, DataTypeName.CALORIES)).then(function (dataCals) {
        displayChartCalories(dataCals); 
    });

    $.when(getLastNMonthsValues(6, 1, DataTypeName.DISTANCE)).then(function (dataDistance) {
        displayChartDistance(dataDistance); 
    });

    $.when(getLastNMonthsValues(6, 1, DataTypeName.STEPS)).then(function (dataSteps) {
        displayChartSteps(dataSteps); 
    });

    $.when( getLastNMonthsActivities(6, 1)).then(function (dataActivities) {
        displayChartActivities(dataActivities, 6, 1);
    });
    
    $.when( getLastNMonthsActivities(1, 1) ).then(function (dataMonthPie) {
        displayMonthPieChartActivities(dataMonthPie);
    });
}

function displayChartCalories(dataCals) {
    var ctxCals = document.getElementById("chart-calories");
    var chartCals = new Chart(ctxCals,
        {
            type: 'bar',
            data: {
                labels: getLastNMonthNames(6, 1),
                datasets: [{
                    label: 'Total Calories per month',
                    data: dataCals,
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
                            callback: function (value, index, values) {
                                return Math.round(value / 1000) + "k";
                            },
                        }
                    }]
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {
                        title: function (item, data) {
                            var title = "";
                            title += "Total Calorie outtake in " + item[0].xLabel + ": " + Math.round(item[0].yLabel);
                            return title;
                        },
                        label: function (item, data) {
                            var afterTitle = "";
                            var month = getMonthByName(item.xLabel);
                            afterTitle += "Average per day: " + Math.round(parseInt(item.yLabel) / daysInMonth(month, (new Date()).getFullYear()));
                            return afterTitle;
                        },

                    }
                },
                responsive: false
            },
        });
}

function displayChartDistance(dataDistance){
    var ctxDist = document.getElementById("chart-distance");
    var chartDistance = new Chart(ctxDist, 
    {
        type: 'line',
        data: {
            labels: getLastNMonthNames(6, 1),
            datasets: [{
                label: 'Total Distance per month',
                data: dataDistance,
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
                                return Math.round(value / 1000) + " km";
                            },
                    }
                }]
            },
            tooltips: {
                mode: 'label',
                callbacks: {
                    title: function(item, data) {
                        var title = "";
                        title += "Total distance in " + item[0].xLabel + ": " + (parseInt(item[0].yLabel) / 1000).toFixed(1)   + " km";
                        return title;
                    },
                    label: function(item, data){
                        var afterTitle = "";
                        var month = getMonthByName(item.xLabel);
                        afterTitle += "Average per day: " + ( (parseInt(item.yLabel) /  daysInMonth(month, (new Date()).getFullYear())) / 1000 ).toFixed(1) + " km"; 
                        return afterTitle;
                    },
                    
                }
            },
            responsive: false
        }, 
    });
}

function displayChartSteps(dataSteps){
    var ctxSteps = document.getElementById("chart-steps");
    var chartSteps = new Chart(ctxSteps, 
    {
        type: 'bar',
        data: {
            labels: getLastNMonthNames(6, 1),
            datasets: [{
                label: 'Total step count per month',
                data: dataSteps,
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
                                return Math.round(value / 1000) + "k";
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
                        var month = getMonthByName(item.xLabel);
                        afterTitle += "Average per day: " + Math.round( (parseInt(item.yLabel) /  daysInMonth(month, (new Date()).getFullYear())) ); 
                        return afterTitle;
                    },
                    
                }
            },
            responsive: false
        }, 
    });
}

function displayChartActivities(dataActivities, numOfMonth, offset){
    var ctxActivities = document.getElementById("chart-activities");
    var chartActivities = new Chart(ctxActivities, 
    {
        type: 'line',
        data: {
            labels: getLastNMonthNames(numOfMonth, offset),
            datasets: dataActivities, 
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

function displayMonthPieChartActivities(dataMonthPie){
    var lastMonthActivities = dataMonthPie;
    var labels = [];
    var pieData = [];
    var piecolors = [];
    for(var ds in lastMonthActivities){
        labels.push(lastMonthActivities[ds].label);
        pieData.push(lastMonthActivities[ds].data[0]);    
        piecolors.push(lastMonthActivities[ds].backgroundColor);
    }
    var ctxActivitiesMonthPie = document.getElementById("chart-month-pie");
    var chartActivitiesMonthPie = new Chart(ctxActivitiesMonthPie, 
    {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [
            {
                data: pieData,
                backgroundColor: piecolors,
            }],
        },
        options: {
            tooltips: {
                    mode: 'label', //single or label 
                    callbacks: {
                        label: function(item, data){
                            var afterTitle = "";
                            afterTitle += data.labels[item.index] + ": " + msToTime( data.datasets[item.datasetIndex].data[item.index] ); 
                            return afterTitle;
                        },
                    }
                },
            responsive: false,
        },
    });
}

function displayCalendar(){
    jQuery('#stats-calendar').datetimepicker({
        format:'d.m.Y',
        inline:true,
        timepicker:false,
        defaultDate: (new Date()).setHours(0,0,0,0),
        /*onChangeDateTime: function(current_time,$input){
            displayCalendarDayStats(current_time);
        },*/
        onGenerate: function(current_time,$input){
            $(this).addClass("stats-calendar-container"); //For css styling      
            displayCalendarDayStats(current_time);
        }
    });    
}

function displayCalendarDayStats(current_time){
    $("#stats-calendar-day .day-header td:nth-child(2)").text(current_time.toDateString());
            
    $.when(getAggregatedData(DataTypeName.CALORIES, current_time, (current_time).addDays(1), BucketTimeMillis.DAY )).then(function (d){
        var cals = d[0].value;
        $("#stats-calendar-day .day-cals td:nth-child(2)").text(Math.round(cals));
    });

    $.when(getAggregatedData(DataTypeName.DISTANCE, current_time, (current_time).addDays(1), BucketTimeMillis.DAY )).then(function (d){
        var dist = d[0].value;
        $("#stats-calendar-day .day-distance td:nth-child(2)").text(Math.round(dist));
    });

    $.when(getAggregatedData(DataTypeName.STEPS, current_time, (current_time).addDays(1), BucketTimeMillis.DAY )).then(function (d){
        var steps = d[0].value;
        $("#stats-calendar-day .day-steps td:nth-child(2)").text(steps);    
    });
    
    $("#stats-calendar-day .day-activity").remove();
    
    $.when(getAggregatedData(DataTypeName.ACTIVITIES, current_time, (current_time).addDays(1), BucketTimeMillis.DAY )).done(function (d){
        var activitiesResult = d;
        var activitiesHTML = "";
        for(var i = 0; i < activitiesResult[0].activities.length; i++){
            var activity = activitiesResult[0].activities[i];
            if(!isActivitySport(activity.name) ){
                continue;
            } 
            //$("#stats-calendar-day .day-activities").parent().append
            $("#stats-calendar-day .day-activities").parent().append("<tr class='day-activity'><td>" + activity.name + "</td><td>" + msToTime(activity.durationMillis, "short") + "</td></tr>");
        }

        if($("#stats-calendar-day .day-activity") === null || $("#stats-calendar-day .day-activity").length === 0){
            $("#stats-calendar-day .day-activities").parent().append("<tr class='day-activity'><td colspan='2'>No activities</td></tr>");
        }
    });   
}

function getLastNMonthsValues(numOfMonth, offset, dataType){
    var defer = $.Deferred();

    var monthCals = [];
    var today = new Date();
    var startDate = new Date(today.getFullYear(), today.getMonth()-numOfMonth-offset + 1, 1, 0, 0, 0, 0);
    var endDate = new Date(today.getFullYear(), today.getMonth()-offset + 1, 0, 0, 0, 0, 0);
    
    var tmpDate = startDate;
    
    var numDays = days_between(startDate, endDate);
    var requests = [];
    //Maximum treshold for query is 90 days
    for(var i = 1; i <= numDays; i = i + 89){
        var daysToAdd = 0;
        if(i+89 <= numDays)
            daysToAdd = 89;
        else
            daysToAdd = numDays - i + 1;
        
        requests.push(getAggregatedData(dataType, tmpDate, tmpDate.addDays(daysToAdd), BucketTimeMillis.DAY ) );
        tmpDate = tmpDate.addDays(daysToAdd);
    }

    $.when.apply($, requests).done(function () {
        $.each(arguments, function (i, data) {
            for(var j = 0; j < data.length; j++){
                if(typeof monthCals[data[j].endDate.getMonth()]  == "undefined")
                    monthCals[data[j].endDate.getMonth()] = 0;
             
                monthCals[data[j].endDate.getMonth()] += data[j].value;
            }
        });
        return defer.resolve(monthCals.filter(function(val){return val;}));
    });
    return defer.promise();
}

function getLastNMonthsActivities(numOfMonth, offset) {
    var defer = $.Deferred();
    var monthActivities = [];

    var today = new Date();
    var startDate = new Date(today.getFullYear(), today.getMonth() - numOfMonth - offset + 1, 1, 0, 0, 0, 0);
    var endDate = new Date(today.getFullYear(), today.getMonth() - offset + 1, 0, 0, 0, 0, 0);

    var tmpDate = startDate;
    var numDaysBetween = days_between(startDate, endDate);

    var requests = [];
    //Maximum treshold for query is 90 days
    for (var i = 1; i <= numDaysBetween; i = i + 89) {
        var daysToAdd = (i + 89 <= numDaysBetween) ? 89 :  (numDaysBetween - i + 1);

        requests.push(getAggregatedData(DataTypeName.ACTIVITIES, tmpDate, tmpDate.addDays(daysToAdd), BucketTimeMillis.DAY));
        tmpDate = tmpDate.addDays(daysToAdd);
    }

    $.when.apply($, requests).done(function () {
        $.each(arguments, function (i, data) {
            for (var k = 0; k < data.length; k++) {
                for (var j = 0; j < data[k].activities.length; j++) {
                    var activity = data[k].activities[j];
                    if (!isActivitySport(activity.name)) {
                        continue;
                    }

                    if (typeof monthActivities[activity.type] == "undefined") {
                        var color = randomColor({
                            luminosity: 'light',
                            format: 'rgba',
                            alpha: 0.6
                        });
                        monthActivities[activity.type] = {
                            label: activity.name,
                            data: Array.apply(null, Array(numOfMonth)).map(function () { return 0; }),
                            borderWidth: 1,
                            backgroundColor: color,
                            borderColor: color.replace("0.6", "1"),
                            borderJoinStyle: 'miter',
                            pointHitRadius: 10,
                        };

                    }

                    var monthIndex;
                    if(activity.startDate.getMonth() - startDate.getMonth() >= 0)
                        monthIndex = activity.startDate.getMonth() - startDate.getMonth();
                    else
                        monthIndex = activity.startDate.getMonth() + (12 - startDate.getMonth());
                    monthActivities[activity.type].data[monthIndex] += activity.durationMillis;
                }
            }
        });
        return defer.resolve(monthActivities.filter(function (val) { return val; }));
    });

    return defer.promise();
}

function isActivitySport(activityName){
    return  !(activityName.match(/still/i) ||
            activityName.match(/sleep/i) ||
            activityName.match(/vehicle/i) ||
            activityName.toLowerCase() == "walking");
} 