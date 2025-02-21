import { useEffect, useRef, forwardRef } from "react";

const CustomTextArea = forwardRef(
  (
    {
      value,
      onChange,
      className = "",
      disabled = false,
      id,
      readOnly,
      placeholder,
      name,
      ...otherProps
    },
    externalRef
  ) => {
    const internalRef = useRef(null);

    // Combine the refs to support both auto-height and external ref access
    const textareaRef = (element) => {
      internalRef.current = element;
      if (typeof externalRef === "function") {
        externalRef(element);
      } else if (externalRef) {
        externalRef.current = element;
      }
    };

    const adjustHeight = () => {
      const textarea = internalRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    useEffect(() => {
      adjustHeight();
    }, [value]);

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        className={`form-textarea ${className}`}
        disabled={disabled}
        id={id}
        readOnly={readOnly}
        placeholder={placeholder}
        name={name}
        style={{
          minHeight: "60px",
          resize: "none",
          overflow: "hidden"
        }}
        {...otherProps}
      />
    );
  }
);

// Add display name for better debugging
CustomTextArea.displayName = "CustomTextArea";

export default CustomTextArea;
