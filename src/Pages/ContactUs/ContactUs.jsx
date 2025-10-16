 
import React, { useState } from "react";
import { toast } from "react-toastify";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        phone: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }

        // else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
        //     newErrors.email = "Enter a valid email";
        // }
        if (!formData.subject.trim()) newErrors.subject = "Subject is required";
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be 10 digits";
        }
        if (!formData.message.trim()) newErrors.message = "Message is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // console.log("✅ Form Submitted:", formData);
            // send data to backend or reset
            toast.success("Form submitted successfully!");
            setFormData({
                name: "",
                email: "",
                subject: "",
                phone: "",
                message: "",
            });
            setErrors({});
        }
    };

    return (
        <>
            <div className="inner-banner">
                <div className="container">
                    <h1>Contact Us</h1>
                </div>
            </div>

            <div className="terms-condition">
                <div className="detail-wrapper-div">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="detail-wrapper">
                                    <h3>Email Address</h3>
                                    <a href="mailto:care@ravdownload.com">
                                        <p>care@ravdownload.com</p>
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="detail-wrapper">
                                    <h3>Phone Number</h3>
                                    <a href="tel:+919205440544">
                                        <p>+91-92 0544 0544</p>
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="detail-wrapper">
                                    <h3>Office Address</h3>
                                    <p>
                                        RAV HOUSE, C-83, <br />
                                        VIBHUTI KHAND, GOMTI NAGAR, <br />
                                        LUCKNOW -226010 (U.P.) INDIA
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-12 mb-4">
                            <h2>Get in Touch</h2>
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="row">
                                    {[
                                        { name: "name", type: "text", placeholder: "Enter your name" },
                                        { name: "email", type: "email", placeholder: "Enter email address" },
                                        { name: "subject", type: "text", placeholder: "Enter the subject" },
                                        { name: "phone", type: "text", placeholder: "Enter Phone No." },
                                    ].map((field, i) => (
                                        <div className="col-md-6" key={i}>
                                            <div className="form-group">
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    placeholder={field.placeholder}
                                                    className="contact-input"
                                                    style={{ marginBottom: "10px" }}
                                                />
                                                {errors[field.name] && (
                                                    <small className="text-danger">{errors[field.name]}</small>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="col-12">
                                        <div className="form-group">
                                            <textarea
                                                name="message"
                                                placeholder="Enter message"
                                                className="contact-textarea"
                                                value={formData.message}
                                                onChange={handleChange}
                                            />
                                            {errors.message && (
                                                <small className="text-danger">{errors.message}</small>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-12 text-center">
                                        <div className="form-group">
                                            <button className="contact-button" type="submit">
                                                GET IN TOUCH
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUs;
