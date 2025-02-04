// -------------------- Lottie Animation Code (Existing) --------------------
// (Your Lottie code remains unchanged)
const lottieContainer = document.getElementById("lottie-container");
const lottieWrapper = document.createElement("div");
lottieWrapper.classList.add("lottie-wrapper");

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
  event.preventDefault(); // Prevent default form submission

  // Get values from the form inputs
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Simple validation: Check that password and confirm password match
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Construct the user data object to send to restDB
  const userData = {
    Username: username,          
    Email: email,
    Password: password,        
    "Created At": new Date().toISOString() 
  };

  try {
    // Send a POST request to your restDB endpoint with explicit CORS mode
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

    // for success
    const responseData = await response.json();
    console.log("User created:", responseData);

    
    alert("Sign-up successful!");
    window.location.href = "home.html";

  } catch (error) {
    console.error("Error during sign up:", error);
    alert("Error during sign up: " + error.message);
  }
});
