// Client ID and API key from the Developer Console
var CLIENT_ID = '200491473987-jibqvejgu2vpnrdi3k13t18lu8sb2856.apps.googleusercontent.com';
var API_KEY = 'AIzaSyC3zMnqrMV-vPKLC5LO5gG0joWQ3tNQhTM';

      // Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    var authorizeButton = document.getElementById('authorize-button');
    authorizeButton.onclick = handleAuthClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    var authorizeButton = document.getElementById('authorize-button');
    authorizeButton.style.display = 'none';
    listUpcomingEvents();
  } else {
    var authorizeButton = document.getElementById('authorize-button');
    authorizeButton.style.display = 'block';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  var nextMidnight = new Date();
  nextMidnight.setHours(24,0,0,0);

  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'timeMax': nextMidnight.toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    if (events.length > 0) {
      var runningHTML = "<h1>Calendar</h1><table>";
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        var timeString = "";
        if (!when) {
          timeString = "All day";
        } else {
          var hours = when.getHours();
          var minutes = when.getMinutes();
          var ampm = hours >= 12 ? 'pm' : 'am';
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          if (minutes == 0) {
            minutes = "";
          } else {
            minutes = minutes < 10 ? '0' + minutes : minutes;
            minutes = ":" + minutes;
          }
          timeString = hours + minutes + " " + ampm;
        }
        runningHTML += "<tr><td class=\"event-time\">" + timeString + "</td><td class=\"event-title\">" + event.summary + "</td></tr>";
      }
      document.getElementsByClassName('calendar')[0].innerHTML = runningHTML;
    } else {
      document.getElementsByClassName('calendar')[0].innerHTML = "<h1>Calendar</h1><p>No upcoming events today.</p>";
    }
  });
}