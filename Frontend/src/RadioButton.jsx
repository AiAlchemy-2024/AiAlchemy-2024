import React from "react";
import "./radiobutton.css";

const RadioButton = () => {
  return (
    <div className="scenerio">
      <div>
        <input
          type="radio"
          id="css"
          name="scenerio"
          value="Upload"
          defaultChecked={true}
        />
        <label htmlFor="Upload">Upload</label>
      </div>
      <br />
      <div>
        <input type="radio" id="html" name="scenerio" value="Realtime" />
        <label htmlFor="RealTime">RealTime</label>
      </div>
    </div>
  );
};

export default RadioButton;
