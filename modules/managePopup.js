const popup = document.getElementById("popup");

const popupButton = document.getElementById("help-button");
popupButton.addEventListener("click", () => popup.style.opacity = 1);

const closePopup = document.getElementById("close-popup");
closePopup.addEventListener("click", () => popup.style.opacity = 0);