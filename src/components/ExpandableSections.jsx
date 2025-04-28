import { CheckBox, SingleSelectDropdown, MultiSelectDropdown } from "./Fields";
import useAppData from "hooks/useAppData";
import URLInput from "components/UrlInput";

const FormGenerator = ({ data, setter, fields, bgcolor, viewOnly }) => {
  const handleInputChange = (name, value, type) => {
    if (type === "number") {
      const numValue = value === "" ? null : parseFloat(value);
      setter(name, numValue);
    } else {
      setter(name, value);
    }
  };

  return (
    <>
      {fields.map(({ label, name, type = "text", options }) => (
        <div
          className="form-row accredion-row"
          key={name}
          style={{ backgroundColor: bgcolor }}>
          <label className="form-label">{label}</label>
          <div className="form-field">
            {type === "select" ? (
              <SingleSelectDropdown
                id={name}
                options={options}
                selectedOption={data[name]}
                onChange={handleInputChange}
                label={label}
                viewOnly={viewOnly}
              />
            ) : type == "multiselect" ? (
              <MultiSelectDropdown
                options={options}
                selectedOptions={data[name]}
                setSelectedOptions={(newSelectedOptions) => {
                  handleInputChange(name, newSelectedOptions);
                  handleInputChange("assignedTo", [
                    ...data.assignedTo.filter(
                      (user) => !options.includes(user)
                    ),
                    ...newSelectedOptions,
                  ]);
                }}
                positionRelative={true}
                className={"bg-white"}
                viewOnly={viewOnly}
              />
            ) : type === "checkbox" ? (
              <CheckBox
                id={name}
                checked={data[name]}
                onChange={(value) => handleInputChange(name, value)}
                label={label}
                viewOnly={viewOnly}
              />
            ) : type === "url" ? (
              <URLInput
                id={name}
                value={data[name]}
                onChange={(e) => handleInputChange(name, e.target.value)}
                readOnly={viewOnly}
                className={`form-input text-wrap`}
              />
            ) : (
              <input
                type={type}
                name={name}
                value={data[name] ?? ""}
                onChange={(e) => handleInputChange(name, e.target.value, type)}
                className="form-input"
                disabled={viewOnly}
                step={type === "number" ? "any" : undefined}
              />
            )}
          </div>
        </div>
      ))}
    </>
  );
};

const Drafter = ({ data, setter, viewOnly }) => {
  const { drafters, draftingStatus } = useAppData().appData || {};

  const fields = [
    { label: "Drafter Needed", name: "draftingNeeded", type: "checkbox" },
    {
      label: "Drafter Tasked To",
      name: "draftingTaskedTo",
      type: "multiselect",
      options: drafters,
    },
    {
      label: "Drafting Status",
      name: "draftingStatus",
      type: "select",
      options: draftingStatus,
    },
    {
      label: "Drafting Estimate",
      name: "draftingEstimate",
      type: "number",
    },
    {
      label: "Drafting Dropbox Link",
      name: "draftingDropboxLink",
      type: "url",
    },
    {
      label: "Estimated Start Date",
      name: "draftingEstimatedStartTime",
      type: "date",
    },
    {
      label: "Estimated Delivery Date",
      name: "draftingEstimatedDeliveryTime",
      type: "date",
    },
  ];

  return (
    <FormGenerator
      data={data}
      setter={setter}
      fields={fields}
      bgcolor="#caf0ca"
      viewOnly={viewOnly}
    />
  );
};

const Engineering = ({ data, setter, viewOnly }) => {
  const { engineers, draftingStatus } = useAppData().appData || {};

  const fields = [
    {
      label: "Engineering Needed",
      name: "engineeringNeeded",
      type: "checkbox",
    },
    {
      label: "Engineer Tasked To",
      name: "engineeringTaskedTo",
      type: "multiselect",
      options: engineers,
    },
    {
      label: "Engineering Status",
      name: "engineeringStatus",
      type: "select",
      options: draftingStatus,
    },
    {
      label: "Engineering Estimate",
      name: "engineeringEstimate",
      type: "number",
    },
    {
      label: "Engineering Dropbox Link",
      name: "engineeringDropboxLink",
      type: "url",
    },
    {
      label: "Estimated Start Date",
      name: "engineeringEstimatedStartTime",
      type: "date",
    },
    {
      label: "Estimated Delivery Date",
      name: "engineeringEstimatedDeliveryTime",
      type: "date",
    },
  ];

  return (
    <FormGenerator
      data={data}
      setter={setter}
      fields={fields}
      bgcolor="#fef9c3"
      viewOnly={viewOnly}
    />
  );
};

const MEP = ({ data, setter, viewOnly }) => {
  const { mep, draftingStatus } = useAppData().appData || {};

  const fields = [
    { label: "MEP Needed", name: "mepNeeded", type: "checkbox" },
    {
      label: "MEP Tasked To",
      name: "mepTaskedTo",
      type: "multiselect",
      options: mep,
    },
    {
      label: "MEP Status",
      name: "mepStatus",
      type: "select",
      options: draftingStatus,
    },
    {
      label: "MEP Estimate",
      name: "mepEstimate",
      type: "number",
    },
    { label: "MEP Dropbox Link", name: "mepDropboxLink", type: "url" },
    {
      label: "Estimated Start Date",
      name: "mepEstimatedStartTime",
      type: "date",
    },
    {
      label: "Estimated Delivery Date",
      name: "mepEstimatedDeliveryTime",
      type: "date",
    },
  ];

  return (
    <FormGenerator
      data={data}
      setter={setter}
      fields={fields}
      bgcolor="#f5f5f5"
      viewOnly={viewOnly}
    />
  );
};

const Civil = ({ data, setter, viewOnly }) => {
  const { civil, draftingStatus } = useAppData().appData || {};

  const fields = [
    { label: "Civil Needed", name: "civilNeeded", type: "checkbox" },
    {
      label: "Civil Tasked To",
      name: "civilTaskedTo",
      type: "multiselect",
      options: civil,
    },
    {
      label: "Civil Status",
      name: "civilStatus",
      type: "select",
      options: draftingStatus,
    },
    {
      label: "Civil Estimate",
      name: "civilEstimate",
      type: "number",
    },
    { label: "Civil Dropbox Link", name: "civilDropboxLink", type: "url" },
    {
      label: "Estimated Start Date",
      name: "civilEstimatedStartTime",
      type: "date",
    },
    {
      label: "Estimated Delivery Date",
      name: "civilEstimatedDeliveryTime",
      type: "date",
    },
  ];

  return (
    <FormGenerator
      data={data}
      setter={setter}
      fields={fields}
      bgcolor="rgb(210 218 240)"
      viewOnly={viewOnly}
    />
  );
};
// Exporting all components from the same file
export { Drafter, MEP, Engineering, Civil };
