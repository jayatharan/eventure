package org.example.app.messages;

import lombok.Data;

@Data
public class ParticipantDTO {
    private String id;
    private String eventId;
    private String userId;
    private String status = "waiting";

    private UserDTO user;
}
