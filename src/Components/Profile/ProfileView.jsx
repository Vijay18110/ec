import React from "react";

const ProfileView = ({ profile }) => {
    return (
        <div className="row g-3">
            {Object.entries(profile).map(([key, value]) =>
                key === "avatar" ? null : (
                    <div key={key} className="col-md-6">
                        <div className="border rounded-3 p-3 bg-light">
                            <strong className="text-capitalize d-block">{key}</strong>
                            <span className="text-muted">{value}</span>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default ProfileView;
