package org.example.repository;

import dev.morphia.Datastore;
import dev.morphia.query.experimental.filters.Filters;
import org.bson.types.ObjectId;
import org.example.datamodel.Participant;
import org.example.datamodel.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ParticipantRepository {
    @Autowired
    private Datastore datastore;

    public List<Participant> getUserParticipants(ObjectId userId) {
        return datastore.find(Participant.class).filter(
                Filters.eq("userId", userId)
        ).iterator().toList();
    }

    public List<Participant> getUserAcceptedParticipants(ObjectId userId) {
        return datastore.find(Participant.class).filter(
                Filters.and(
                        Filters.eq("userId", userId),
                        Filters.eq("status", "accepted")
                )
        ).iterator().toList();
    }

    public void deleteEventParticipants(ObjectId eventId) {
        datastore.find(Participant.class).filter(
                Filters.eq("eventId", eventId)
        ).delete();
    }

    public void deleteParticipant(ObjectId id) {
        datastore.find(Participant.class).filter(
                Filters.eq("_id", id)
        ).delete();
    }

}
