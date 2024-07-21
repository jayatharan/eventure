package org.example.repository;

import dev.morphia.Datastore;
import dev.morphia.query.experimental.filters.Filters;
import org.bson.types.ObjectId;
import org.example.datamodel.Task;
import org.example.datamodel.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TaskRepository {

    @Autowired
    private Datastore datastore;

    @Autowired
    private UserRepository userRepository;

    public void saveMany(List<Task> tasks) {
        datastore.save(tasks);
    }

    public void save(Task task) {
        datastore.save(task);
    }

    public List<Task> getUserTasks(ObjectId userId) {
        return datastore.find(Task.class).filter(
                Filters.eq("userId", userId)
        ).iterator().toList();
    }

    public void deleteEventTasks(ObjectId eventId) {
        datastore.find(Task.class).filter(
                Filters.eq("eventId", eventId)
        ).delete();
    }

    public void deleteTask(ObjectId id) {
        datastore.find(Task.class).filter(
                Filters.eq("_id", id)
        ).delete();
    }
}
