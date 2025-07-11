import React, { useEffect, useRef } from "react";

const CustomTextarea2 = ({
  id,
  name,
  value,
  onChange,
  rows = 3,
  placeholder,
}) => {
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textAreaRef}
      className="form-control"
      id={id}
      name={name}
      value={value}
      onChange={(e) => {
        onChange(e);
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }}
      rows={rows}
      placeholder={placeholder}
      style={{
        overflow: "hidden",
        resize: "none",
      }}
    />
  );
};

export default CustomTextarea2;
