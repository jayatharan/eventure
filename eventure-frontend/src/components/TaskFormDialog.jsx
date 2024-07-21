/* eslint-disable react/prop-types */

import { Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import CloseIcon from '@mui/icons-material/Close';
import { taskDefaultValue } from "./EventForm";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import UserPicker from "./UserPicker";

function TaskFormDialog({
    taskData,
    onClose,
    onSave
}) {
    const [formData, setFormData] = useState(taskDefaultValue)

    useEffect(()=>{
        if(taskData){
            setFormData(taskData)
        }else{
            setFormData(taskDefaultValue)
        }
    }, [taskData])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <Dialog open={!!taskData} maxWidth={"sm"} fullWidth onClose={onClose}>
            <DialogTitle component={"div"}>
                <Typography variant="h5">
                    {`${taskData?.id ? "Edit" : "Add"} Task`}
                </Typography>
            </DialogTitle>
            <IconButton
                aria-label="close"
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
                onClick={onClose}
                >
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <Stack spacing={2}>
                    <TextField name="title" label="Title" onChange={handleChange} value={formData.title} required fullWidth />
                    <TextField name="description" label="Description" onChange={handleChange} value={formData.description} multiline={true} minRows={3} fullWidth />
                    <DateTimePicker
                        label="Deadline"
                        value={dayjs(formData.deadLine)}
                        onChange={(newValue) => {
                            setFormData(prev => ({
                                ...prev,
                                deadLine: newValue.toISOString(),
                            }))
                        }}
                    />
                    <UserPicker label="Assignee" value={formData.user} onChange={(value) => setFormData(prev => ({
                        ...prev,
                        userId: value.id,
                        user: value
                    }))} />
                    <Button variant="contained" color="primary" onClick={()=>onSave(formData)} >Save</Button>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}

export default TaskFormDialog