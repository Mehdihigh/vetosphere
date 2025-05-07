import React from "react";
import Calendar from "../components/common/calendar/Calendar.tsx";

const Event: React.FC = () => {
    return (
       <div className="w-full h-full pb-4">
           <Calendar
               initialView="timeGridWeek"
               className="bg-transparent"
               datesSet={() => {}}
           />

       </div>
    );
};

export default Event;
