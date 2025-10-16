import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import PreviewImage from "../../ExternalLib/PreviewImage/PreviewImage.jsx";
import useApiRequest from "../../Hooks/apiReq.js";
import SpinnerLoader from "../SpinnerLoader.jsx";

const AvatarUpload = ({ avatar, isEditing, getProfileDetails }) => {
    console.log(avatar)
    const [preview, setPreview] = useState({ avatar: avatar, preview: "", file: "" });
    const fileRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setPreview((pre) => ({ ...pre, preview: URL.createObjectURL(file), file: file }));
    };
    const { error, loading, recallRequest, response, sendApiRequest } = useApiRequest();
    const handleUploadFile = () => {
        const formData = new FormData();
        formData.append('avatar', preview.file)
        sendApiRequest("POST", '/updateProfilePicture', formData, {
            showToast: true,
            onSuccess: (res) => {
                getProfileDetails()
                setPreview({});
            },

        }, true);

    }
    const handleRemoveReivew = () => {
        setPreview((pre) => ({ ...pre, preview: "" }))
    }
    console.log(preview);
    return (
        <motion.div whileHover={{ scale: isEditing ? 1.05 : 1 }}>
            <div
                className="position-relative"
                style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden" }}
            >
                {/* <img
                    src={preview}
                    alt="Avatar"
                    className="w-100 h-100 object-fit-cover border rounded-circle"
                /> */}
                {!isEditing && <PreviewImage imgwithUrl={avatar} className="w-100 h-100 object-fit-cover border rounded-circle" />}
                {isEditing && (
                    <>
                        <PreviewImage handleRemoveReivew={() => handleRemoveReivew()}
                            isPreview={preview.preview}
                            imgwithUrl={preview.preview ? preview.preview : avatar} className="w-100 h-100 object-fit-cover border rounded-circle" />
                        {preview.preview ? <button
                            type="button"
                            className="btn btn-sm btn-dark position-absolute bottom-0 start-0 end-0 opacity-75 text-white"
                            onClick={() => handleUploadFile()}
                        >
                            Upload
                        </button> : <button
                            type="button"
                            className="btn btn-sm btn-dark position-absolute bottom-0 start-0 end-0 opacity-75 text-white"
                            onClick={() => fileRef.current.click()}
                        >
                            <input
                                ref={fileRef}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            Change
                        </button>}
                        {loading && <SpinnerLoader />}
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default AvatarUpload;
