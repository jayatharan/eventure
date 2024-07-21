import { useState } from "react";
import useMyParticipants from "../app/hooks/react-query/participants/getMyParticipants";
import { Alert, Button, ButtonGroup, Divider, IconButton, Stack, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatDate } from "../utils/dateFormatter";
import { updateParticipantStatus } from "../app/hooks/react-query/participants/updateParticipantStatus";
import useMyEvents from "../app/hooks/react-query/events/getMyEvents";
import eventIdState from "../app/recoil/eventIdAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import eventsFromState from "../app/recoil/eventsFromAtom";

function MyParticipants() {
    const [status, setStatus] = useState("waiting")
    const eventsFrom = useRecoilValue(eventsFromState)
    const myParticipantsQuery = useMyParticipants(status, eventsFrom.toISOString())
    const setEventId = useSetRecoilState(eventIdState)

    const changeParticipantStatus = async (participantId, status) => {
        try{
            await updateParticipantStatus(participantId, status)
            await myParticipantsQuery.refetch()
            await myEventsQuery.refetch()
        }catch(error){
            console.log(error)
        }
    }

    const myEventsQuery = useMyEvents(eventsFrom.toISOString())

    return (
        <Stack sx={{
            p: 1
        }}>
            <Typography component={"h2"} fontSize={25} fontWeight={900}>Event Invites</Typography>
            <Stack sx={{
                my: 1
            }} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} >
                <ButtonGroup size='small'>
                    <Button variant={status === "waiting" ? "contained" : "outlined"} onClick={() => setStatus("waiting")}>Waiting</Button>
                    <Button variant={status === "accepted" ? "contained" : "outlined"} onClick={() => setStatus("accepted")}>Accepted</Button>
                    <Button variant={status === "rejected" ? "contained" : "outlined"} onClick={() => setStatus("rejected")}>Rejected</Button>
                </ButtonGroup>
            </Stack>
            <Stack spacing={1} sx={{
                height: "38vh",
                overflow: "hidden",
                overflowY: "auto",
            }}>
                {myParticipantsQuery.data?.length == 0 && (
                    <Alert severity='warning' variant='outlined'>
                        No Invites Available
                    </Alert>
                )}
                {myParticipantsQuery.data?.map(participant => (
                    <Stack sx={{
                        p: 1,
                        border: "1px solid black",
                        borderRadius: 1
                    }} key={participant._id}>
                        <Stack sx={{
                            cursor: "pointer"
                        }} onClick={()=>setEventId(participant.eventId._id)}>
                            <Stack display={"flex"} direction={'row'} justifyContent={'space-between'}>
                                <Typography variant='caption' fontWeight={700}>{`Event`}</Typography>
                                <Typography variant='caption' textAlign={'end'}>{`${formatDate(participant.eventId.startDate)}`}</Typography>
                            </Stack>
                            <Typography variant='body2' textTransform={'capitalize'}>{participant.eventId.title}</Typography>
                            <Typography variant="caption">{participant.eventId.description}</Typography>
                        </Stack>
                        <Divider />
                        <Stack display={"flex"} direction={"row"} gap={2} justifyContent={"end"}>
                            <IconButton sx={{p:0}} onClick={()=>changeParticipantStatus(participant._id, "accepted")}>
                                <CheckCircleIcon sx={{
                                    color: participant.status == "accepted" ? "green" : undefined
                                }} />
                            </IconButton>
                            <IconButton sx={{p:0}} onClick={()=>changeParticipantStatus(participant._id, "rejected")}>
                                <CancelIcon sx={{
                                    color: participant.status == "rejected" ? "red" : undefined
                                }} />
                            </IconButton>
                        </Stack>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    )
}

export default MyParticipants