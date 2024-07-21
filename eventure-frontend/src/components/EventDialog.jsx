import { useRecoilState } from "recoil"
import eventIdState from "../app/recoil/eventIdAtom"
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material"
import EventDetails from "./EventDetails"
import CloseIcon from '@mui/icons-material/Close';

function EventDialog() {
    const [eventId, setEventId] = useRecoilState(eventIdState)

    const handleClose = () => {
        setEventId("")
    }

    return (
        <Dialog open={!!eventId} maxWidth={"md"} fullWidth onClose={handleClose}>
            <DialogTitle component={"div"}>
                <Typography variant="h5">
                    Event Details
                </Typography>
            </DialogTitle>
            <IconButton
                aria-label="close"
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
                onClick={handleClose}
                >
                <CloseIcon />
            </IconButton>
            <DialogContent>
                {eventId && (
                    <EventDetails eventId={eventId} />
                )}
            </DialogContent>
        </Dialog>
    )
}

export default EventDialog