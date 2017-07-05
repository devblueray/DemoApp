/**
 * Created by jlane on 6/28/17.
 */
username = document.getElementById("login_box");
password = document.getElementById("password_box");
console.log(username.value);

document.getElementById("login_btn").onclick = function(e) {
    if (username.value != "") {
        var form = document.createElement('form');
        form.setAttribute('method','get');
        form.setAttribute('action', 'accounts.html');
        form.setAttribute('username', 'jason');
        form.style.display = 'hidden';
        document.body.appendChild(form);
        form.submit();
    } else {
        alert("Enter a username");
    }
}


