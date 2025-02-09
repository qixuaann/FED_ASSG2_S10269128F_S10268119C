// -------------------- Lottie Animation Code --------------------
const lottieContainer = document.getElementById("lottie-container");

// a new div for the Lottie player
const lottieWrapper = document.createElement("div");
lottieWrapper.classList.add("lottie-wrapper");

// create the <dotlottie-player> element
const lottiePlayer = document.createElement("dotlottie-player");
lottiePlayer.setAttribute("src", "https://lottie.host/da183468-6113-4603-baab-41ba7b99a031/hvaZaMbtdi.lottie");
lottiePlayer.setAttribute("background", "transparent");
lottiePlayer.setAttribute("speed", "1");
lottiePlayer.setAttribute("loop", "");
lottiePlayer.setAttribute("autoplay", "");
lottiePlayer.style.width = "90%";
lottiePlayer.style.height = "90%";

lottieWrapper.appendChild(lottiePlayer);
lottieContainer.appendChild(lottieWrapper);

// -------------------- Sign-Up Form Handling --------------------
const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();  

  // get values from the form inputs
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // check that password and confirm password match
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // checks for a record with the given email or username.
    const query = encodeURIComponent(JSON.stringify({
      $or: [
        { Email: email },
        { Username: username }
      ]
    }));

    const checkEndpoint = `https://usersdb-a538.restdb.io/rest/account-information?q=${query}`;
    const checkResponse = await fetch(checkEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": '67a1ec872373c4c7efd1f2be',
        "cache-control": "no-cache"
      }
    });

    if (!checkResponse.ok) {
      throw new Error("Error checking existing account");
    }

    const existingUsers = await checkResponse.json();

    // flags to determine which fields are in use
    let emailInUse = false;
    let usernameInUse = false;

    existingUsers.forEach(user => {
      if (user.Email.toLowerCase() === email.toLowerCase()) {
        emailInUse = true;
      }
      if (user.Username.toLowerCase() === username.toLowerCase()) {
        usernameInUse = true;
      }
    });

    // ensure that email / username is unique
    if (emailInUse || usernameInUse) {
      if (emailInUse && usernameInUse) {
        alert("Email and Username already in use.");
      } else if (emailInUse) {
        alert("Email already in use.");
      } else if (usernameInUse) {
        alert("Username already in use.");
      }
      return; 
    }

    // construct the user data object to send to restDB
    const userData = {
      Username: username,
      Email: email,
      Password: password,
      "Created At": new Date().toISOString()
    };

    // send a POST request to create a new account
    const response = await fetch("https://usersdb-a538.restdb.io/rest/account-information", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": '67a1ec872373c4c7efd1f2be',
        "cache-control": "no-cache"
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error signing up");
    }

    const responseData = await response.json();
    console.log("User created:", responseData);

    alert("Sign-up successful!");
    window.location.href = "../index.html";

  } catch (error) {
    console.error("Error during sign up:", error);
    alert("Error during sign up: " + error.message);
  }
});
