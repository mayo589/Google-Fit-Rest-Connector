# Google Fit REST Connector

This REST connector provides access to Google Fit APIs. It stores Google Auth codes, Access and Refresh tokens in browsers cookies, you may use your own storage for these codes.

Provided functionalities:
  - Get Calorie Outcome between date range
  - Get Steps between date range
  - Get Distance between date range
  - Get Activities with duration between dates


This plugin use following libraries and frameworks:

* [jQuery] - used for DOM manipulations
* [Chartjs] - awesome tools for charts
* [CookieJs] - used to store Access, Refresh and Google Auth tokens
* [jQuery DateTime picker] - picker for date range inputs
* [randomColor] - for generating nice & bright graph colors

### Installation

You need to change variables in file oAuth2utils.js. You can obtain these variables by creating new API in [Google Dev Console]
```sh
var CLIENT_SECRET = "<Your App Client Secret>";
var CLIENT_ID = "<Your App Client ID>";
var CLIENT_REDIRECT = "<Client Redirect>";
```

### ScreenShots

Overview of Distance, Steps and Calories over 6 months:

![Google Fit REST Connector](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Example")

Last 6 month sport activities:

![Google Fit REST Connector](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Example")


Calendar view of specific day:

![Google Fit REST Connector](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Example")

### License
This API connector is released under MIT License, however other tools and framework it uses might have different licenses.

   [jQuery]: <https://jquery.com/>
   [Chartjs]: <http://www.chartjs.org/>
   [CookieJs]: <https://github.com/js-cookie/js-cookie>
   [jQuery DateTime picker]: <http://xdsoft.net/jqplugins/datetimepicker/>
   [randomColor]: <https://github.com/davidmerfield/randomColor>
   [Google Dev Console]: <https://console.developers.google.com/>
