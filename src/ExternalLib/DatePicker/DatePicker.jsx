import { DatePicker } from "antd";

const DatePicker1 = ({ handleChange, value,max }) => {
  return (
    <>
      <DatePicker maxDate={max} value={value} onChange={handleChange} />
    </>
  );
};

export default DatePicker1;
