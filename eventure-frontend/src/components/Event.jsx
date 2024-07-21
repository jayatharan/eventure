/* eslint-disable react/prop-types */
import { IconButton, Stack, Typography } from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useSetRecoilState } from "recoil";
import eventIdState from "../app/recoil/eventIdAtom";
import eventFormState from "../app/recoil/eventFormAtom";

function Event({
    event
}) {
  const setEventId = useSetRecoilState(eventIdState);
  const setEventForm = useSetRecoilState(eventFormState);

  return (
    <Stack spacing={0.25} sx={{
        p: 1,
        border: "1px solid black",
        borderRadius: 1,
        position: "relative"
    }}>
        <Stack display={"flex"} direction={"row"} sx={{
          position: "absolute",
          right: 3,
          top: 3
        }}>
          {event.role == "admin" && (
            <IconButton onClick={()=>setEventForm({
              open: true,
              eventId: event.id,
            })}>
              <EditIcon />
            </IconButton>
          )}
          <IconButton onClick={()=>setEventId(event.id)}>
            <VisibilityIcon />
          </IconButton>
        </Stack>
        <Typography variant="h6" textTransform={"capitalize"}>{event.title}</Typography>
        <Typography variant="body1">{event.description}</Typography>
        <Typography variant="body1" fontWeight={700}>{`Location: ${event.location}`}</Typography>
        <Stack display={"flex"} direction={"row"} justifyContent={"space-between"}>
          <Typography variant="body1">{`Total Participants: ${event.participants?.length??0}`}</Typography>
          <Stack display={"flex"} direction={"row"} gap={2}>
            <Stack display={"flex"} direction={"row"}>
              <CheckCircleIcon sx={{
                color: "grey"
              }} />
              <Typography variant="button" fontWeight={700}>{event.noOfAcceptedParticioants}</Typography>
            </Stack>
            <Stack display={"flex"} direction={"row"}>
              <CancelIcon sx={{
                color: "grey"
              }} />
              <Typography variant="button" fontWeight={700}>{event.noOfRejectedParticioants??0}</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack display={"flex"} direction={"row"} justifyContent={"space-between"}>
            <Typography variant="body1" fontWeight={500}>{`Date: ${event.date}`}</Typography>
            <Typography variant="body1" fontWeight={500}>{`Time: ${event.time}`}</Typography>
        </Stack>
        <Typography variant="body2" fontWeight={700}>{`Your role: ${event.role.toUpperCase()}`}</Typography>
    </Stack>
  )
}

export default Event