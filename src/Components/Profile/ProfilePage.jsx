import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProfileView from "./ProfileView";
import ProfileEditForm from "./ProfileEditForm";
import AvatarUpload from "./AvatarUpload";
import useApiRequest from "../../Hooks/apiReq";
import { toast } from "react-toastify";
import AddressSection from "./AddressSection";

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        name: "Vijay Raj",
        email: "vijay.mfs@example.com",
        mobile: "9628554907",
        gender: "Male",
        dob: "01-01-2003",
        address: "LALPUR BAZAR, SITAPUR",
        city: "LAHARPUR",
        state: "UTTER PRADESH",
        pincode: "261136",
        avatar: "https://avatars.githubusercontent.com/u/166320753?s=400&u=7dd4e5c0cfbed41cc80ec1bd2a201eb8947a476d&v=4",
    });
    const { error: updateErr, loading: updateLoading, response: updateRes, sendApiRequest: updateSendApiRequest } = useApiRequest()
    console.log(profile);
    const handleUpdate = (updatedProfile) => {
        console.log(profile)
        try {
            updateSendApiRequest("POST", '/updateProfileDetails', updatedProfile, {
                onSuccess: (res) => {
                    toast.success('Profile Data Updated Success');
                    console.log("res", res);
                    getProfileDetails();
                    setProfile(updatedProfile);
                    setIsEditing(false);
                },
            });
        } catch (error) {
            console.log(error);
        }
    };
    const { error, loading, recallRequest, response, sendApiRequest, status } = useApiRequest()
    const getProfileDetails = () => {
        sendApiRequest('GET', '/getProfileDetails', "", {
            onSuccess: (res) => {
                setProfile(res);
            }
        })
    }
    useEffect(() => {
        getProfileDetails();
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="container py-4"
        >
            <div className="row justify-content-center">
                <div className="col-lg-12">
                    <div className="card-body">
                        <div className="d-flex align-items-center mb-4">
                            <AvatarUpload getProfileDetails={getProfileDetails} avatar={profile.avatar} isEditing={isEditing} />
                            <div className="ms-3">
                                <h4 className="fw-bold mb-0">{profile.name}</h4>
                                <p className="text-muted mb-0">{profile.email}</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="btn btn-outline-primary ms-auto rounded-pill px-4"
                            >
                                {isEditing ? "Cancel" : "Edit"}
                            </button>
                        </div>

                        {isEditing ? (
                            <ProfileEditForm
                                profile={profile}
                                onSave={handleUpdate}
                                onCancel={() => setIsEditing(false)}
                                updateLoading={updateLoading}
                            />
                        ) : (
                            <ProfileView profile={profile} />
                        )}

                        {/* 👇 NEW ADDRESS SECTION */}
                        <AddressSection />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfilePage;
