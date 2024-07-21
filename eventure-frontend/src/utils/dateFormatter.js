import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"

dayjs.extend(localizedFormat);

export function formatDate(dateString) {
    return dayjs(dateString).format('dddd, D MMMM YYYY, HH:mm:ss')
}