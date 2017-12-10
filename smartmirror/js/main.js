// UTILITIES

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

// UI UPDATES

var locationString = "OH/43221";

var updateCurrentTemp = function() {
  getJSON('http://api.wunderground.com/api/13fa6ccf8c8d3753/conditions/q/' + locationString + '.json',
  function(err, data) {
    if (err == null) {
      let temp = Math.round(data.current_observation.temp_f);
      let icon = data.current_observation.icon;
      document.getElementsByClassName('temperature')[0].innerHTML = "<p><i class=\"wi wi-wu-" + icon + "\"></i>" + temp + "°</p>";
    }
  });
}

var updateCurrentTime = function() {
  let date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + '<span class="colon">:</span>' + minutes + ' ' + ampm;
  document.getElementsByClassName('time')[0].innerHTML = "<p>" + strTime + "</p>";
}

var updateForecast = function() {
  getJSON('http://api.wunderground.com/api/13fa6ccf8c8d3753/hourly/q/' + locationString + '.json',
  function(err, data) {
    if (err == null) {
      var i = 0;
      var hourlyString = "<h1>Forecast</h1>";
      for (i = 0; i < Math.min(5, data.hourly_forecast.length); i++) {
        let hourlyData = data.hourly_forecast[i];
        var hour = hourlyData.FCTTIME.hour;
        hour = hour % 12;
        hour = hour ? hour : 12; // the hour '0' should be '12'
        let ampm = hourlyData.FCTTIME.ampm.toLowerCase();
        hourlyString += "<div class=\"hourly-forecast\"><p>" + hour + " " + ampm + "</p><p><i class=\"wi wi-wu-" + hourlyData.icon + "\"></i></p><p>" + hourlyData.temp.english + "°</p></div>";
      }
      document.getElementsByClassName('forecast')[0].innerHTML = hourlyString;
    }
  });
}

var updateCalendar = function() {
  // getJSON('http://api.wunderground.com/api/13fa6ccf8c8d3753/conditions/q/' + locationString + '.json',
  // function(err, data) {
  //   if (err !== null) {
  //     // no-op
  //   } else {
  //     let temp = Math.round(data.current_observation.temp_f);
  //     document.getElementsByClassName('temperature')[0].innerHTML = "<p>" + temp + "°</p>";
  //   }
  // });
}

// MAIN

window.onload = function() {
  updateCurrentTime();
  updateForecast();
  updateCurrentTemp();
};