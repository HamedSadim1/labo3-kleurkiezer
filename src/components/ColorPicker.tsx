import React, { FC, Fragment, useState } from "react";

const ColorPicker = () => {
  const [color, setColor] = useState("#000000");

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    e.preventDefault();
    setColor(e.target.value);
    console.log(color);
  };

  return (
    <Fragment>
      <label htmlFor="color">Choose a color:</label>
      <input type="color" name="color" value={color} />
      <select onChange={handleChange}>
        <option value={color}>#000000</option>
        <option value="#FF0000">#FF0000</option>
        <option value="#00FF00">#00FF00</option>
        <option value="#0000FF">#0000FF</option>
      </select>
      <div
        style={{
          backgroundColor: color,
          width: 100,
          height: 100,
          marginLeft: 100,
        }}
      ></div>
    </Fragment>
  );
};

export default ColorPicker;
