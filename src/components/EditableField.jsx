// import { useState } from 'react';

const EditableField = ({ value, onChange, isEditable, options = [], isDropdown }) => {
  return isEditable ? (
    isDropdown ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select border-2 border-gray-200 rounded p-1 w-full h-[40px] text-[13px]"
      >
        <option value="" disabled>Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-input border border-gray-300 rounded p-2 text-gray-700 text-[13px] w-full"
      />
    )
  ) : (
    <div className="display-value border border-gray-300 rounded p-2 text-gray-700 text-[13px] w-full">{value}</div>
  );
};

export default EditableField;
