/**
 * Created by jlane on 6/19/17.
 */

var checkingAmt = "253089.00";
var savingsAmt = "2164104.00";
var creditAmt =  "377156";

checking = document.getElementById("checking");
savings = document.getElementById("savings");
credit = document.getElementById("credit");

checkingAmt = parseFloat(checkingAmt);
savingsAmt = parseFloat(savingsAmt);
creditAmt = parseFloat(checkingAmt);

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

Number.prototype.formatMoney = function(c, d, t){
    var n = this,d
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
var username = getParameterByName('username');
    console.log(checkingAmt.formatMoney(2,'.',','));
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
                       /* document.getElementById("key").value = currentToken;
*/                        token = currentToken;

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
    document.getElementById("confirmationWindow").style.visibility="visible";
    console.log(amount);
    var data = "{\"to\" : \"" + mobileID + "\",\"notification\": {\"title\": \"Golden Trust Bank\",\"body\": \"Incoming transfer request\"},\"data\" : {\"id\" : \"" + token + "\",\"msg\" : \"Transfer $" + amount + " from Checking(5167) to Savings(4261)\"}}"
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
    var confirmDiv = document.getElementById('confText')
    var approved = "Approved";
    var denied = "Denied";
    messaging.onMessage(function (payload) {
        console.log(Object.getOwnPropertyNames(payload.notification));
        console.log("Message recieved: ", payload.notification.body);
        //document.getElementById("message").value = payload.notification.body;
        if (payload.notification.body === 'yes') {
            confirmDiv.innerHTML = approved;
            var newChkAmt = checkingAmt - amount;
            var newSgAmt = savingsAmt + parseFloat(amount);
            console.log(newSgAmt);
            console.log(newChkAmt);

            savings.innerText = newSgAmt.formatMoney(2);
            checking.innerText = newChkAmt.formatMoney(2);

            setTimeout(function() {
                document.getElementById("confirmationWindow").style.visibility = "hidden";
            }, 1000);
        } else {
            confirmDiv.innerHTML = "Denied";
            setTimeout(function() {
                document.getElementById("confirmationWindow").style.visibility = "hidden";
            }, 1000);
        }
    });
}








