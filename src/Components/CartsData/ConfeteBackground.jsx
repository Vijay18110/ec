// ConfettiBackground.jsx
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const ConfettiBackground = ({ trigger = false }) => {
    useEffect(() => {
        if (trigger) {
            const duration = 3 * 1000; // 5 seconds
            const animationEnd = Date.now() + duration;
            const defaults = {
                startVelocity: 90,
                spread: 360,
                ticks: 60,
                zIndex: 10,
                particleCount: 60,
                origin: {
                    y: 0,
                },
            };
            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                confetti({
                    ...defaults,
                    angle: 60,
                    origin: { x: 0, y: 0 },
                });
                confetti({
                    ...defaults,
                    angle: 120,
                    origin: { x: 1, y: 0 },
                });
            }, 250);
        }
    }, []);

    return null; // no visible component, just canvas-confetti effect
};


const FreeDeliveryMessage = ({ isFreeDelivery }) => {
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        if (isFreeDelivery) {
            setShowMessage(true);
            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 3000); // Show for 5 seconds
            return () => clearTimeout(timer);
        }
    }, [isFreeDelivery]);

    return (
        <>
            {showMessage && (
                <div className="text-center mt-3  fw-bold text-success  showMessage"
                    style={{
                        position: "fixed",
                        top: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#d1e7dd",
                        color: "#0f5132",
                        padding: "16px 24px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        zIndex: 9999,
                        // fontWeight: "bold",
                        animation: "fadeInOut 5s ease-in-out forwards",
                        maxWidth: "600px"
                    }}
                >
                    🎉 Boom! You get <strong>Free Delivery</strong> on this order!
                </div>
            )}
        </>
    );
};

export { FreeDeliveryMessage };
export default ConfettiBackground;
