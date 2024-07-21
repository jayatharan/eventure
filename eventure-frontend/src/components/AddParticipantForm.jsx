/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react'
import useGetUsers from '../app/hooks/react-query/users/getUsers';
import { Autocomplete, CircularProgress,  IconButton,  TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function AddParticipantForm({
    onAdd,
    selectedUserIds
}) {
    const [value, setValue] = useState(null)
    const usersQuery = useGetUsers();

    const users = useMemo(() => {
        if (usersQuery.data) {
            return usersQuery.data.map(user => ({
                id: user._id,
                name: user.name,
            })).filter(user => !selectedUserIds.includes(user.id))
        }
        return []
    }, [usersQuery.data, selectedUserIds])

    const handleAdd = () => {
        onAdd(value)
        setValue(null)
    }

    return (
        <Autocomplete
            options={users}
            loading={usersQuery.isFetching}
            getOptionLabel={option => option?option.name:null}
            value={value}
            onChange={(_, newValue) => setValue(newValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={"Add Participant"}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {value ? <IconButton onClick={handleAdd}><AddIcon /></IconButton> : null}
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

export default AddParticipantForm