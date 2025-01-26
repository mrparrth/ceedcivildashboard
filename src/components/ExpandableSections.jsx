import { CheckBox, SingleSelectDropdown } from "./Fields";
import useappData from "hooks/useAppData";

const FormGenerator = ({ data, setter, fields, bgcolor, viewOnly }) => {
  const handleInputChange = (name, value) => {
    setter(name, value);
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
            ) : type === "checkbox" ? (
              <CheckBox
                id={name}
                checked={data[name]}
                onChange={(value) => handleInputChange(name, value)}
                label={label}
                viewOnly={viewOnly}
              />
            ) : (
              <input
                type={type}
                name={name}
                value={data[name] || ""}
                onChange={(e) => handleInputChange(name, e.target.value)}
                className="form-input"
                disabled={viewOnly}
              />
            )}
          </div>
        </div>
      ))}
    </>
  );
};

const Drafter = ({ data, setter, viewOnly }) => {
  const { drafters, draftingStatus } = useappData().appData || {};

  const fields = [
    { label: "Drafter Needed", name: "drafterNeeded", type: "checkbox" },
    {
      label: "Drafter Tasked To",
      name: "drafterTaskedTo",
      type: "select",
      options: drafters
    },
    {
      label: "Drafting Status",
      name: "draftingStatus",
      type: "select",
      options: draftingStatus
    },
    {
      label: "Drafting Estimate",
      name: "draftingEstimate",
      type: "number"
    },
    { label: "Drafting Dropbox Link", name: "draftingDropboxLink" },
    {
      label: "Drafting Estimated Delivery Time",
      name: "draftingEstimatedDeliveryTime",
      type: "date"
    }
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
  const { engineers, draftingStatus } = useappData().appData || {};

  const fields = [
    {
      label: "Engineering Needed",
      name: "engineeringNeeded",
      type: "checkbox"
    },
    {
      label: "Engineer Tasked To",
      name: "engineerTaskedTo",
      type: "select",
      options: engineers
    },
    {
      label: "Engineering Status",
      name: "engineeringStatus",
      type: "select",
      options: draftingStatus
    },
    {
      label: "Engineering Estimate",
      name: "engineeringEstimate",
      type: "number"
    },
    { label: "Engineering Dropbox Link", name: "engineeringDropboxLink" },
    {
      label: "Engineering Estimated Delivery Time",
      name: "engineeringEstimatedDeliveryTime",
      type: "date"
    }
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
  const { mep, draftingStatus } = useappData().appData || {};

  const fields = [
    { label: "MEP Needed", name: "mepNeeded", type: "checkbox" },
    {
      label: "MEP Tasked To",
      name: "mepTaskedTo",
      type: "select",
      options: mep
    },
    {
      label: "MEP Status",
      name: "mepStatus",
      type: "select",
      options: draftingStatus
    },
    {
      label: "MEP Estimate",
      name: "mepEstimate",
      type: "number"
    },
    { label: "MEP Dropbox Link", name: "mepDropboxLink" },
    {
      label: "MEP Estimated Delivery Time",
      name: "mepEstimatedDeliveryTime",
      type: "date"
    }
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
  const { civil, draftingStatus } = useappData().appData || {};

  const fields = [
    { label: "Civil Needed", name: "civilNeeded", type: "checkbox" },
    {
      label: "Civil Tasked To",
      name: "civilTaskedTo",
      type: "select",
      options: civil
    },
    {
      label: "Civil Status",
      name: "civilStatus",
      type: "select",
      options: draftingStatus
    },
    {
      label: "Civil Estimate",
      name: "civilEstimate",
      type: "number"
    },
    { label: "Civil Dropbox Link", name: "civilDropboxLink" },
    {
      label: "Civil Estimated Delivery Time",
      name: "civilEstimatedDeliveryTime",
      type: "date"
    }
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
