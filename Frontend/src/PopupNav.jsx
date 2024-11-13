import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Button from "./Button";

const PopupNav = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const [customisations, setCustomisations] = useState({
    summaryLength: "long",
    profile: "loans",
    AiAgents: [],
    customInstructions: "",
  });

  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    getCustomisations: () => {
      return customisations;
    },
    showPopup: () => {
      setIsOpen(true);
    },
    hidePopup: () => {
      setIsOpen(false);
    },
  }));

  const dropdownOptions = {
    summaryLength: {
      label: "Summary Length",
      options: ["long", "medium", "short"],
    },
    profile: {
      label: "Profile",
      options: ["loans", "mortgages"],
    },
    agents: [
      "Call summarisation",
      "Sentiment Analysis",
      "Case",
      "Next best Action",
      "Action items",
    ],
  };

  const onChangeHandler = (key, e) => {
    setCustomisations((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const saveClickHandler = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="popup">
      <div className="sectioned">
        <div className="section-heading">Response</div>
        <Dropdown
          item={dropdownOptions.summaryLength}
          onChange={onChangeHandler.bind(this, "summaryLength")}
        />
        <Dropdown
          item={dropdownOptions.profile}
          onChange={onChangeHandler.bind(this, "profile")}
        />
      </div>

      <div className="sectioned">
        <div className="section-heading">AI Agents</div>
        {dropdownOptions.agents.map((item) => (
          <CheckBox
            isChecked={customisations.AiAgents.includes(item)}
            key={item}
            item={item}
            onChange={() => {
              const ind = customisations.AiAgents.indexOf(item);
              if (ind !== -1) customisations.AiAgents.splice(ind, 1);
              else customisations.AiAgents.push(item);
            }}
          />
        ))}
      </div>

      <input
        value={customisations.customInstructions}
        onChange={(e) =>
          setCustomisations((prev) => ({
            ...prev,
            customInstructions: e.target.value,
          }))
        }
        className="text-field"
        type="text"
        placeholder="Custom Instructions"
      />

      <div className="popup-buttons-container">
        <Button label="Close" onClick={saveClickHandler} />
      </div>
    </div>
  );
});

const CheckBox = ({ item, isChecked, onChange }) => {
  return (
    <div>
      <label>
        <input type="checkbox" defaultChecked={isChecked} onChange={onChange} />
        {item}
      </label>
    </div>
  );
};

const Dropdown = ({ item, onChange }) => {
  return (
    <div className="select-container">
      <select className="custom-select" onChange={onChange}>
        {item.options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PopupNav;
