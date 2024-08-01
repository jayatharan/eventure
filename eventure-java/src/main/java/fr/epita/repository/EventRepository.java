package fr.epita.repository;

import dev.morphia.Datastore;
import dev.morphia.query.experimental.filters.Filters;
import fr.epita.datamodel.Event;
import fr.epita.datamodel.Participant;
import fr.epita.datamodel.Task;
import fr.epita.datamodel.User;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class EventRepository {

    @Autowired
    private Datastore datastore;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    public List<Event> getAllEvents() {
        return datastore.find(Event.class).iterator().toList();
    }

    public List<Event> getUserEvents(ObjectId userId, Date eventsFrom) {
        User admin = userRepository.getUserById(userId);
        List<Task> userTasks = taskRepository.getUserTasks(userId);
        List<Participant> userParticipants = participantRepository.getUserAcceptedParticipants(userId);
        return datastore.find(Event.class).filter(
                Filters.and(
                        Filters.or(
                                Filters.eq("admins", admin),
                                Filters.in("tasks", userTasks),
                                Filters.in("participants", userParticipants)
                        ),
                        Filters.gte("startDate", eventsFrom)
                )
        ).iterator().toList();
    }

    public Event getEventById(ObjectId id) {
        return datastore.find(Event.class)
                .filter(Filters.eq("_id", id))
                .first();
    }

    public void createEvent(Event event) {
        if(event.getParticipants() != null) {
            datastore.save(event.getParticipants());
        }
        if(event.getTasks() != null) {
            datastore.save(event.getTasks());
        }
        datastore.save(event);
    }

    public void updateEvent(Event event) {
        if(event.getParticipants() != null) {
            datastore.save(event.getParticipants());
        }
        if(event.getTasks() != null) {
            datastore.save(event.getTasks());
        }
        datastore.save(event);
    }

    public Event saveEvent(Event event) {
        if(event.getParticipants() != null) {
            datastore.save(event.getParticipants());
        }
        if(event.getTasks() != null) {
            datastore.save(event.getTasks());
        }
        datastore.save(event);

        return event;
    }

    public void deleteEventById(ObjectId id) {
        taskRepository.deleteEventTasks(id);
        participantRepository.deleteEventParticipants(id);
        datastore.find(Event.class)
                .filter(Filters.eq("_id", id))
                .delete();
    }

    public void deleteEventTask(ObjectId id, ObjectId taskId) {
        Event event = this.getEventById(id);
        List<Task> updatedTasks = event.getTasks().stream()
                .filter(task -> !task.getId().equals(taskId))
                .toList();
        event.setTasks(updatedTasks);
        taskRepository.deleteTask(taskId);
        datastore.save(event);
    }

    public void deleteEventParticipant(ObjectId id, ObjectId participantId) {
        Event event = this.getEventById(id);
        event.setParticipants(
                event.getParticipants().stream().filter(participant -> !participant.getId().equals(participantId)).toList()
        );
        participantRepository.deleteParticipant(participantId);
        datastore.save(event);
    }
}
