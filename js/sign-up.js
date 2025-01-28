// Select the container where the Lottie animation will go
const lottieContainer = document.getElementById("lottie-container");

// Create a new div for the Lottie player
const lottieWrapper = document.createElement("div");
lottieWrapper.classList.add("lottie-wrapper");

// Create the <dotlottie-player> element
const lottiePlayer = document.createElement("dotlottie-player");
lottiePlayer.setAttribute("src", "https://lottie.host/08afce25-529c-475a-9555-70530c541371/fnnULYw7wS.lottie");
lottiePlayer.setAttribute("background", "transparent");
lottiePlayer.setAttribute("speed", "1");
lottiePlayer.setAttribute("loop", "");
lottiePlayer.setAttribute("autoplay", "");
lottiePlayer.style.width = "220%";  // Set width as percentage of container
lottiePlayer.style.height = "220%"; // Set height as percentage of container

// Append the Lottie player to the wrapper
lottieWrapper.appendChild(lottiePlayer);

// Finally, append the lottie wrapper to the container in HTML
lottieContainer.appendChild(lottieWrapper);
