import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./offerPopupStyles.css"; // Custom CSS
import confetti from "canvas-confetti";

const MySwal = withReactContent(Swal);

export const showOfferPopup = (description, name, title, image) => {
  // Create a confetti interval
  const confettiInterval = setInterval(() => {
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.4 },
      scalar: 1.2,
    });
  }, 600);
  MySwal.fire({
    html: `
      <div class="popup-container">
        <h2 class="popup-title text-white">${name}</h2>
        <img src="${image}" alt="Offer Image" class="popup-image animate-bell" />
        <p style="color:rgb(255, 255, 255); font-size: 13px; margin: 0;">
        ${description}
        </p>
        <small class="highlight-title bg-white animate-bounce">${title}</small>
      </div>
    `,
    background: "transparent",
    showConfirmButton: true,
    confirmButtonText: "OK",
    confirmButtonColor: "rgb(25 135 84)",
    customClass: {
      popup: "", // No border or shadow
    },
    showClass: {
      popup: "swal2-show animate__animated animate__zoomIn",
    },
    hideClass: {
      popup: "swal2-hide animate__animated animate__fadeOutUp",
    },
    didClose: () => {
      clearInterval(confettiInterval); // Stop confetti when modal closes
    },
  }).then(() => {
    clearInterval(confettiInterval); // Also stop confetti if OK is clicked
  });
};
