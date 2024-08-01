package fr.epita.datamodel;

import dev.morphia.annotations.Entity;
import dev.morphia.annotations.Id;
import lombok.Data;
import org.bson.types.ObjectId;

import java.util.Date;

@Data
@Entity("tasks")
public class Task {
    @Id
    private ObjectId id;
    private String title;
    private String description;
    private Date deadLine;
    private String status = "waiting";

    private ObjectId userId;
    private ObjectId eventId;
}
