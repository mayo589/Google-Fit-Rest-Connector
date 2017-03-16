/*
    Author:     Marek Mihalech
    Year:       2016
    
    Description:
    Basic functionalities for setiing up oAuth connection for Google APIs
*/

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

/*
    Basic function for quering Google FIT Api.
    Runs synchronously.
    returns queried data in array of buckets
*/
function getAggregatedData(dataTypeName, startDate, endDate, bucketMillis) {
    var defer = $.Deferred();

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
                    if(typeof dataBucket.dataset[0].point != "undefined" &&
                        typeof dataBucket.dataset[0].point[0] != "undefined"){
                        bucketParsed.value = dataBucket.dataset[0].point[0].value[0].fpVal;
                    }
                    else{
                        bucketParsed.value = 0;
                    }
                    break;
                case  DataTypeName.STEPS:
                    if(typeof dataBucket.dataset[0].point != "undefined" &&
                        typeof dataBucket.dataset[0].point[0] != "undefined"){
                        bucketParsed.value = dataBucket.dataset[0].point[0].value[0].intVal; 
                    }
                    else{
                        bucketParsed.value = 0;
                    }
                    break;
                case DataTypeName.ACTIVITIES:
                {
                    bucketParsed.activities = [];
                    if(typeof dataBucket.dataset[0].point != "undefined"){
                        for(var j = 0; j < dataBucket.dataset[0].point.length; j++){
                            var activityData = dataBucket.dataset[0].point[j];
                            var activityParsed = {};
                            activityParsed.type = activityData.value[0].intVal;
                            activityParsed.name = activityTypes[activityParsed.type]; 
                            activityParsed.durationMillis = activityData.value[1].intVal;
                            activityParsed.startDate =  (new Date( parseInt(activityData.startTimeNanos.substr(0, activityData.startTimeNanos.length-6) )));  
                            activityParsed.endDate =  (new Date( parseInt(activityData.endTimeNanos.substr(0, activityData.endTimeNanos.length-6) )));
                            bucketParsed.activities.push(activityParsed);
                        }
                    }
                    break;
                }
                default:
                    break;
                }
                returnBuckets.push(bucketParsed);
            }
            retVal = returnBuckets;
            defer.resolve( retVal );
        },
        error: function () {
            if(arguments && arguments[0] && arguments[0].responseText){
                console.log(arguments[0].responseText);
                console.log(this.data);
            }
            defer.reject();
        },
        async: true
    });

    return defer;
}


/*
    returns Activity index by Activity name
*/
function getActivityTypeIndex(name){
    for(var i = 0; i < activityTypes.length; i++){
        if(name == activityTypes[i])
            return i;
    }
}


