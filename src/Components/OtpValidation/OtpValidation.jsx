import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { uiAction } from "../../Redux/Slices/uiSlice";
import InputBox from "../../Widgets/InputBox/InputBox";
import SubmitButton from "../../Widgets/SubmitButton/SubmitButton";
import useApiRequest from "../../Hooks/apiReq";
import LoginAppBanner from "../../assets/Images/image.png";
import { validateCustomerForm } from "../../Validation/RegistrationValidation";
import ApiEncryptDecrypt from "../../Utils/Encryption";
import { Key } from "../../Utils/Key";
import axiosInstance2 from "../../Utils/axiosInstance2";
import { toast } from "react-toastify";
import Loader from "../../ExternalLib/Loader/Loader";

const OtpValidation = () => {
    const handleKeyPress = (e) => {
        handleOnlyInputNumber(e)
        if (e.key === "Enter") {
            isOTP
                ? optStatus == 0
                    ? handleSubmitOTP()
                    : handleSendOTP()
                : handlelogin();
        }
    };
    const { error, loading, response, sendApiRequest, status } = useApiRequest();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handlelogin = () => {
        dispatch(uiAction.setScreen("login"));
    };
    const [registerData, setRegisterData] = useState({
        MobileNo: "",
        CustomerName: "",
        CustomerEmail: "",
        CustomerPassword: "",
        Solutation: "Mr",

    });
    const handleChange = useCallback((e) => {
        const { id, value } = e.target;
        setRegisterData((pre) => ({ ...pre, [id]: value }));
    }, []);
    const handleSubmitData = useCallback(async () => {
        // if (customerpincode.trim().length != 6) {
        //   toast.error("Pincode is required");
        // }
        console.log(registerData)
        if (validateCustomerForm(registerData)) {
            const encryptedData = await ApiEncryptDecrypt.encryptString(
                Key,
                JSON.stringify({ ...registerData })
            );

            const jsonData = { Body: encryptedData };
            let res;
            res = await axiosInstance2.post("/AddCustomerDetail", jsonData);

            const decryptedRes = await ApiEncryptDecrypt.decryptString(
                Key,
                res.data.body
            );
            const obj = JSON.parse(decryptedRes);
            if (obj.Status === 0) {
                dispatch(uiAction.openModal());
                dispatch(uiAction.setScreen("login"));
                navigate(
                    `/congratulation/?pass=${btoa(
                        registerData.CustomerPassword
                    )}&str=${btoa(obj?.Response?.CustomerCode)}`
                );
            }
            // Handle different status codes
            if (obj.Status === 1) {
                toast.error(obj.Message);
            }
            if (obj.Status === 3) {
                dispatch(uiAction.openModal());
            }
        }
    }, [registerData]);

    const handleTermAndConditions = (url) => {
        navigate(url);
        dispatch(uiAction.openModal());
    };
    const handleOnlyInputNumber = (e) => {
        if (
            !/[0-9]/.test(e.key) &&
            e.key !== "Backspace" &&
            e.key !== "Delete" &&
            e.key !== "ArrowLeft" &&
            e.key !== "ArrowRight"
        ) {
            e.preventDefault(); // block non-numeric keys
        }
    };
    const [loginData, setloginData] = useState({
        MobileNo: "",
        CustomerPassword: "",
    });
    //otp apis
    const handleChangeVerify = useCallback((e) => {
        const { value, id } = e.target;
        setloginData((pre) => ({ ...pre, [id]: value }));
    }, []);
    const [OTP, setOTP] = useState({
        otp1: "",
        otp2: "",
        otp3: "",
        otp4: "",
        otp5: "",
        otp6: "",
    });
    const handleChangeOtp = (e, index) => {
        const inputs = document.querySelectorAll("#OTP-Box input");
        const { id, value } = e.target;
        // Update state
        setOTP((prev) => ({ ...prev, [id]: value }));
        // Move to next input on valid entry
        if (value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
        // Move to previous input on backspace when input is empty
        if (
            value === "" &&
            e.nativeEvent.inputType === "deleteContentBackward" &&
            index > 0
        ) {
            inputs[index - 1].focus();
        }
    };

    const [otpLoading, setotpLoading] = useState(false);
    const [otpResponse, setotpResponse] = useState(null);
    const [optStatus, setoptStatus] = useState(null);

    const [isOTP, setIsOTP] = useState(false);

    const [isSubmit, setIsSubmit] = useState(true);
    const [count, setCount] = useState(59);
    const otpExpiredShownRef = useRef(false);
    const timer = useRef(null);
    // console.log(otpResponse)
    const handleSendOTP = async () => {
        if (count != 0) {
            if (!loginData.MobileNo) {
                toast.error("Id Is required");
                return;
            }
        }
        try {
            setoptStatus(false);
            setotpLoading(true);

            const encryptedData = await ApiEncryptDecrypt.encryptString(
                "RAVBIZKEYwdT3?&A",
                JSON.stringify({
                    CustomerCode: loginData.MobileNo,
                    AppVersion: "1.0",
                    DeviceType: "Web",
                })
            );
            const jsonData = { Body: encryptedData };
            let res;
            res = await axiosInstance2.post("/SendCustomerOTP", jsonData);
            const decryptedRes = await ApiEncryptDecrypt.decryptString(
                "RAVBIZKEYwdT3?&A",
                res.data.body
            );
            const obj = JSON.parse(decryptedRes);
            console.log(obj)
            setotpResponse(obj.Response);
            if (obj.Status === 0) {
                toast.info(obj.Message);
                // dispatch(uiAction.setScreen("login"));
            }
            if (obj.Status === 1) {
                toast.error(obj.Message);
            }
            if (obj.Status === 3) {
                dispatch(uiAction.openModal());
            }
        } catch (error) {
            console.log(error);
        } finally {
            setotpLoading(false);
        }
    };
    const handleSubmitOTP = async () => {
        const otps =
            OTP.otp1 + OTP.otp2 + OTP.otp3 + OTP.otp4 + OTP.otp5 + OTP.otp6;
        try {
            const encryptedData = await ApiEncryptDecrypt.encryptString(
                Key,
                JSON.stringify({
                    MobileNo: otpResponse.MobileNo,
                    OTP: otps,
                })
            );
            console.log(otps)
            const jsonData = { Body: encryptedData };
            let res;
            res = await axiosInstance2
            const decryptedRes = await ApiEncryptDecrypt.decryptString(
                Key,
                res.data.body
            );
            const obj = JSON.parse(decryptedRes);
            if (obj.Status === 0) {
                clearInterval(timer.current);
                setIsSubmit((pre) => !pre);
                toast.success(obj.Message);
                setIsOTP(true);
            }
            if (obj.Status === 1) {
                setIsSubmit(true);
                clearInterval(timer.current);
                dispatch(uiAction.setScreen("register"));
                setRegisterData({ MobileNo: otpResponse?.MobileNo });
                setIsSubmit(false);
                toast.error(obj.Message);
                setOTP({
                    otp1: "",
                    otp2: "",
                    otp3: "",
                    otp4: "",
                    otp5: "",
                    otp6: "",
                });
            }
            if (obj.Status === 3) {
                dispatch(uiAction.openModal());
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleChangeNumber = () => {
        setIsSubmit(true);
        setoptStatus(1)
    }
    // console.log(otpResponse);
    return (
        <>
            {/* Trigger Button */}
            <div className="col-lg-6">
                {/* Form */}
                <div className="register">
                    <div className="p-3">
                        <div className="text-center">
                            {loginData?.MobileNo} <span className="text-secondary" onClick={handleChangeNumber} ><Link>Change</Link></span>
                        </div>
                        <div
                            className="d-flex justify-content-center my-3 gap-2"
                            id="OTP-Box"
                        >
                            <input
                                type="text"
                                className="form-control text-center"
                                id="otp1"
                                onChange={(e) => handleChangeOtp(e, 0)}
                                maxlength="1"
                                style={{ width: "3rem" }}
                                inputmode="numeric"
                                pattern="[0-9]"
                                required
                                autoComplete="off"
                            />
                            <input
                                type="text"
                                className="form-control text-center"
                                id="otp2"
                                onChange={(e) => handleChangeOtp(e, 1)}
                                maxlength="1"
                                style={{ width: "3rem" }}
                                inputmode="numeric"
                                pattern="[0-9]"
                                required
                                autoComplete="off"
                            />
                            <input
                                type="text"
                                className="form-control text-center"
                                id="otp3"
                                onChange={(e) => handleChangeOtp(e, 2)}
                                maxlength="1"
                                style={{ width: "3rem" }}
                                inputmode="numeric"
                                pattern="[0-9]"
                                required
                                autoComplete="off"
                            />
                            <input
                                type="text"
                                className="form-control text-center"
                                id="otp4"
                                onChange={(e) => handleChangeOtp(e, 3)}
                                maxlength="1"
                                style={{ width: "3rem" }}
                                inputmode="numeric"
                                pattern="[0-9]"
                                required
                                autoComplete="off"
                            />
                            <input
                                type="text"
                                className="form-control text-center"
                                id="otp5"
                                onChange={(e) => handleChangeOtp(e, 4)}
                                maxlength="1"
                                style={{ width: "3rem" }}
                                inputmode="numeric"
                                pattern="[0-9]"
                                required
                                autoComplete="off"
                            />
                            <input
                                type="text"
                                className="form-control text-center"
                                id="otp6"
                                onChange={(e) => handleChangeOtp(e, 5)}
                                maxlength="1"
                                style={{ width: "3rem" }}
                                inputmode="numeric"
                                pattern="[0-9]"
                                required
                                autoComplete="off"

                            />
                        </div>
                        {count > 0 && <small className="mb-0 text-center text-success d-inline-block w-100">Resend OTP In : {count}</small>}

                        {(
                            <SubmitButton
                                type="submit"
                                className="btn btn-secondary mt-3 w-100"
                                disabled={
                                    loginData?.MobileNo?.length == 10 || OTP ? false : true
                                }
                                value={"Send OTP"}
                                onClick={handleSendOTP}

                            />
                        )}
                    </div>
                    {/* Terms */}
                    <div className="text-center mt-1 small text-dark">
                        By clicking, I accept the{" "}
                        <span
                            className="fw-medium text-decoration-none text-primary"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                handleTermAndConditions("/term-conditions")
                            }
                        >
                            Terms of Service
                        </span>{" "}
                        and{" "}
                        <span
                            className="fw-medium text-decoration-none text-primary"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleTermAndConditions("/privacy-policy")}
                        >
                            Privacy Policy
                        </span>
                    </div>

                    {/* Login Prompt */}
                    <p className="text-center small mt-2">
                        Already have an account?{" "}
                        <span
                            className="fw-bold"
                            style={{ cursor: "pointer" }}
                            onClick={handlelogin}
                        >
                            Login
                        </span>
                    </p>
                </div>
            </div>


        </>
    );
};

export default OtpValidation;