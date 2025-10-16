import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import SpinnerLoader from "../SpinnerLoader";

const ProfileEditForm = ({ profile, onSave, updateLoading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: profile });

    const onSubmit = (data) => onSave({ ...profile, ...data });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card shadow-sm border-0 rounded-4 p-4"
        >
            <h5 className="fw-bold mb-4 text-primary">Edit Profile</h5>

            <form onSubmit={handleSubmit(onSubmit)} className="row g-4">
                {/* Full Name */}
                <div className="col-md-6 form-floating">
                    <input
                        {...register("name", { required: "Name is required" })}
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        id="fullName"
                        placeholder="Full Name"
                    />
                    <label style={{ marginLeft: "10px" }} htmlFor="fullName">Full Name</label>
                    {errors.name && (
                        <div className="invalid-feedback">{errors.name.message}</div>
                    )}
                </div>

                {/* Email */}
                <div className="col-md-6 form-floating">
                    <input
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                        })}
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        id="email"
                        placeholder="Email"
                    />
                    <label style={{ marginLeft: "10px" }} htmlFor="email">Email</label>
                    {errors.email && (
                        <div className="invalid-feedback">{errors.email.message}</div>
                    )}
                </div>

                {/* Phone */}
                <div className="col-md-6 form-floating">
                    <input
                        readOnly
                        {...register("mobile")}
                        className="form-control bg-light"
                        id="phone"
                        placeholder="Phone"
                    />
                    <label style={{ marginLeft: "10px" }} htmlFor="phone">Phone</label>
                </div>

                {/* Gender */}
                <div className="col-md-6 form-floating">
                    <select
                        {...register("gender")}
                        className="form-select"
                        id="gender"
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Select Gender
                        </option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                    <label style={{ marginLeft: "10px" }} htmlFor="gender">Gender</label>
                </div>

                {/* Date of Birth */}
                <div className="col-md-6 form-floating">
                    <input
                        type="date"
                        {...register("dob")}
                        className="form-control"
                        id="dob"
                        placeholder="Date of Birth"
                    />
                    <label style={{ marginLeft: "10px" }} htmlFor="dob ">Date of Birth</label>
                </div>

                {/* Pincode */}
                <div className="col-md-6 form-floating">
                    <input
                        {...register("pincode")}
                        className="form-control"
                        id="pincode"
                        placeholder="Pincode"
                    />
                    <label style={{ marginLeft: "10px" }} htmlFor="pincode">Pincode</label>
                </div>

                {/* Address */}
                <div className="col-md-12 form-floating">
                    <textarea
                        {...register("address")}
                        className="form-control"
                        id="address"
                        placeholder="Address"
                        style={{ height: "90px" }}
                    />
                    <label style={{ marginLeft: "10px" }} htmlFor="address">Address</label>
                </div>

                {/* City */}
                <div className="col-md-6 form-floating">
                    <input
                        {...register("city")}
                        className="form-control"
                        id="city"
                        placeholder="City"
                    />
                    <label style={{ marginLeft: "10px" }} htmlFor="city">City</label>
                </div>

                {/* State */}
                <div className="col-md-6 form-floating">
                    <input
                        {...register("state")}
                        className="form-control"
                        id="state"
                        placeholder="State"
                    />
                    <label style={{ marginLeft: "10px" }} htmlFor="state">State</label>
                </div>

                {/* Submit Button */}
                <div className="col-12 text-end mt-3">
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={updateLoading}
                        className="btn btn-gradient-primary rounded-pill px-4 shadow-sm"
                        style={{
                            background: "linear-gradient(90deg, #6f42c1, #8e5ffb)",
                            color: "#fff",
                            border: "none",
                        }}
                    >
                        {updateLoading ? "Saving..." : "Save Changes"}
                    </motion.button>
                </div>
            </form>

            {updateLoading && <SpinnerLoader />}
        </motion.div>
    );
};

export default ProfileEditForm;
