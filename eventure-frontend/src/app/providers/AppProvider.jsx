import { useEffect, useRef, useState } from "react"
import AppContext from "../contexts/AppContexts"
import AuthForm from "../../components/AuthForm"
import { nodeBackendAxiosInstance, setAuthHeader } from "../../apis/AxiosInstances"
import { Box, CircularProgress } from "@mui/material"

const AppProvider = ({
    // eslint-disable-next-line react/prop-types
    children
}) => {
    const isTokenRefreshed = useRef(false);
    const [loading, setLoading] = useState(true)
    const [authState, setAuthState] = useState({
        authenticated: false,
        user: null,
    })

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

    const appContextValues = {
        authState,
        login,
        logout
    }

    return (
        <AppContext.Provider value={appContextValues} >
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