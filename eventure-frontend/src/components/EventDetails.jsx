/* eslint-disable react/prop-types */
import { Box, Chip, Divider, Skeleton, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import useEvent from "../app/hooks/react-query/events/getEvent"
import { useMemo } from "react";
import { formatEvent } from "../utils/eventFormatter";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatDate } from "../utils/dateFormatter";
import { taskStatuses } from "../app/constants/taskStatuses";

function EventDetails({ eventId }) {

    const eventQuery = useEvent(eventId);

    const event = useMemo(() => {
        if (eventQuery.data) {
            return formatEvent(eventQuery.data)
        }
        return null;
    }, [eventQuery.data])

    if (event) {
        return (
            <Stack spacing={0.5}>
                <Typography variant="h6" textTransform={"capitalize"}>{event.title}</Typography>
                <Typography variant="body1">{event.description}</Typography>
                <Typography variant="body1" fontWeight={700}>{`Location: ${event.location}`}</Typography>
                <Stack display={"flex"} direction={"row"} justifyContent={"space-between"}>
                    <Typography variant="body1">{`Total Participants: ${event.participants?.length ?? 0}`}</Typography>
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
                            <Typography variant="button" fontWeight={700}>{event.noOfRejectedParticioants ?? 0}</Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack display={"flex"} direction={"row"} justifyContent={"space-between"}>
                    <Typography variant="body1" fontWeight={500}>{`Date: ${event.date}`}</Typography>
                    <Typography variant="body1" fontWeight={500}>{`Time: ${event.time}`}</Typography>
                </Stack>
                <Typography variant="h6">{`Your role: ${event.role.toUpperCase()}`}</Typography>
                <Stack>
                    <Typography variant="h6" fontWeight={500}>Admins</Typography>
                    <Box sx={{ display: "flex", flexWrap: 'wrap'  }} gap={1}>
                        {event.admins.map(admin => (
                            <Chip label={<Typography fontWeight={700}>{admin.name}</Typography>} key={admin.id} />
                        ))}
                    </Box>
                </Stack>
                {event.role != "participant" && (
                    <Stack>
                        <Typography variant="h6" fontWeight={500}>Tasks</Typography>
                        <Stack spacing={1}>
                            {event.tasks.map(task => (
                                <Stack sx={{
                                    p:1,
                                    border: "1px solid grey",
                                    borderRadius: 1
                                }} key={task.id}>
                                    <Typography fontWeight={700} textTransform={"capitalize"}>{task.title}</Typography>
                                    <Typography variant="body2">{task.description}</Typography>
                                    <Typography>{`Assignee: ${task.user.name}`}</Typography>
                                    <Typography>{`Deadline: ${formatDate(task.deadLine)}`}</Typography>
                                    <Stepper activeStep={taskStatuses.findIndex((status) => status == task.status)}>
                                        {taskStatuses.map(status => (
                                            <Step key={(status)}>
                                                <StepLabel sx={{
                                                    textTransform: "capitalize"
                                                }}>
                                                    {status}
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Stack>
                            ))}
                        </Stack>
                    </Stack>
                )}
                <Stack mt={2}>
                    <Typography variant="h6" fontWeight={500}>Participants</Typography>
                    <Divider sx={{
                        mb: 1
                    }} />
                    <Stack spacing={1}>
                        {event.participants.map(participant => (
                            <Stack key={participant.id} sx={{
                                padding: 1,
                                borderRadius: 1,
                                border: "1px solid grey"
                            }} display={"flex"} direction={"row"} justifyContent={"space-between"}>
                                <Typography >{participant.user.name}</Typography>
                                <Stack display={"flex"} direction={"row"} gap={2}>
                                    <CheckCircleIcon sx={{
                                        color: participant.status == "accepted" ? "green" : undefined
                                    }} />
                                    <CancelIcon sx={{
                                        color: participant.status == "rejected" ? "red" : undefined
                                    }} />
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </Stack>
        )
    }

    return (
        <Stack>
            <Skeleton variant="rectangular" sx={{
                height: "40vh"
            }} />
        </Stack>
    )
}

export default EventDetails