package fr.epita.app.conversion;

import fr.epita.app.messages.EventDTO;
import fr.epita.datamodel.Event;
import fr.epita.datamodel.User;
import org.bson.types.ObjectId;

import java.util.ArrayList;

public class EventMapper {
    public static EventDTO toDTO(Event event){
        EventDTO dto = new EventDTO();
        dto.setId(event.getId().toHexString());
        dto.setTitle(event.getTitle());
        dto.setStartDate(event.getStartDate());
        dto.setDescription(event.getDescription());
        dto.setLocation(event.getLocation());
        dto.setTasks(new ArrayList<>());
        dto.setParticipants(new ArrayList<>());
        dto.setAdminIds(new ArrayList<>());

        if(event.getTasks() != null){
            dto.setTasks(
                    event.getTasks().stream().map(TaskMapper::toDTO).toList()
            );
        }

        if(event.getParticipants() != null) {
            dto.setParticipants(
                    event.getParticipants().stream().map(ParticipantMapper::toDTO).toList()
            );
        }

        if(event.getAdmins() != null) {
            dto.setAdmins(
                    event.getAdmins().stream().map(UserMapper::toDTO).toList()
            );
            dto.setAdminIds(
                    event.getAdmins().stream().map(user -> user.getId().toHexString()).toList()
            );
        }

        return dto;
    }

    public static Event toEntity(EventDTO dto){
        Event event = new Event();
        mergeDTOtoEntity(event, dto);
        return event;
    }

    public static void mergeDTOtoEntity(Event event, EventDTO dto){
        event.setId(new ObjectId());
        if(dto.getId() != null && !dto.getId().isEmpty()){
            event.setId(new ObjectId(dto.getId()));
        }
        event.setTitle(dto.getTitle());
        event.setStartDate(dto.getStartDate());
        event.setDescription(dto.getDescription());
        event.setLocation(dto.getLocation());

        if(dto.getTasks() != null){
            event.setTasks(dto.getTasks().stream().map(TaskMapper::toEntity).peek(task -> task.setEventId(event.getId())).toList());
        }

        if(dto.getParticipants() != null){
            event.setParticipants(dto.getParticipants().stream().map(ParticipantMapper::toEntity).peek(participant -> participant.setEventId(event.getId())).toList());
        }

        if(dto.getAdminIds() != null){
            event.setAdmins(dto.getAdminIds().stream().map(userId -> {
                User user = new User();
                user.setId(new ObjectId(userId));
                return user;
            }).toList());
        }
    }
}
