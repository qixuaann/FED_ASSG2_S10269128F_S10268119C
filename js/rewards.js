document.addEventListener('DOMContentLoaded', () => {
    console.log("rewards.js loaded and DOM ready.");
  
    // dynamic profile
    const loggedinuser = JSON.parse(localStorage.getItem("loggedInUser")) || {
      username: "Guest",
      profilePic: true,
      badgesEarned: 3,
      totalBadges: 20
    };
  
    const avatarEl = document.getElementById("user-avatar");
    if (avatarEl) {
      avatarEl.textContent = loggedinuser.username.slice(0, 2).toUpperCase();
    } else {
      console.warn("user-avatar element not found.");
    }
  
    const usernameEl = document.getElementById("user-username");
    if (usernameEl) {
      usernameEl.textContent = "@" + loggedinuser.username;
    } else {
      console.warn("user-username element not found.");
    }
  
    const badgesEarnedEl = document.querySelector('.profile p');
    if (badgesEarnedEl) {
      badgesEarnedEl.textContent = `${loggedinuser.badgesEarned}/${loggedinuser.totalBadges} Badges Earned`;
    }
  
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
  
    // rewards data
    let rewardsRecord = JSON.parse(localStorage.getItem('rewardsRecord'));
    if (!rewardsRecord) {
      rewardsRecord = [
        { img: 'badge1.png', title: '5% discount off', desc: 'no min spend', claimed: false },
        { img: 'badge2.png', title: '$3 off', desc: 'no min spend', claimed: false },
        { img: 'badge3.png', title: 'Free mailing', desc: 'no min spend', claimed: false }
      ];
      localStorage.setItem('rewardsRecord', JSON.stringify(rewardsRecord));
      console.log("Initialized rewardsRecord.");
    }
    
    let vouchersClaimed = JSON.parse(localStorage.getItem('vouchersClaimed'));
    if (!vouchersClaimed) {
      vouchersClaimed = [];
      localStorage.setItem('vouchersClaimed', JSON.stringify(vouchersClaimed));
      console.log("Initialized vouchersClaimed.");
    }
    
    function updateVouchersTabCount() {
      const voucherButton = document.querySelector('.toggle-buttons button:nth-child(2)');
      if (voucherButton) {
        voucherButton.textContent = `Vouchers Claimed (${vouchersClaimed.length})`;
      }
    }
    updateVouchersTabCount();
  
    // function to add new voucher
    window.addNewVoucher = function () {
      console.log("addNewVoucher() called.");
      let vouchers = JSON.parse(localStorage.getItem('vouchersClaimed')) || [];
      const newVoucher = {
        img: 'voucher.png',
        title: 'Golden Voucher!',
        desc: 'Congratulations! Enjoy your reward!',
        code: 'VOUCHER' + Math.floor(Math.random() * 1000000),
        expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        claimed: true
      };
      vouchers.push(newVoucher);
      localStorage.setItem('vouchersClaimed', JSON.stringify(vouchers));
      vouchersClaimed = vouchers;
      updateVouchersTabCount();
      console.log("New voucher added:", newVoucher);
  
      // if the vouchers tab is active, re-render.
      const activeTab = document.querySelector('.toggle-buttons button.active');
      if (activeTab && activeTab.textContent.includes('Vouchers Claimed')) {
        renderRewards(vouchersClaimed, 'vouchers');
      }
    };
  
    /* render rewards */
    function renderRewards(rewardsArray, type) {
      const rewardGrid = document.querySelector('.reward-grid');
      if (!rewardGrid) {
        console.error("Reward grid element not found.");
        return;
      }
      rewardGrid.innerHTML = ''; // clear existing grid
  
      rewardsArray.forEach((reward, index) => {
        const rewardDiv = document.createElement('div');
        rewardDiv.classList.add('reward');
        if (reward.claimed) {
          rewardDiv.classList.add('claimed');
        }
        
        const img = document.createElement('img');
        img.src = reward.img || (type === 'vouchers' ? 'voucher.png' : '');
        img.alt = type === 'vouchers' ? 'Voucher' : 'Badge';
        rewardDiv.appendChild(img);
        
        const h4 = document.createElement('h4');
        h4.textContent = reward.title;
        rewardDiv.appendChild(h4);
        
        const p = document.createElement('p');
        if (type === 'vouchers') {
          p.textContent = `${reward.desc} (Code: ${reward.code || 'N/A'}) Expires: ${
            reward.expiry ? new Date(reward.expiry).toLocaleDateString() : 'N/A'
          }`;
        } else {
          p.textContent = reward.desc;
        }
        rewardDiv.appendChild(p);
        
        const button = document.createElement('button');
        if (reward.claimed) {
          button.classList.add('claimed-btn');
          button.textContent = 'Claimed';
        } else {
          button.classList.add('claim-btn');
          button.textContent = 'Claim reward';
          if (type === 'record') {
            button.addEventListener('click', () => {
              console.log("Claim button clicked for reward index:", index);
              const claimedReward = rewardsRecord.splice(index, 1)[0];
              claimedReward.claimed = true;
              claimedReward.code = 'VOUCHER' + Math.floor(Math.random() * 1000000);
              const expiryDate = new Date();
              expiryDate.setMonth(expiryDate.getMonth() + 1);
              claimedReward.expiry = expiryDate.toISOString();
              vouchersClaimed.push(claimedReward);
              localStorage.setItem('rewardsRecord', JSON.stringify(rewardsRecord));
              localStorage.setItem('vouchersClaimed', JSON.stringify(vouchersClaimed));
              updateVouchersTabCount();
              console.log("Reward claimed and moved to vouchersClaimed:", claimedReward);
              // Switch to Vouchers Claimed view.
              toggleButtons.forEach(btn => btn.classList.remove('active'));
              document.querySelector('.toggle-buttons button:nth-child(2)').classList.add('active');
              renderRewards(vouchersClaimed, 'vouchers');
            });
          }
        }
        rewardDiv.appendChild(button);
        rewardGrid.appendChild(rewardDiv);
      });
    }
    
    /* toggle view between the 2 */
    const toggleButtons = document.querySelectorAll('.toggle-buttons button');
    if (!toggleButtons.length) {
      console.warn("Toggle buttons not found.");
    }
    toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        toggleButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        if (button.textContent.includes('Record')) {
          console.log("Rendering Record rewards.");
          renderRewards(rewardsRecord, 'record');
        } else if (button.textContent.includes('Vouchers Claimed')) {
          console.log("Rendering Vouchers Claimed.");
          renderRewards(vouchersClaimed, 'vouchers');
        }
      });
    });
    
    // initially render the Record rewards.
    renderRewards(rewardsRecord, 'record');
  });
  