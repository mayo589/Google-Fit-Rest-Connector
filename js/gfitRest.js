
/*
$(document).ready(function () {

    /*var today = new Date();
    var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-10, 0, 0, 0, 0);
    var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 0)

    getDistanceFromActivities(startDate, endDate, []);*/
/*});


function getDistanceFromActivities(startDate, endDate, activityTypes){
    //sessions = getSessions
    //activitiesSessions = getActivitiesSessions(sessions)
    //foreach activitySession getDistance 

    getSessions(startDate, endDate);
}

function getSessions(startDate, endDate) {
    jQuery.ajax({
        url: 'https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=' + GoogleRFC3339DateString(startDate) + '&endTime=' + GoogleRFC3339DateString(endDate) + '&access_token=' + ACCESS_TOKEN,
        success: function (result) {
            console.log(result);
        },
        error: function () {
            
        },
        async: false
    });
}




function GoogleRFC3339DateString(d) {
    function pad(n) { return n < 10 ? '0' + n : n }
    return d.getUTCFullYear() + '-'
         + pad(d.getUTCMonth() + 1) + '-'
         + pad(d.getUTCDate()) + 'T'
         + pad(d.getUTCHours()) + ':'
         + pad(d.getUTCMinutes()) + ':'
         + pad(d.getUTCMilliseconds()) + '.'
         + pad(d.getUTCSeconds()) + 'Z'
}
*/