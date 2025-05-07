import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const formatTime = (time: string) => {
    if (!time) return "00:00:00";

    const correctedTime = time.replace(".", ":");

    let parsedTime = dayjs(correctedTime, ["HH:mm", "H:mm"], true);

    if (!parsedTime.isValid()) {
        console.error("Format d'heure invalide : ${time}");
        return "00:00:00";
    }

    return parsedTime.format("HH:mm:ss");
};

export function extractTime(dateString: string,type: string){
    const timePart = dateString.split("T")[1];
    const [hour, minute] = timePart.split(":");
    if(type === "minute"){
        return parseInt(minute, 10)

    }else if(type === "hour"){
        return parseInt(hour, 10)
    }else {

    }
}

export function splitDate (dateString: string) {
    if (!dateString) return "";
    return dateString.split("T")[0];
}