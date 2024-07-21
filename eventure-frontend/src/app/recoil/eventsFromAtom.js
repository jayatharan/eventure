import dayjs from "dayjs";
import { atom } from "recoil";

const todayDate = new Date();

todayDate.setHours(0)
todayDate.setMinutes(0)
todayDate.setSeconds(0)
todayDate.setMilliseconds(0)

const eventsFromState = atom({
    key: "eventsFromState",
    default: dayjs(todayDate)
})

export default eventsFromState;