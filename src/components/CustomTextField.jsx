import React, { useState } from "react";

const CustomInput = ({
  label,
  type = "text",
  fullWidth = false,
  value,
  onChange,
  id,
  InputProps,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = {
    position: "relative",
    marginBottom: "20px",
    width: fullWidth ? "100%" : "auto",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    paddingLeft: InputProps?.startAdornment ? "40px" : "10px",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    border: "1px solid transparent",
    borderRadius: "10px",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
  };

  const labelStyle = {
    position: "absolute",
    left: InputProps?.startAdornment ? "40px" : "10px",
    top: isFocused || value ? "0" : "50%",
    transform: isFocused || value ? "translateY(-50%)" : "translateY(-50%)",
    backgroundColor:
      isFocused || value ? "rgba(255, 255, 255, 0.7)" : "transparent",
    padding: "0 5px",
    fontSize: isFocused || value ? "12px" : "16px",
    color: isFocused || value ? "#333" : "#666",
    pointerEvents: "none",
    transition: "all 0.3s ease",
  };

  const adornmentStyle = {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#666",
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div style={containerStyle}>
      {InputProps?.startAdornment && (
        <div style={adornmentStyle}>{InputProps.startAdornment}</div>
      )}
      <input
        id={id}
        type={type}
        style={{
          ...inputStyle,
          backgroundColor: isFocused
            ? "rgba(255, 255, 255, 0.7)"
            : "rgba(255, 255, 255, 0.5)",
          boxShadow: isFocused ? "0 0 0 2px rgba(0, 0, 0, 0.1)" : "none",
        }}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {label && <label style={labelStyle}>{label}</label>}
    </div>
  );
};

export default CustomInput;
