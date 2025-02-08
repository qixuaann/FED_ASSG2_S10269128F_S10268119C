// rewards.js
document.addEventListener('DOMContentLoaded', () => {
    /*** --- DYNAMIC PROFILE UPDATE --- ***/
    // Retrieve the logged-in user details (for demo, we assume these exist in localStorage)
    const loggedinuser = JSON.parse(localStorage.getItem("loggedInUser")) || {
      username: "johndoe",
      profilePic: true, // if you have an image URL, you could store it here instead
      badgesEarned: 3,
      totalBadges: 20
    };
  
    // Update the profile card avatar and username
    const avatarEl = document.getElementById("user-avatar");
    if (avatarEl) {
      // If you have an image URL you can set it as backgroundImage; for now we just use initials.
      avatarEl.textContent = loggedinuser.username.slice(0, 2).toUpperCase();
    }
    const usernameEl = document.getElementById("user-username");
    if (usernameEl) {
      usernameEl.textContent = "@" + loggedinuser.username;
    }
    // Update badges earned dynamically
    const badgesEarnedEl = document.querySelector('.profile p');
    if (badgesEarnedEl) {
      badgesEarnedEl.textContent = `${loggedinuser.badgesEarned}/${loggedinuser.totalBadges} Badges Earned`;
    }
    // Update the top-bar avatar (if needed)
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
      topRightAvatar.textContent = loggedinuser.username.slice(0, 2).toUpperCase();
      profileLink.appendChild(topRightAvatar);
      topBarIcons.appendChild(profileLink);
    }
  
    /*** --- DYNAMIC REWARDS UPDATE --- ***/
    // Simulated rewards data.
    // "Record" rewards could represent available badges or rewards.
    let rewardsRecord = JSON.parse(localStorage.getItem('rewardsRecord'));
    if (!rewardsRecord) {
      rewardsRecord = [
        { img: '/assets/badge1.png', title: '5% discount off', desc: 'no min spend', claimed: false },
        { img: '/assets/badge2.png', title: '$3 off', desc: 'no min spend', claimed: false },
        { img: '/assets/badge3.png', title: 'Free mailing', desc: 'no min spend', claimed: true }
      ];
      localStorage.setItem('rewardsRecord', JSON.stringify(rewardsRecord));
    }
  
    // "Vouchers Claimed" data; for demo, these vouchers are already claimed.
    let vouchersClaimed = JSON.parse(localStorage.getItem('vouchersClaimed'));
    if (!vouchersClaimed) {
      vouchersClaimed = [
        { code: 'VOUCHER123', title: '$5 off', desc: 'Valid on next purchase', claimed: true, expiry: '2025-12-31' },
        { code: 'VOUCHER456', title: '10% off', desc: 'Valid on next purchase', claimed: true, expiry: '2025-12-31' }
      ];
      localStorage.setItem('vouchersClaimed', JSON.stringify(vouchersClaimed));
    }
  
    // Function to render the rewards grid.
    // The parameter 'type' helps us know whether we're rendering the "Record" rewards or vouchers.
    function renderRewards(rewardsArray, type) {
      const rewardGrid = document.querySelector('.reward-grid');
      rewardGrid.innerHTML = ''; // Clear existing items
  
      rewardsArray.forEach(reward => {
        const rewardDiv = document.createElement('div');
        rewardDiv.classList.add('reward');
        if (reward.claimed) {
          rewardDiv.classList.add('claimed');
        }
  
        // Create and append the image element
        const img = document.createElement('img');
        // For vouchers, you might use a different image or icon
        img.src = reward.img || (type === 'vouchers' ? 'voucher.png' : '');
        img.alt = 'Badge';
        rewardDiv.appendChild(img);
  
        // Create and append the title
        const h4 = document.createElement('h4');
        h4.textContent = reward.title;
        rewardDiv.appendChild(h4);
  
        // Create and append the description
        const p = document.createElement('p');
        // For vouchers, include code and expiry information
        if (type === 'vouchers') {
          p.textContent = `${reward.desc} (Code: ${reward.code}) Expires: ${new Date(reward.expiry).toLocaleDateString()}`;
        } else {
          p.textContent = reward.desc;
        }
        rewardDiv.appendChild(p);
  
        // Create and append the button
        const button = document.createElement('button');
        if (reward.claimed) {
          button.classList.add('claimed-btn');
          button.textContent = 'Claimed';
        } else {
          button.classList.add('claim-btn');
          button.textContent = 'Claim reward';
          // For demo purposes, clicking this will mark the reward as claimed
          button.addEventListener('click', () => {
            reward.claimed = true;
            if (type === 'record') {
              localStorage.setItem('rewardsRecord', JSON.stringify(rewardsRecord));
            } else if (type === 'vouchers') {
              localStorage.setItem('vouchersClaimed', JSON.stringify(vouchersClaimed));
            }
            renderRewards(rewardsArray, type);
          });
        }
        rewardDiv.appendChild(button);
  
        rewardGrid.appendChild(rewardDiv);
      });
    }
  
    // Set up the toggle buttons to switch between the two views.
    const toggleButtons = document.querySelectorAll('.toggle-buttons button');
    toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove the "active" class from all buttons and add it to the clicked one.
        toggleButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
  
        // Render rewards based on the selected tab.
        if (button.textContent.trim() === 'Record') {
          renderRewards(rewardsRecord, 'record');
        } else if (button.textContent.trim() === 'Vouchers Claimed') {
          // Map voucher objects into a format that our renderRewards function can use.
          const voucherRewards = vouchersClaimed.map(voucher => ({
            img: 'voucher.png', // Use a voucher image or icon
            title: voucher.title,
            desc: voucher.desc,
            code: voucher.code,
            expiry: voucher.expiry,
            claimed: voucher.claimed
          }));
          renderRewards(voucherRewards, 'vouchers');
        }
      });
    });
  
    // Initially, render the "Record" rewards.
    renderRewards(rewardsRecord, 'record');
  });
  