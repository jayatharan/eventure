package org.example.datamodel;

import dev.morphia.annotations.Entity;
import dev.morphia.annotations.Id;
import dev.morphia.annotations.Reference;
import lombok.Data;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;

@Data
@Entity("events")
public class Event {
    @Id
    private ObjectId id;

    private String title;
    private String description;
    private String location;
    private Date startDate;

    @Reference
    private List<User> admins;

    @Reference
    private List<Task> tasks;

    @Reference
    private List<Participant> participants;

}
