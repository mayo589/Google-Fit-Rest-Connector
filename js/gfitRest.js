var URL_FTINESS_API = "https://www.googleapis.com/fitness/v1/";

var DataTypeName = {};
DataTypeName.CALORIES = "com.google.calories.expended";
DataTypeName.DISTANCE = "com.google.distance.delta";
DataTypeName.STEPS = "com.google.step_count.delta";
DataTypeName.ACTIVITIES = "com.google.activity.segment";

var BucketTimeMillis = {};
BucketTimeMillis.HOUR = 3600000;
BucketTimeMillis.DAY = BucketTimeMillis.HOUR * 24;
BucketTimeMillis.WEEK = BucketTimeMillis.DAY * 7;
BucketTimeMillis.MONTH = BucketTimeMillis.DAY * 30;

    

function getAggregatedData(dataTypeName, startDate, endDate, bucketMillis) {
    var retVal = null;
    var d =
    {
        "aggregateBy": 
        [
            {"dataTypeName": dataTypeName}
        ],
        "endTimeMillis": endDate.getTime().toString(),
        "startTimeMillis": startDate.getTime().toString(),
        "bucketByTime": {
            "durationMillis": bucketMillis
        }
    };
    
    jQuery.ajax({
        url: URL_FTINESS_API + 'users/me/dataset:aggregate',
        type : 'post',
        contentType: "application/json",
        data: JSON.stringify(d), 
        beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Bearer " + Cookies.get(COOKIE_ACCESS_TOKEN));
        },
        success: function (result) {
            console.log(result);
            retVal = result;
        },
        error: function () {
            
        },
        async: false
    });
    return retVal;
}
