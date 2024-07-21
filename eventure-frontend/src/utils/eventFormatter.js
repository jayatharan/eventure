import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"

dayjs.extend(localizedFormat);

export function formatEvent (event) {
    const formattedEvent = {...event}
    const date = dayjs(event.startDate);
    formattedEvent["date"] = date.format('dddd, D MMMM YYYY')
    formattedEvent["time"] = date.format('HH:mm')
    formattedEvent["noOfParticipants"] = event.participants.length
    let noOfAcceptedParticioants = 0;
    let noOfRejectedParticioants = 0;
    event.participants.forEach(participant => {
        if(participant.status == "accepted"){
            noOfAcceptedParticioants+=1
        }else if(participant.status == "rejected"){
            noOfRejectedParticioants+=1
        }
    })
    formattedEvent["noOfAcceptedParticioants"] = noOfAcceptedParticioants;
    formatEvent["noOfRejectedParticioants"] = noOfRejectedParticioants;
    return formattedEvent;
}

export function formatEvents (events) {
    return events.map(event => formatEvent(event))
}

export function groupFormattedEvents (events) {
    const dates = []
    const eventsList = []

    events.forEach(event => {
        const index = dates.findIndex(date => date == event.date)
        if(index == -1){
            dates.push(event.date)
            eventsList.push([event])
        }else{
            eventsList[index].push(event)
        }
    })

    return {
        dates,
        eventsList
    }
}