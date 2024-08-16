import { Fab, Stack, Tooltip } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSetRecoilState } from "recoil";
import eventFormState from "../app/recoil/eventFormAtom";
import { useContext } from "react";
import AppContext from "../app/contexts/AppContexts";
import AccountBoxIcon from '@mui/icons-material/AccountBox';

function FloatingActionButtons() {
    const setEventForm = useSetRecoilState(eventFormState);
    const appContext = useContext(AppContext);

    return (
        <Stack
            sx={{
                position: "absolute",
                right: 1,
                bottom: 1,
                paddingBottom: 1
            }}
            gap={1}
        >
            <Fab color="primary" aria-label="add" onClick={() => setEventForm({
                open: true,
            })}>
                <Tooltip title="Add New Event">
                    <AddIcon />
                </Tooltip>
            </Fab>
            <Fab color="success">
                <Tooltip title="My Profile" onClick={() => appContext.openProfile()}>
                    <AccountBoxIcon />    
                </Tooltip>
            </Fab>
            <Fab aria-label="logout" onClick={() => appContext.logout()}>
                <Tooltip title="Logout">
                    <LogoutIcon />
                </Tooltip>
            </Fab>
        </Stack>
    )
}

export default FloatingActionButtons