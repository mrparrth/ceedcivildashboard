import React, { useState, useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

const MultiSelectDropdown = ({
  options,
  selectedOptions,
  setSelectedOptions,
  positionRelative = false,
  viewOnly = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const isSelected = (option) => selectedOptions.includes(option);

  const handleDropdownToggle = () => setIsOpen(!viewOnly && !isOpen);

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
      className="multi-select-dropdown"
      onClick={handleDropdownToggle}
    >
      <div className="dropdown-header">
        {selectedOptions.length > 0 ? (
          <div>{(selectedOptions || []).join(", ")}</div>
        ) : (
          <div>Select One or More</div>
        )}
        <RiArrowDropDownLine size={24} className="ms-auto" />
      </div>
      {isOpen && (
        <ul
          className={`dropdown-list ${
            positionRelative ? "position-relative" : "position-absolute"
          }`}
        >
          {options.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)}>
              <input
                type="checkbox"
                checked={isSelected(option)}
                onChange={() => handleOptionClick(option)}
                className="me-2"
              />
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SingleSelectDropdown = ({
  itemKey,
  options,
  selectedOption,
  onChange,
  label,
  viewOnly,
}) => {
  const handleChange = (e) => {
    onChange(itemKey, e.target.value);
  };

  return (
    <select
      id={itemKey}
      value={selectedOption}
      onChange={handleChange}
      name={itemKey}
      className="form-select"
      disabled={viewOnly}
    >
      <option value="" disabled>
        {"Select " + label}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const CheckBox = ({
  id,
  checked,
  onChange,
  label,
  width,
  height,
  viewOnly,
}) => {
  const handleChange = (e) => {
    onChange(e.target.checked);
  };

  return (
    <div className="form-check ">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        className="form-check-input"
        style={{ width: width || "1.5rem", height: height || "1.5rem" }}
        disabled={viewOnly}
      />
    </div>
  );
};

export { SingleSelectDropdown, MultiSelectDropdown, CheckBox };
