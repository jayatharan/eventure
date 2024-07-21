package org.example.repository;

import dev.morphia.Datastore;
import dev.morphia.query.experimental.filters.Filters;
import org.bson.types.ObjectId;
import org.example.app.messages.LoginDTO;
import org.example.datamodel.User;
import org.example.services.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

@Repository
public class UserRepository {
    @Autowired
    private Datastore datastore;

    @Autowired
    private JWTService jwtService;

    public User getUserById(ObjectId id) {
        return datastore.find(User.class).filter(
                Filters.eq("_id", id)
        ).first();
    }

    public User getUserByName(String name) {
        return datastore.find(User.class).filter(
                Filters.eq("name", name)
        ).first();
    }

    public String login(LoginDTO dto){

        User user = getUserByName(dto.getName());

        if(user == null){
            throw new RuntimeException("User not found");
        }

        return jwtService.generateToken(user.getId().toHexString());
    }
}
