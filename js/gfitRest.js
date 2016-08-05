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
            //retVal = result;
            var returnBuckets = [];
            for(var i = 0; i < result.bucket.length; i++){
                var dataBucket = result.bucket[i];
                
                var bucketParsed = {};
                bucketParsed.startDate = new Date( parseInt(dataBucket.startTimeMillis) );
                bucketParsed.endDate = new Date( parseInt(dataBucket.endTimeMillis) );
                
                switch(dataTypeName) {
                case DataTypeName.CALORIES:
                case DataTypeName.DISTANCE:
                    bucketParsed.value = dataBucket.dataset[0].point[0].value[0].fpVal;
                    break;
                case  DataTypeName.STEPS:
                    bucketParsed.value = dataBucket.dataset[0].point[0].value[0].intVal; 
                    break;
                case DataTypeName.ACTIVITIES:
                {
                    bucketParsed.activities = [];
                    for(var j = 0; j < dataBucket.dataset[0].point.length; j++){
                        var activityData = dataBucket.dataset[0].point[j];
                        var activityParsed = {};
                        activityParsed.type = activityData.value[0].intVal;
                        activityParsed.durationMillis = activityData.value[1].intVal;
                        activityParsed.startDate =  (new Date( parseInt(activityData.startTimeNanos.substr(0, activityData.startTimeNanos.length-6) )));  
                        activityParsed.endDate =  (new Date( parseInt(activityData.endTimeNanos.substr(0, activityData.endTimeNanos.length-6) )));
                        bucketParsed.activities.push(activityParsed);
                    }
                    break;
                }
                default:
                    break;
                }
                returnBuckets.push(bucketParsed);
            }
            retVal = returnBuckets;
        },
        error: function () {
            
        },
        async: false
    });
    return retVal;
}
