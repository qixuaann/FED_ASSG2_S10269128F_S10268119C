// clear the username field so it is not pre-populated
document.getElementById("username").value = "";

// when user types in the username field, check if we have remembered credentials and autofill the password.
document.getElementById("username").addEventListener("input", function () {
    const enteredUsername = this.value.trim();
    const remembered = localStorage.getItem("rememberedCredentials");
    if (remembered) {
        try {
            const creds = JSON.parse(remembered);
            if (creds.username === enteredUsername) {
                document.getElementById("password").value = creds.password;
            } else {
                document.getElementById("password").value = "";
            }
        } catch (e) {
            console.error("Error parsing remembered credentials", e);
        }
    }
});

// lottie animation code 
const lottieContainer = document.getElementById("lottie-container");

// a new div for the lottie player
const lottieWrapper = document.createElement("div");
lottieWrapper.classList.add("lottie-wrapper");

// create the <dotlottie-player> element
const lottiePlayer = document.createElement("dotlottie-player");
lottiePlayer.setAttribute("src", "https://lottie.host/5b4281cc-e796-4283-b8e6-b15af63ee453/Yp2uqYoDDn.lottie");
lottiePlayer.setAttribute("background", "transparent");
lottiePlayer.setAttribute("speed", "1");
lottiePlayer.setAttribute("loop", "");
lottiePlayer.setAttribute("autoplay", "");
lottiePlayer.style.width = "50%";
lottiePlayer.style.height = "20%";

lottieWrapper.appendChild(lottiePlayer);
lottieContainer.appendChild(lottieWrapper);

// login form handling
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 

    // get the username and password from the db
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const rememberMeChecked = document.getElementById("rememberMe").checked;

    // create a key for localstorage tracking (per username)
    const attemptKey = `loginAttempts_${username}`;
    const currentTime = Date.now();

    // retrieve any stored attempt data from localstorage
    let attemptData = JSON.parse(localStorage.getItem(attemptKey)) || { attempts: 0, blockTime: 0 };

    // check if the user is currently locked out
    if (attemptData.blockTime > currentTime) {
        const remaining = Math.ceil((attemptData.blockTime - currentTime) / 1000);
        alert(`Too many failed attempts. Please try again in ${remaining} seconds.`);
        return;
    }

    try {
        const query = encodeURIComponent(JSON.stringify({ Username: username }));
        const endpoint = `https://usersdb-a538.restdb.io/rest/account-information?q=${query}`;

        // fetch the user data
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "67a1ec872373c4c7efd1f2be",
                "cache-control": "no-cache"
            }
        });

        if (!response.ok) {
            throw new Error("Error fetching user data");
        }

        const users = await response.json();

        // check if a user was found
        if (users.length === 0) {
            alert("No account found. Please sign up.");
            return;
        }

        // since username is unique can just take the first match:
        const user = users[0];

        // check if password is correct
        if (user.Password !== password) {
            attemptData.attempts += 1;

            // 5 min cool down for user to try again
            if (attemptData.attempts >= 3) {
                attemptData.blockTime = currentTime + 300000; // 5 minutes in milliseconds
                alert("Incorrect password. You have been locked out for 5 minutes.");
            } else {
                alert(`Incorrect password. You have ${3 - attemptData.attempts} attempt(s) remaining.`);
            }

            // save the updated attempt data back to localstorage
            localStorage.setItem(attemptKey, JSON.stringify(attemptData));
            return;
        }

        // if login successful --> clear the attempt data
        localStorage.removeItem(attemptKey);
        alert("Login successful!");

        // for the "remember me"
        if (rememberMeChecked) {
            // store credentials for autofilling password
            const creds = { username: username, password: password };
            localStorage.setItem("rememberedCredentials", JSON.stringify(creds));
        } else {
            localStorage.removeItem("rememberedCredentials");
        }

        // store login state and user info 
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", JSON.stringify(user));

        // store logged-in user details for profile display
        localStorage.setItem("loggedInUser", JSON.stringify({
            username: user.Username, 
            email: user.Email, // if available in restdb
            profilePic: user.ProfilePic || "../assets/default-avatar.png" // default image if none is set
        }));

        // back to home page
        window.location.href = "../index.html"; 

    } catch (error) {
        console.error("Error during login:", error);
        alert("Error during login: " + error.message);
    }
});
