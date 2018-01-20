
var provider = new firebase.auth.FacebookAuthProvider();
var signInPopupDisplayed = false;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("menu-signin").style.display = 'inline-block';
    document.getElementById("menu-signin").innerHTML = user.displayName;
    document.getElementById("fb-sign-in-info").style.display = 'none';
    document.getElementById("fb-sign-out-info").style.display = 'inline-block';
    document.getElementById("fb-sign-in").style.display = 'none';
    document.getElementById("fb-sign-out").style.display = 'inline-block';
  } else {
    document.getElementById("menu-signin").style.display = 'inline-block';
    document.getElementById("menu-signin").innerHTML = 'Sign in';
    document.getElementById("fb-sign-in-info").style.display = 'inline-block';
    document.getElementById("fb-sign-out-info").style.display = 'none';
    document.getElementById("fb-sign-in").style.display = 'inline-block';
    document.getElementById("fb-sign-out").style.display = 'none';
  }
});

document.getElementById('fb-sign-in').onclick = function() {
  fbSignIn();
  document.getElementById("menu-signin").innerHTML = user.displayName;
  toggleSignInPopup();
};

document.getElementById('fb-sign-out').onclick = function() {
  fbSignOut();
  toggleSignInPopup();
};

function toggleSignInPopup() {
  if (signInPopupDisplayed) {
    signInPopupDisplayed = false;
    document.getElementById('login-popup').style.display = 'none';
    document.getElementById('layout-container').style.display = 'block';
  } else {
    signInPopupDisplayed = true;
    document.getElementById('login-popup').style.display = 'block';
    document.getElementById('layout-container').style.display = 'none';
  }
}

function fbSignIn() {
  firebase.auth().signInWithPopup(provider).then(function(result) {
    token = result.credential.accessToken;
    user = result.user;
    db.collection("users").where("uid", "==", user.uid).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        userCreated = true;
      });
    }).then(function() {
      createNewUser()
    });
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
  });
}

function fbSignOut() {
  firebase.auth().signOut().then(function() {
    loggedInUser = null;
  }).catch(function(error) {});
}

function createNewUser() {
  if (!userCreated) {
    db.collection("users").doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAdmin: false
    });
  }
}
