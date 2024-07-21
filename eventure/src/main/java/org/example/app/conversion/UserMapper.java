package org.example.app.conversion;

import org.bson.types.ObjectId;
import org.example.app.messages.UserDTO;
import org.example.datamodel.User;

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