/*
    Array of supported Google Fit Activity types
*/
var activityTypes = [];
activityTypes[0]= 'In vehicle';
activityTypes[1]= 'Biking';
activityTypes[2]= 'On foot';
activityTypes[3]= 'Still (not moving)';
activityTypes[4]= 'Unknown (unable to detect activity)';
activityTypes[5]= 'Tilting (sudden device gravity change)';
activityTypes[7]= 'Walking';
activityTypes[8]= 'Running';
activityTypes[9]= 'Aerobics';
activityTypes[10]= 'Badminton';
activityTypes[11]= 'Baseball';
activityTypes[12]= 'Basketball';
activityTypes[13]= 'Biathlon';
activityTypes[14]= 'Handbiking';
activityTypes[15]= 'Mountain biking';
activityTypes[16]= 'Road biking';
activityTypes[17]= 'Spinning';
activityTypes[18]= 'Stationary biking';
activityTypes[19]= 'Utility biking';
activityTypes[20]= 'Boxing';
activityTypes[21]= 'Calisthenics';
activityTypes[22]= 'Circuit training';
activityTypes[23]= 'Cricket';
activityTypes[24]= 'Dancing';
activityTypes[25]= 'Elliptical';
activityTypes[26]= 'Fencing';
activityTypes[27]= 'Football (American)';
activityTypes[28]= 'Football (Australian)';
activityTypes[29]= 'Football (Soccer)';
activityTypes[30]= 'Frisbee';
activityTypes[31]= 'Gardening';
activityTypes[32]= 'Golf';
activityTypes[33]= 'Gymnastics';
activityTypes[34]= 'Handball';
activityTypes[35]= 'Hiking';
activityTypes[36]= 'Hockey';
activityTypes[37]= 'Horseback riding';
activityTypes[38]= 'Housework';
activityTypes[39]= 'Jumping rope';
activityTypes[40]= 'Kayaking';
activityTypes[41]= 'Kettlebell training';
activityTypes[42]= 'Kickboxing';
activityTypes[43]= 'Kitesurfing';
activityTypes[44]= 'Martial arts';
activityTypes[45]= 'Meditation';
activityTypes[46]= 'Mixed martial arts';
activityTypes[47]= 'P90X exercises';
activityTypes[48]= 'Paragliding';
activityTypes[49]= 'Pilates';
activityTypes[50]= 'Polo';
activityTypes[51]= 'Racquetball';
activityTypes[52]= 'Rock climbing';
activityTypes[53]= 'Rowing';
activityTypes[54]= 'Rowing machine';
activityTypes[55]= 'Rugby';
activityTypes[56]= 'Jogging';
activityTypes[57]= 'Running on sand';
activityTypes[58]= 'Running (treadmill)';
activityTypes[59]= 'Sailing';
activityTypes[60]= 'Scuba diving';
activityTypes[61]= 'Skateboarding';
activityTypes[62]= 'Skating';
activityTypes[63]= 'Cross skating';
activityTypes[64]= 'Inline skating (rollerblading)';
activityTypes[65]= 'Skiing';
activityTypes[66]= 'Back-country skiing';
activityTypes[67]= 'Cross-country skiing';
activityTypes[68]= 'Downhill skiing';
activityTypes[69]= 'Kite skiing';
activityTypes[70]= 'Roller skiing';
activityTypes[71]= 'Sledding';
activityTypes[72]= 'Sleeping';
activityTypes[73]= 'Snowboarding';
activityTypes[74]= 'Snowmobile';
activityTypes[75]= 'Snowshoeing';
activityTypes[76]= 'Squash';
activityTypes[77]= 'Stair climbing';
activityTypes[78]= 'Stair-climbing machine';
activityTypes[79]= 'Stand-up paddleboarding';
activityTypes[80]= 'Strength training';
activityTypes[81]= 'Surfing';
activityTypes[82]= 'Swimming';
activityTypes[83]= 'Swimming (swimming pool)';
activityTypes[84]= 'Swimming (open water)';
activityTypes[85]= 'Table tennis (ping pong)';
activityTypes[86]= 'Team sports';
activityTypes[87]= 'Tennis';
activityTypes[88]= 'Treadmill (walking or running)';
activityTypes[89]= 'Volleyball';
activityTypes[90]= 'Volleyball (beach)';
activityTypes[91]= 'Volleyball (indoor)';
activityTypes[92]= 'Wakeboarding';
activityTypes[93]= 'Walking (fitness)';
activityTypes[94]= 'Nording walking';
activityTypes[95]= 'Walking (treadmill)';
activityTypes[96]= 'Waterpolo';
activityTypes[97]= 'Weightlifting';
activityTypes[98]= 'Wheelchair';
activityTypes[99]= 'Windsurfing';
activityTypes[100]= 'Yoga';
activityTypes[101]= 'Zumba';
activityTypes[102]= 'Diving';
activityTypes[103]= 'Ergometer';
activityTypes[104]= 'Ice skating';
activityTypes[105]= 'Indoor skating';
activityTypes[106]= 'Curling';
activityTypes[108]= 'Other (unclassified fitness activity)';
activityTypes[109]= 'Light sleep';
activityTypes[110]= 'Deep sleep';
activityTypes[111]= 'REM sleep';
activityTypes[112]= 'Awake (during sleep cycle)';

