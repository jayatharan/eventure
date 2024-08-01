package fr.epita.app.conversion;

import fr.epita.app.messages.ParticipantDTO;
import fr.epita.datamodel.Participant;
import org.bson.types.ObjectId;

public class ParticipantMapper {
    public static ParticipantDTO toDTO(Participant participant) {
        ParticipantDTO dto = new ParticipantDTO();
        dto.setId(participant.getId().toHexString());
        dto.setUserId(participant.getUserId().toHexString());
        dto.setEventId(participant.getEventId().toHexString());
        dto.setStatus(participant.getStatus());

        return dto;
    }

    public static Participant toEntity(ParticipantDTO dto) {
        Participant participant = new Participant();
        mergeDTOtoEntity(participant, dto);
        return participant;
    }

    public static void mergeDTOtoEntity(Participant participant, ParticipantDTO dto) {
        participant.setId(new ObjectId());
        participant.setStatus(dto.getStatus());
        if(dto.getId() != null && !dto.getId().isEmpty()) {
            participant.setId(new ObjectId(dto.getId()));
        }
        if(dto.getUserId() != null && !dto.getUserId().isEmpty()) {
            participant.setUserId(new ObjectId(dto.getUserId()));
        }
        if(dto.getEventId() != null && !dto.getEventId().isEmpty()) {
            participant.setEventId(new ObjectId(dto.getEventId()));
        }
    }
}
