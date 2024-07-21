package org.example.datamodel;

import dev.morphia.annotations.Entity;
import dev.morphia.annotations.Id;
import lombok.Data;
import org.bson.types.ObjectId;

@Data
@Entity("users")
public class User {
    @Id
    private ObjectId id;
    private String name;
}
