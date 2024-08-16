import { Box, Button, Container, Divider, Stack, TextField, Typography } from "@mui/material"
import { useContext, useMemo, useState } from "react"
import useNameCheck from "../app/hooks/react-query/auth/nameCheck"
import { nodeBackendAxiosInstance } from "../apis/AxiosInstances"
import AppContext from "../app/contexts/AppContexts"

const formDefaultValue = {
    name: "",
    password: "",
}

function AuthForm() {
    const appContext = useContext(AppContext);
    const [login, setLogin] = useState(true)
    const [formData, setFormData] = useState(formDefaultValue)

    const nameCheckQuery = useNameCheck(formData.name)

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmitForm = async (event) => {
        event.preventDefault()
        try{
            const response = await nodeBackendAxiosInstance.post(`/auth/${login ? "login" : "sign-up"}`, formData);
            setFormData(formDefaultValue)
            appContext.login(response.data)
        }catch(err){
            console.log(err)
        }
    }

    const error = useMemo(()=> {
        if(nameCheckQuery.isFetching) {
            return {
                error: false,
                message: "Loading..."
            }
        }

        if(nameCheckQuery.data) {
            if(login && !nameCheckQuery.data.exist) {
                return {
                    error: true,
                    message: "User not Found"
                }
            }else if(!login && nameCheckQuery.data.exist){
                return {
                    error: true,
                    message: "User already Exist"
                }
            }
        }

        return {
            error: false,
            message: ""
        }
    }, [nameCheckQuery.data, nameCheckQuery.isFetching, login])

    return (
        <Container maxWidth="sm">
            <Box sx={{
                py: 2
            }}>
                <Typography component={"h1"} fontSize={30} fontWeight={900}>
                    {login ? "Login" : "Sign Up"}
                </Typography>
                <Divider />
                <form onSubmit={handleSubmitForm}>
                    <Stack spacing={2} mt={2}>
                        <TextField name="name" label="Username" onChange={handleChange} value={formData.name} error={error.error} helperText={error.message} required fullWidth />
                        <TextField name="password" label="Password" type="password" onChange={handleChange} value={formData.password} required fullWidth />
                        <Stack display={"flex"} direction={"row"} alignItems={"center"} gap={2}>
                            <Typography>{login ? "Not a Member?" : "Already a Member"}</Typography>
                            <Button variant="outlined" size="small" onClick={() => setLogin(prev => !prev)}>{!login ? "Login" : "Sign Up"}</Button>
                        </Stack>
                        <Button variant="contained" type="submit" disabled={error.error}>{login ? "Login" : "Sign Up"}</Button>
                    </Stack>
                </form>
            </Box>
        </Container>
    )
}

export default AuthForm