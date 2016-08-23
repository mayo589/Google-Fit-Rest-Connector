/*
    Author:     Marek Mihalech
    Year:       2016
*/

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
  if(secs > 0 || retVal === ""){
      retVal += secs + strSecs;
  }
  return retVal;
}

function days_between(date1, date2) {
    var ONE_DAY = 1000 * 60 * 60 * 24;
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
    var difference_ms = Math.abs(date1_ms - date2_ms);
    return Math.round(difference_ms/ONE_DAY);
}

Date.prototype.addDays = function(days){
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};


function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

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
