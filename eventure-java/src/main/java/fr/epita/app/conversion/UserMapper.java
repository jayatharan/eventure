package fr.epita.app.conversion;

import fr.epita.app.messages.UserDTO;
import fr.epita.datamodel.User;
import org.bson.types.ObjectId;

public class UserMapper {
    public static UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId().toHexString());
        dto.setName(user.getName());

        return dto;
    }

    public static User toEntity(UserDTO dto) {
        User user = new User();
        mergeDTOtoEntity(user, dto);
        return user;
    }

    public static void mergeDTOtoEntity(User user, UserDTO dto) {
        user.setName(dto.getName());
        user.setId(new ObjectId(dto.getId()));
    }
}
