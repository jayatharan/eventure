import { useState } from 'react';
import useMyTasks from '../app/hooks/react-query/tasks/getMyTasks'
import { Alert, Button, ButtonGroup, Divider, Stack, Step, StepButton, Stepper, Typography } from '@mui/material';
import { formatDate } from '../utils/dateFormatter';
import { taskStatuses } from '../app/constants/taskStatuses';
import { updateTaskStatus } from '../app/hooks/react-query/tasks/updateTaskStatus';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import eventIdState from '../app/recoil/eventIdAtom';
import eventsFromState from '../app/recoil/eventsFromAtom';

function MyTasks() {
    const [status, setStatus] = useState("waiting")
    const eventsFrom = useRecoilValue(eventsFromState);
    const myTasksQuery = useMyTasks(status, eventsFrom.toISOString());
    const setEventId = useSetRecoilState(eventIdState);

    const changeTaskStatus = async (taskId, status) => {
        try{
            await updateTaskStatus(taskId, status)
            await myTasksQuery.refetch()
        }catch(error){
            console.log(error)
        }
    }

    return (
        <Stack sx={{
            p: 1
        }}>
            <Typography component={"h2"} fontSize={25} fontWeight={900}>Tasks</Typography>
            <Stack sx={{
                my:1
            }} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} >
                <ButtonGroup size='small'>
                    <Button variant={status === "waiting" ? "contained" : "outlined"} onClick={()=>setStatus("waiting")}>Waiting</Button>
                    <Button variant={status === "progress" ? "contained" : "outlined"} onClick={()=>setStatus("progress")}>Progress</Button>
                    <Button variant={status === "done" ? "contained" : "outlined"} onClick={()=>setStatus("done")}>Done</Button>
                </ButtonGroup>
            </Stack>
            <Stack spacing={1} sx={{
                height:"38vh",
                overflow: "hidden",
                overflowY: "auto",
            }}>
                {myTasksQuery.data?.length == 0 && (
                    <Alert severity='warning' variant='outlined'>
                        No Tasks Available
                    </Alert>
                )}
                {myTasksQuery.data?.map(task => (
                    <Stack sx={{
                        p: 1,
                        border: "1px solid black",
                        borderRadius: 1
                    }} key={task._id}>
                        <Typography fontWeight={700} textTransform={'capitalize'}>{task.title}</Typography>
                        <Typography variant="body2">{task.description}</Typography>
                        <Typography variant='body2' fontWeight={500}>{`Deadline: ${formatDate(task.deadLine)}`}</Typography>
                        <Stack my={1} sx={{
                            cursor: "pointer",
                        }} onClick={()=>setEventId(task.eventId._id)}>
                            <Divider />
                            <Stack display={"flex"} direction={'row'} justifyContent={'space-between'}>
                                <Typography variant='caption' fontWeight={700}>{`Event`}</Typography>
                                <Typography variant='caption' textAlign={'end'}>{`${formatDate(task.eventId.startDate)}`}</Typography>
                            </Stack>
                            <Typography variant='body2' textTransform={'capitalize'}>{task.eventId.title}</Typography>
                            <Divider />
                        </Stack>
                        <Stepper activeStep={taskStatuses.findIndex((status) => status == task.status)}>
                            {taskStatuses.map(status => (
                                <Step key={(status)} onClick={()=>changeTaskStatus(task._id, status)}>
                                    <StepButton  sx={{
                                        textTransform: "capitalize"
                                    }}>
                                        {status}
                                    </StepButton>
                                </Step>
                            ))}
                        </Stepper>
                    </Stack>
                ))}
            </Stack>
        </Stack>
  )
}

export default MyTasks