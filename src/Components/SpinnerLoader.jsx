

const SpinnerLoader = () => {
    return (
        <div
            style={{
                position: "absolute",   // stays within parent container
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(255, 255, 255, 0.6)", // semi-transparent overlay
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
            }}
        >
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default SpinnerLoader;

