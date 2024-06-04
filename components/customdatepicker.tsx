import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "antd";// Import your DatePicker library here

interface CustomDatePickerProps {
  onChange?: (date: Dayjs | null, dateString: string | string[] | null, startDateOfWeek: string | null, endDateOfWeek: string | null) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ onChange }) => {
    const [startdate, setStartdate] = useState<string | null>(null);
    const [enddate, setEnddate] = useState<string | null>(null);
  
    const handleDateChange = (date: Dayjs | null, dateString: string | string[] | null) => {
      if (dateString) {
        let startDateOfWeek: string | null = null;
        let endDateOfWeek: string | null = null;
  
        // Your existing logic for calculating start and end dates
        // ...
  
        // Update state with start and end dates
        setStartdate(startDateOfWeek);
        setEnddate(endDateOfWeek);
  
        // Call the onChange prop if provided
        if (onChange) {
          onChange(date, dateString, startDateOfWeek, endDateOfWeek);
        }
      }
    };
  
    return (
      <DatePicker
        style={{
          borderRadius: "2rem",
          height: "2rem",
          width: "100%",
        }}
        format="YYYY-MM-DD"
        onChange={handleDateChange}
        // Other props can be passed here
      />
    );
  };
  

export default CustomDatePicker;
