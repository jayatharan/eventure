/* eslint-disable react/prop-types */
import { useMemo } from "react";
import useGetUsers from "../app/hooks/react-query/users/getUsers";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

function UserPicker({
    label,
    value,
    onChange
}) {
    const usersQuery = useGetUsers();

    const users = useMemo(() => {
        if (usersQuery.data) {
            return usersQuery.data.map(user => ({
                id: user._id,
                name: user.name,
            }))
        }
        return []
    }, [usersQuery.data])

    return (
        <Autocomplete
            options={users}
            loading={usersQuery.isFetching}
            getOptionLabel={option => option.name}
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {usersQuery.isFetching ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    )
}

export default UserPicker