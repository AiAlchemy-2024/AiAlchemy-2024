import React, { forwardRef, useImperativeHandle, useState } from "react";
import Button from "./Button";

const PopupNav = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  

  useImperativeHandle(ref, () => ({
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
  };

  const onChangeHandler = (key, e) => {
    props.setCustomisations(prev => ({...prev, [key] : e.target.value}))
  };
  
  const cancelClickhandler = () => {
    setIsOpen(false);
  };
  const saveClickHandler = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="popup">
      <Dropdown
        item={dropdownOptions.summaryLength}
        onChange={onChangeHandler.bind(this,'summaryLength')}
      />
      <Dropdown
        item={dropdownOptions.profile}
        onChange={onChangeHandler.bind(this,'profile')}
      />
      <div className="popup-buttons-container">
        <Button
          variant={"secondary"}
          label="Cancel"
          onClick={cancelClickhandler}
        />
        <Button label="Save" onClick={saveClickHandler} />
      </div>
    </div>
  );
});

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
