package org.example.app.messages;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class EventDTO {
    private String id;
    private String title;
    private String description;
    private String location;
    private Date startDate;
    private List<String> adminIds;
    private String role = "participant";

    private List<TaskDTO> tasks;
    private List<ParticipantDTO> participants;
    private List<UserDTO> admins;
}
