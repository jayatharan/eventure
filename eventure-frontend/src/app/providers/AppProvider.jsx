import { useEffect, useRef, useState } from "react"
import AppContext from "../contexts/AppContexts"
import AuthForm from "../../components/AuthForm"
import { nodeBackendAxiosInstance, setAuthHeader } from "../../apis/AxiosInstances"
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material"
import { changePassword } from "../hooks/react-query/users/changePassword"

const AppProvider = ({
    // eslint-disable-next-line react/prop-types
    children
}) => {
    const [password, setPassword] = useState("")
    const isTokenRefreshed = useRef(false);
    const [loading, setLoading] = useState(true)
    const [authState, setAuthState] = useState({
        authenticated: false,
        user: null,
    })
    const [showProfile, setShowProfile] = useState(false)
    const [changePasswordAlert, setChangePasswordAlert] = useState("")

    const refreshAccessToken = async () => {
        setLoading(true)
        const refreshToken = localStorage.getItem("refreshToken");

        if(refreshToken) {
            try{
                const response = await nodeBackendAxiosInstance.post("/auth/refresh-token", {
                    token: refreshToken,
                })
                login(response.data)
            }catch(error){
                console.log(error)
            }
        }
        
        setLoading(false)
    }

    const changeMyPassword = async () => {
        setLoading(true)
        try{
            await changePassword(password)
            setChangePasswordAlert("success")
        }catch(error){
            setChangePasswordAlert("error")
        }
        setLoading(false)
    }

    const updateTokens = (tokens) => {
        setAuthHeader(tokens.accessToken)
        localStorage.setItem("refreshToken", tokens.refreshToken)
    }
    
    const login = (authResponse) => {
        setAuthState({
            authenticated: true,
            user: authResponse.user
        })
        updateTokens(authResponse.tokens)
    }

    const logout = () => {
        setAuthState({
            authenticated: false,
            user: null,
        })
        localStorage.removeItem("refreshToken")
    }

    const openProfile = () => {
        setShowProfile(true)
    }

    useEffect(()=> {
        if(!isTokenRefreshed.current){
            isTokenRefreshed.current = true;
            refreshAccessToken()
        }
    }, [])

    useEffect(()=> {
        let interval = null;
        if(authState.authenticated){
            interval = setInterval(() => {
                refreshAccessToken();
            }, 9 * 60 * 1000);
        }

        return () => {
            if(interval){
                clearInterval(interval);
            }
        }
    },[authState])

    useEffect(()=>{
        setChangePasswordAlert("")
    }, [showProfile])

    const appContextValues = {
        authState,
        login,
        logout,
        openProfile
    }

    return (
        <AppContext.Provider value={appContextValues} >
            <Dialog open={showProfile} maxWidth={"sm"} fullWidth onClose={() => setShowProfile(false)}> 
                <DialogTitle component={"div"}>
                    <Typography variant="h5">
                        My Profile
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        {changePasswordAlert && (
                            <Alert>
                                {changePasswordAlert === "success" ? "Password changed successfully" : "Password change failed"}
                            </Alert>
                        )}
                        <Stack>
                            <Typography variant="body2">Username</Typography>
                            <Typography variant="body1">{authState.user?.name}</Typography>
                        </Stack>
                        <Stack>
                            <Typography variant="body2">Password</Typography>
                            <TextField 
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                size="small"
                                type="password"
                            />
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button disabled={loading} variant="contained" onClick={changeMyPassword}>
                        Change Password
                    </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{
                position: "relative",
            }}>
                {loading && (
                    <CircularProgress sx={{
                        position: "absolute",
                        zIndex: 99,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }} />
                )}
                {authState.authenticated ? children : <AuthForm />}
            </Box>
        </AppContext.Provider>
      )
}

export default AppProvider