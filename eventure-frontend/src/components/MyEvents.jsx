import useMyEvents from '../app/hooks/react-query/events/getMyEvents';
import { Alert, AlertTitle, IconButton, Menu, Skeleton, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { formatEvents, groupFormattedEvents } from '../utils/eventFormatter';
import DateEvents from './DateEvents';
import EventDialog from './EventDialog';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useRecoilState } from 'recoil';
import eventsFromState from '../app/recoil/eventsFromAtom';
import dayjs from 'dayjs';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function MyEvents() {
    const [anchorEl, setAnchorEl] = useState(null)
    const [eventsFrom, setEventsFrom] = useRecoilState(eventsFromState);
    const myEventsQuery = useMyEvents(eventsFrom.toISOString());

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(()=>{
        myEventsQuery.refetch()
    }, [eventsFrom])
    
    const groupedEvents = useMemo(() => {
        if (myEventsQuery.data) return groupFormattedEvents(formatEvents(myEventsQuery.data))
        return {
            dates: [],
            eventsList: []
        }
    }, [myEventsQuery.data])

    return (
        <Stack sx={{
            p: 1
        }}>
            <Stack display={"flex"} direction={"row"} justifyContent={"space-between"} alignItems={'center'}>
                <Typography component={"h1"} fontSize={30} fontWeight={900}>Events</Typography>
                <Stack display={"flex"} direction={'row'} alignItems={'center'} gap={1}>
                    <Typography variant='body1' fontWeight={600}>{`Events from: ${eventsFrom.format('DD/MM/YYYY')}`}</Typography>
                    <IconButton size='small' sx={{ p: 0 }} onClick={handleClick}>
                        <CalendarMonthIcon />
                    </IconButton>
                </Stack>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <DateCalendar 
                        value={eventsFrom} 
                        onChange={(newValue) => {
                            const date = newValue.toDate()
                            date.setHours(0)
                            date.setMinutes(0)
                            date.setSeconds(0)
                            date.setMilliseconds(0)
                            setEventsFrom(dayjs(date))
                            handleClose()
                        }}
                    />
                </Menu>
            </Stack>
            <Stack spacing={2} sx={{
                height: "92vh",
                overflow: "hidden",
                overflowY: "auto",
            }}>
                {myEventsQuery.isLoading?(
                    <Stack spacing={1}>
                        {/* {Array.from({length:10}).map(index => (
                            <Skeleton key={index} variant='rectangular' sx={{
                                borderRadius: 1,
                                height: 178
                            }} />
                        ))} */}
                    </Stack>
                ):(
                    <>
                        {groupedEvents.dates.length == 0 && (
                            <Alert severity='warning'>
                                <AlertTitle>No Events Available</AlertTitle>
                                {`No events available to you from ${eventsFrom.format('dddd, D MMMM YYYY')}`} 
                            </Alert>
                        )}
                        {groupedEvents.dates.map((date, index) => (
                            <DateEvents date={date} key={index} events={groupedEvents.eventsList[index]} />
                        ))}
                    </>
                )}
            </Stack>
            <EventDialog />
        </Stack>
    )
}

export default MyEvents