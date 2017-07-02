/**
 * Created by jlane on 6/19/17.
 */

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
var username = getParameterByName('username');

console.log(username);
// Initialize Firebase
    var token = "";
    var mobileID = "";
    var config = {
        apiKey: "AIzaSyAGIzbtiI3cZuXucfVYL5yOmAeof3SXYTQ",
        authDomain: "project-1778606989379417911.firebaseapp.com",
        databaseURL: "https://project-1778606989379417911.firebaseio.com",
        projectId: "project-1778606989379417911",
        storageBucket: "project-1778606989379417911.appspot.com",
        messagingSenderId: "726501193964"
    };

    firebase.initializeApp(config);
    const messaging = firebase.messaging();
    const database = firebase.database();


    function getUserToken(username) {
        var dbObj = database.ref().child(username + '_mid');
        dbObj.on("value", function (data) {

            mobileID = data.val();

        });
        return mobileID;
    }
getUserToken(username); //"Solves" race condition
/*document.getElementById('test-btn').onclick = function(e) {
    console.log("The MobileID is " + getUserToken(username));
}*/

    messaging.requestPermission()
        .then(function() {
            console.log('enabled');
            messaging.getToken()
                .then(function(currentToken) {
                    if (currentToken) {
                        console.log(currentToken);
                        document.getElementById("key").value = currentToken;
                        token = currentToken;

                    }
                })
                .catch(function(err) {
                    console.log('No token fo you!', err);
                });
        })
        .catch(function(err) {
            console.log(err);
        });





document.getElementById('transfer-btn').onclick = function(e) {
    console.log(mobileID);
    var amount = document.getElementById("transferAmount").value;
    console.log(amount);
    var data = "{\"to\" : \"" + mobileID + "\",\"notification\": {\"title\": \"Golden Trust Bank\",\"body\": \"Incoming transfer request\"},\"data\" : {\"id\" : \"" + token + "\",\"msg\" : \"Transfer $1000 from Checking(3222) to Savings(4221)\"}}"
    xmlhttp = new XMLHttpRequest();
    var url = "https://fcm.googleapis.com/fcm/send";
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.setRequestHeader("Authorization", "key=AAAAqSbYeOw:APA91bENaXe0VytiOqiy6c5uOS-arXKWTKOvtwmbQfF9RgqsJJuQbIJV1oXBWJ3dVxK43Nh8FzH3ERJNcc298hcUHlGpOEw4gTui26dPJnUNv15MClRVwFnNrkaBUop9jSVVXAdB5YWf");
    try {
        xmlhttp.send(data);
    } catch (err) {
        console.log(err);
    }

    console.log(data);
    /*var confirmDiv = document.getElementById('confirm-div')
    confirmDiv.style.visibility = "visible";*/

    messaging.onMessage(function (payload) {
        console.log(Object.getOwnPropertyNames(payload.notification));
        console.log("Message recieved: ", payload.notification.body);
        document.getElementById("message").value = payload.notification.body;
        if (payload.notification.body === 'yes') {
            confirmDiv.innerHTML = "Confirmed"
        } else {
            confirmDiv.innerHTML = "Denied";
        }
    });
}








