import React, { useState, useRef, forwardRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

const MultiSelectDropdown = forwardRef(
  (
    {
      options,
      selectedOptions,
      setSelectedOptions,
      positionRelative = false,
      viewOnly = false,
      className = "",
      id = "",
      ...otherProps
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const internalRef = useRef(null);
    const dropdownRef = ref || internalRef;

    const handleOptionClick = (option) => {
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter((item) => item !== option));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    };

    const isSelected = (option) => selectedOptions.includes(option);

    const handleDropdownToggle = (e) => {
      if (!e.target.closest(".dropdown-list")) {
        setIsOpen(!viewOnly && !isOpen);
      }
    };

    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    React.useEffect(() => {
      document.addEventListener("click", handleOutsideClick);
      return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    return (
      <div
        ref={dropdownRef}
        className={`multi-select-dropdown ${className}`}
        onClick={handleDropdownToggle}
        {...otherProps}>
        <div className="dropdown-header">
          {selectedOptions.length > 0 ? (
            <div>{(selectedOptions || []).join(", ")}</div>
          ) : (
            <div>-</div>
          )}
          <RiArrowDropDownLine size={24} className="ms-auto" />
        </div>
        {isOpen && (
          <ul
            className={`dropdown-list ${
              positionRelative ? "position-relative" : "position-absolute"
            }`}>
            {options.map((option, index) => (
              <li key={index} onClick={(e) => handleOptionClick(option)}>
                <input
                  type="checkbox"
                  checked={isSelected(option)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleOptionClick(option);
                  }}
                  className="me-2"
                />
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

const SingleSelectDropdown = forwardRef(
  (
    {
      id,
      options,
      selectedOption,
      onChange,
      label,
      viewOnly,
      className = "", // Add className prop
      ...otherProps // Spread operator for any other props
    },
    ref
  ) => {
    // Accept ref as second parameter
    const handleChange = (e) => {
      onChange(id, e.target.value);
    };

    return (
      <select
        ref={ref}
        id={id}
        value={selectedOption}
        onChange={handleChange}
        name={id}
        className={`form-select ${className}`}
        disabled={viewOnly}
        {...otherProps}>
        <option value="" disabled>
          {"-"}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }
);

const CheckBox = forwardRef(
  (
    {
      id,
      checked,
      onChange,
      label,
      width,
      height,
      viewOnly,
      className = "", // Add className prop
      ...otherProps // Spread operator for any other props
    },
    ref
  ) => {
    // Accept ref as second parameter
    const handleChange = (e) => {
      onChange(e.target.checked);
    };

    return (
      <div className={`form-check ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          id={id}
          checked={checked}
          onChange={handleChange}
          className="form-check-input"
          style={{ width: width || "1.5rem", height: height || "1.5rem" }}
          disabled={viewOnly}
          {...otherProps}
        />
      </div>
    );
  }
);

export { SingleSelectDropdown, MultiSelectDropdown, CheckBox };
