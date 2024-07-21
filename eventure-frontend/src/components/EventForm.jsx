import { Box, Button, Chip, IconButton, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import eventFormState from "../app/recoil/eventFormAtom"
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";
import { saveEvent } from "../app/hooks/react-query/events/saveEvent";
import CloseIcon from '@mui/icons-material/Close';
import { getEvent } from "../app/hooks/react-query/events/getEvent";
import UsersPicker from "./UsersPicker";
import { formatDate } from "../utils/dateFormatter";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteEventTask } from "../app/hooks/react-query/tasks/deleteEventTask";
import TaskFormDialog from "./TaskFormDialog";
import AddIcon from '@mui/icons-material/Add';
import { deleteEventParticipant } from "../app/hooks/react-query/participants/deleteEventParticipant";
import AddParticipantForm from "./AddParticipantForm";

const formDefaultValue = {
    title: "",
    description: "",
    location: "",
    startDate: new Date().toISOString(),
    adminIds: ["66856469a04f387c6fab0a05"]
}

export const taskDefaultValue = {
    title: "",
    description: "",
    deadLine: new Date().toISOString(),
    userId: "",
    user: null,
}

function EventForm() {
    const [eventForm, setEventForm] = useRecoilState(eventFormState);
    const [formData, setFormData] = useState(formDefaultValue)
    const [admins, setAdmins] = useState([])
    const [tasks, setTasks] = useState([])
    const [participants, setParticipants] = useState([])
    const [taskData, setTaskData] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSaveEvent = async (event) => {
        event.preventDefault()
        try {
            const event = await saveEvent({
                ...formData,
                tasks,
                participants
            })
            setEventForm({
                open: true,
                eventId: event.id
            })
        } catch (error) {
            console.log(error)
        }
    }

    const resetForm = () => {
        setFormData(formDefaultValue)
        setAdmins([])
        setTasks([])
        setParticipants([])
    }

    const loadEventData = async () => {
        try {
            const eventResponse = await getEvent(eventForm.eventId)
            setFormData({
                id: eventResponse.id,
                title: eventResponse.title,
                description: eventResponse.description,
                location: eventResponse.location,
                startDate: eventResponse.startDate,
                adminIds: eventResponse.adminIds
            })
            setAdmins(eventResponse.admins)
            setTasks(eventResponse.tasks)
            setParticipants(eventResponse.participants)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteEventTask = async (taskId, local) => {
        if(local){
            setTasks(prev => prev.filter((task, index) => index != taskId))
        }else{
            try {
                await deleteEventTask(eventForm.eventId, taskId)
                await loadEventData()
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleDeleteEventParticipant = async (participantId, local) => {
        if(local){
            setParticipants(prev => prev.filter((participant, index) => index != participantId))
        }else{
            try{
                await deleteEventParticipant(eventForm.eventId, participantId)
                await loadEventData()
            }catch(error) {
                console.log(error)
            }
        }
    }

    const loadFormData = async () => {
        if (!eventForm || !eventForm.eventId) {
            resetForm()
        }

        if (eventForm?.eventId) {
            loadEventData()
        }
    }

    const onAdminsChange = (newAdmins) => {
        setFormData(prev => ({
            ...prev,
            adminIds: newAdmins.map(admin => admin.id)
        }))
        setAdmins(newAdmins)
    }

    const handleEditTask = (task) => {
        setTaskData({
            id: task.id,
            title: task.title,
            description: task.description,
            deadLine: task.deadLine,
            userId: task.userId,
            user: task.user,
        })
    }

    const handleCloseTaskForm = () => {
        setTaskData(null);
    }

    const handleSaveTask = (newTask) => {
        if(newTask.id){
            setTasks(prev => prev.map(task => {
                if(task.id == newTask.id){
                    return ({
                        ...task,
                        ...newTask
                    })
                }else{
                    return task
                }
            }))
        }else{
            setTasks(prev => ([...prev, newTask]))
        }
        setTaskData(null)
    }

    const handleAddParticipant = (user) => {
        setParticipants(prev => ([...prev, {
            user,
            userId: user.id
        }]))
    }

    useEffect(() => {
        loadFormData()
    }, [eventForm])

    return (
        <Stack>
            <TaskFormDialog taskData={taskData} onClose={handleCloseTaskForm} onSave={handleSaveTask} />
            <Stack display={"flex"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} sx={{
                mb: 2,
                pt: 1
            }}>
                <Typography component={"h1"} fontSize={30} fontWeight={900}>{`${eventForm?.eventId ? "Edit" : "Add"} Event`}</Typography>
                <IconButton onClick={() => setEventForm(null)}>
                    <CloseIcon />
                </IconButton>
            </Stack>
            <Stack display={"flex"} direction={"row"}>
                <Stack flex={6} spacing={2}>
                    <form onSubmit={handleSaveEvent}>
                        <Stack spacing={2}>
                            <TextField name="title" label="Title" onChange={handleChange} value={formData.title} required fullWidth />
                            <TextField name="description" label="Description" onChange={handleChange} value={formData.description} multiline={true} minRows={3} fullWidth />
                            <TextField name="location" label="Location" onChange={handleChange} value={formData.location} required fullWidth />
                            <DateTimePicker
                                label="Start Date and Time"
                                value={dayjs(formData.startDate)}
                                onChange={(newValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        startDate: newValue.toISOString(),
                                    }))
                                }}
                            />
                            <UsersPicker label="Admins" value={admins} onChange={onAdminsChange} />
                            <Button variant="contained" color="primary" type="submit" >Save</Button>
                        </Stack>
                    </form>
                </Stack>
                <Stack flex={4}>
                    <Stack sx={{
                        p: 1,
                        pt: 0,
                    }} spacing={1}>
                        <Typography component={"h2"} fontSize={25} fontWeight={900}>Tasks</Typography>
                        {tasks.map((task, idx) => (
                            <Stack key={task.id} sx={{
                                p: 1,
                                border: "1px solid black",
                                borderRadius: 1,
                            }}>
                                <Stack display={"flex"} direction={"row"} justifyContent={"flex-end"}>
                                    <IconButton size="small" onClick={() => handleEditTask(task)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDeleteEventTask(task.id?task.id:idx, task.id?false:true)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                                <Typography fontWeight={700} textTransform={'capitalize'}>{task.title}</Typography>
                                <Typography variant="body2">{task.description}</Typography>
                                <Typography variant='body2' fontWeight={500}>{`Deadline: ${formatDate(task.deadLine)}`}</Typography>
                                <Typography variant='body2' fontWeight={500}>{`Assignee: ${task.user.name}`}</Typography>
                            </Stack>
                        ))}
                        <Stack sx={{
                            p: 1,
                            border: "1px solid black",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }} onClick={()=>setTaskData(taskDefaultValue)}>
                            <AddIcon />
                        </Stack>
                    </Stack>
                    <Stack sx={{
                        p: 1,
                        pt: 0,
                    }} spacing={2}>
                        <Typography component={"h2"} fontSize={25} fontWeight={900}>Participants</Typography>
                        <Box sx={{ display: "flex", flexWrap: 'wrap' }} gap={1}>
                            {participants.map((participant, idx) => (
                                <Chip key={idx} 
                                    label={<Typography fontWeight={700}>{participant.user.name}</Typography>} 
                                    onDelete={()=>handleDeleteEventParticipant(participant.id?participant.id:idx, participant.id?false:true)}
                                />
                            ))}
                        </Box>
                        <AddParticipantForm onAdd={handleAddParticipant} selectedUserIds={participants.map(participant => participant.userId)} />
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default EventForm