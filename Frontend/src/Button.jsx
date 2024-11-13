import React from "react";

const Button = ({ variant, label, type, onClick }) => {
  return (
    <button
      type={type}
      className={`mybutton ${variant == "secondary" && "secondary"}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
