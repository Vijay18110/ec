import React from "react";
// import QRCode from "qrcode.react";
import "./AppDownloadBanner.css";
import { Link } from "react-router-dom";

const AppDownloadBanner = () => {
    const playStoreUrl = "https://play.google.com/store/apps/details?id=com.rav.rav_organics&pcampaignid=web_share";
    const appStoreUrl = "https://play.google.com/store/apps/details?id=com.rav.rav_organics&pcampaignid=web_share";
    const apkUrl = "/apk/your-app.apk"; // if you're hosting the APK

    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const handleDownload = () => {
        if (isAndroid) {
            window.location.href = playStoreUrl;
        } else if (isIOS) {
            window.location.href = appStoreUrl;
        } else {
            // fallback to QR or APK
            window.open(playStoreUrl, "_blank");
        }

    };

    return (
        <div className="app-download-banner">
            <div className="app-info d-flex justify-content-between align-items-center">
                <strong className="st">Get our app for a better experience!</strong>
                <Link to={playStoreUrl} target="_blank">
                    <button className="download-button" onClick={handleDownload}>
                        Download App
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default AppDownloadBanner;
