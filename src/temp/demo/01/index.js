function showlogin() {
  $('#loginmodal').modal('show');
}

function jwtlogin() {
  var name = $('#username').val();
  var pwd = $('#password').val();
  var token = ''
  console.log("user "+name);
  
  $.ajax({
    type: 'POST',
    contentType : "application/json",
    dataType : 'json',
    url: WEBSERVER+'auth/signin',
    data: JSON.stringify({ username: name , password: pwd }),
    success: function(resultData) {
      App.jwttoken = resultData.token;
      getJWTJSON('v1/getuserdetails.json','', function(usr) {
        console.log("got user data " + usr);
        App.usrid = usr.id;
        App.usrname = usr.username;
        saveAppData();
      });
    }
  });
}

function saveAppData() {
  console.log('Saving app data');
  localStorage.setItem(APP_DECL, JSON.stringify(App));
}
