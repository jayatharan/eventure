import { useState } from "react"
import AppContext from "../contexts/AppContexts"

const AppProvider = ({
    // eslint-disable-next-line react/prop-types
    children
}) => {
    const [authStatus, setAuthStatus] = useState({
        status: "loading",
        user: null,
    })
    
    const appContextValues = {
        authStatus
    }

    return (
        <AppContext.Provider value={appContextValues} >
            {children}
        </AppContext.Provider>
      )
}

export default AppProvider