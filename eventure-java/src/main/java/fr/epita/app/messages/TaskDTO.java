package fr.epita.app.messages;

import lombok.Data;

import java.util.Date;

@Data
public class TaskDTO {
    private String id;
    private String title;
    private String description;
    private Date deadLine;
    private String userId;
    private String eventId;
    private String status = "waiting";

    private UserDTO user;
}
