import { useState } from "react"
import AppContext from "../contexts/AppContexts"
import AuthForm from "../../components/AuthForm"
import { setAuthHeader } from "../../apis/AxiosInstances"

const AppProvider = ({
    // eslint-disable-next-line react/prop-types
    children
}) => {
    const [authState, setAuthState] = useState({
        authenticated: false,
        user: null,
    })
    
    const login = (authResponse) => {
        console.log(authResponse)
        setAuthState({
            authenticated: true,
            user: authResponse.user
        })
        setAuthHeader(authResponse.tokens.accessToken)
    }

    const logout = () => {
        setAuthState({
            authenticated: false,
            user: null,
        })
    }

    const appContextValues = {
        authState,
        login,
        logout
    }

    return (
        <AppContext.Provider value={appContextValues} >
            {authState.authenticated ? children : <AuthForm />}
        </AppContext.Provider>
      )
}

export default AppProvider