    // Select the container where the Lottie animation will go
    const lottieContainer = document.getElementById("lottie-container");

    // Create a new div for the Lottie player
    const lottieWrapper = document.createElement("div");
    lottieWrapper.classList.add("lottie-wrapper");

    // Create the <dotlottie-player> element
    const lottiePlayer = document.createElement("dotlottie-player");
    lottiePlayer.setAttribute("src", "https://lottie.host/5b4281cc-e796-4283-b8e6-b15af63ee453/Yp2uqYoDDn.lottie");
    lottiePlayer.setAttribute("background", "transparent");
    lottiePlayer.setAttribute("speed", "1");
    lottiePlayer.setAttribute("loop", "");
    lottiePlayer.setAttribute("autoplay", "");
    lottiePlayer.style.width = "50%";
    lottiePlayer.style.height = "20%";

    // Append the Lottie player to the wrapper
    lottieWrapper.appendChild(lottiePlayer);

    // Finally, append the lottie wrapper to the container in HTML
    lottieContainer.appendChild(lottieWrapper);
