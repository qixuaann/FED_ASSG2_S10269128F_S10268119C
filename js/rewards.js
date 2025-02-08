
// dynamic profile
// retrieve the logged-in user details from localstorage.
if (!(JSON.parse(localStorage.getItem("loggedInUser")))) {
    if (signUpButton) signUpButton.style.display = "inline-block";
    if (loginButton) loginButton.style.display = "inline-block";
  
    // Remove any existing profile avatar
    const existingAvatar = document.querySelector(".top-bar .avatar");
    if (existingAvatar) {
      existingAvatar.remove();
    }
    else {
      // Hide Sign Up & Log In buttons
      if (signUpButton) signUpButton.style.display = "none";
      if (loginButton) loginButton.style.display = "none";
    }
  }
  
    const loggedinuser = JSON.parse(localStorage.getItem("loggedInUser")) 
  
    // update the profile card (if the element exists)
    const avatarEl = document.getElementById("user-avatar");
    if (avatarEl && loggedinuser.profilePic) {
        avatarEl.textContent = loggedinuser.username.slice(0, 2).toUpperCase();
    }
    const usernameEl = document.getElementById("user-username");
    if (usernameEl) {
        usernameEl.textContent = "@" + loggedinuser.username;
    }
    
  // update the top-right (or top-bar) avatar icon (if the container exists)
  const topBarIcons = document.querySelector('.top-bar .buttons');
  if (topBarIcons) {
    topBarIcons.innerHTML = "";
    const profileLink = document.createElement('a');
    profileLink.href = "profile.html";
    const topRightAvatar = document.createElement("div");
    topRightAvatar.classList.add("avatar");
    topRightAvatar.style.width = "2.1rem";
    topRightAvatar.style.height = "2.1rem";
    topRightAvatar.style.fontSize = "1rem";
    topRightAvatar.style.marginTop = "-1.7rem";
    topRightAvatar.style.marginLeft = "0.7rem";
  
    if (loggedinuser.profilePic) {
      topRightAvatar.textContent = loggedinuser.username.slice(0, 2).toUpperCase();
    }
    profileLink.appendChild(topRightAvatar);
    topBarIcons.appendChild(profileLink);
  }
  
  