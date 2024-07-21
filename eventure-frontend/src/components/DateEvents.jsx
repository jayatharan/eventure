/* eslint-disable react/prop-types */
import { Stack, Typography } from "@mui/material"
import Event from "./Event"

function DateEvents({
    date,
    events
}) {
  return (
    <Stack spacing={0.5}>
        <Typography variant="h6" >{date}</Typography>
        <Stack paddingLeft={0.5}>
            <Stack spacing={1} paddingLeft={1.5} sx={{
                borderLeft: "1px solid grey"
            }} >
                {events.map(event => (
                    <Event event={event} key={event.id} />
                ))}
            </Stack>
        </Stack>
    </Stack>
  )
}

export default DateEvents