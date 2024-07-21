package org.example.conf;

import com.mongodb.client.MongoClients;
import dev.morphia.Datastore;
import dev.morphia.Morphia;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = {"org.example.repository", "org.example.services"})
public class ApplicationConfiguration {

    private final static String DATABASE_NAME = "eventure";

    @Bean
    public Datastore datastore() {
        String uri = "mongodb://localhost:27017/";
        Datastore datastore = Morphia.createDatastore(MongoClients.create(uri), DATABASE_NAME);
        datastore.getMapper().mapPackage("com.mongodb.morphia.entities");
        datastore.ensureIndexes();
        return datastore;
    }
}
