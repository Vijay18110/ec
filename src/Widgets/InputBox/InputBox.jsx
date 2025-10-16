import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const InputBox = ({
  label,
  id,
  placeholder,
  customClass,
  handleChange,
  value,
  isRequired,
  isReadonly,
  type,
  max,
  maxLength,
  handleKeyPress,
  top, Border
}) => {
  const [isShow, setIsShow] = useState(false);

  const handleShow = () => {
    setIsShow(!isShow);
  };
  return (
    <div style={{ position: "relative" }} className="mb-1">
      {label && (
        <label className="form-label mt-2">
          {label}
          {label && isRequired && <i className="text-danger fw-bold">*</i>}
        </label>
      )}
      <input
        style={{ padding: "7px", border: Border }}
        type={
          type
            ? type === "password"
              ? isShow
                ? "text"
                : "password"
              : type
            : "text"
        }
        className={customClass ? customClass : "form-control"}
        placeholder={placeholder ? placeholder : ""}
        id={id ? id : ""}
        required={isRequired || false}
        value={value || ""}
        readOnly={isReadonly || false}
        maxLength={maxLength ? maxLength : ""}
        onChange={(e) => handleChange(e)}
        onKeyDown={handleKeyPress}
        autoComplete="off"

      />
      {type === "password" && (
        <i
          onClick={handleShow}
          style={{ position: "absolute", right: "15px", top: top ? top : "63%" }}
        >
          {isShow ? <IoEyeOutline /> : <IoEyeOffOutline />}
        </i>
      )}
    </div>
  );
};

export default InputBox;
