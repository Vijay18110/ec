import React from "react";

const SelectBox = ({options,handleChange}) => {
  return (
    <select onChange={(e)=>handleChange(e)} style={{padding:"7px"}} className="form-select" aria-label="Default select example">
      <option selected>--Select--</option>
      {options?.length>0 &&
      options.map((item,index)=>{
        return  <option key={index} value={item.Id}>{item.value}</option>
      })}
    </select>
  );
};

export default SelectBox;
