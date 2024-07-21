package org.example.datamodel;

import dev.morphia.annotations.Entity;
import dev.morphia.annotations.Id;
import lombok.Data;
import org.bson.types.ObjectId;

@Data
@Entity("participants")
public class Participant {
    @Id
    private ObjectId id;

    private ObjectId eventId;
    private ObjectId userId;
    private String status = "waiting";
}
