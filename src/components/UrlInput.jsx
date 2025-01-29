import React from "react";

const ExternalLinkIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const URLInput = ({
  value,
  onChange,
  disabled = false,
  readOnly = false,
  className = "",
  style = {},
  placeholder = "",
  id,
  ...otherProps
}) => {
  const handleOpenUrl = () => {
    if (!value?.trim()) return;
    window.open(value, "_blank");
  };

  return (
    <div className="bg-white rounded">
      <div className="position-relative">
        <input
          type="url"
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          style={style}
          placeholder={placeholder}
          className={`form-control pe-5 form-input text-wrap ${className}`}
          {...otherProps}
        />
        <button
          type="button"
          onClick={handleOpenUrl}
          className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent me-2 text-secondary"
          style={{ cursor: "pointer", zIndex: 10 }}
          aria-label="Open URL in new tab">
          <ExternalLinkIcon />
        </button>
      </div>
    </div>
  );
};

export default URLInput;
