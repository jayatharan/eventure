package fr.epita.repository;

import dev.morphia.Datastore;
import dev.morphia.query.experimental.filters.Filters;
import fr.epita.app.messages.LoginDTO;
import fr.epita.datamodel.User;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
    @Autowired
    private Datastore datastore;

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

        return "";
    }
}
