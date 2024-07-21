package tests;

import org.bson.types.ObjectId;
import org.example.conf.ApplicationConfiguration;
import org.example.datamodel.Event;
import org.example.repository.EventRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Date;
import java.util.List;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = ApplicationConfiguration.class)
public class TestEventRepository {

    @Autowired
    private EventRepository eventRepository;

    private static final ObjectId objectId = new ObjectId("667c19020fc31f4ea2f50897");

    @BeforeEach
    public void setup() {
        // Ensure the event is not present before each test
        eventRepository.deleteEventById(objectId);
    }

    @Test
    public void testEventCreate() {
        String title = "test repository";
        Event event = new Event();
        event.setId(objectId);
        event.setTitle(title);
        event.setStartDate(new Date());

        eventRepository.createEvent(event);

        Event createdEvent = eventRepository.getEventById(objectId);

        Assertions.assertNotNull(createdEvent);
        Assertions.assertEquals(title, createdEvent.getTitle());
    }

    @Test
    public void testEventRead() {
        String title = "test repository";
        Event event = new Event();
        event.setId(objectId);
        event.setTitle(title);
        event.setStartDate(new Date());

        eventRepository.createEvent(event);

        Event createdEvent = eventRepository.getEventById(objectId);

        Assertions.assertNotNull(createdEvent);
        Assertions.assertEquals(title, createdEvent.getTitle());
    }

    @Test
    public void testEventUpdate() {
        String initialTitle = "test repository";
        String updatedTitle = "updated repository";
        Event event = new Event();
        event.setId(objectId);
        event.setTitle(initialTitle);
        event.setStartDate(new Date());

        eventRepository.createEvent(event);

        Event eventToUpdate = eventRepository.getEventById(objectId);
        eventToUpdate.setTitle(updatedTitle);
        eventRepository.updateEvent(eventToUpdate);

        Event updatedEvent = eventRepository.getEventById(objectId);

        Assertions.assertNotNull(updatedEvent);
        Assertions.assertEquals(updatedTitle, updatedEvent.getTitle());
    }

    @Test
    public void testEventDelete() {
        String title = "test repository";
        Event event = new Event();
        event.setId(objectId);
        event.setTitle(title);
        event.setStartDate(new Date());

        eventRepository.createEvent(event);

        eventRepository.deleteEventById(objectId);

        Event deletedEvent = eventRepository.getEventById(objectId);

        Assertions.assertNull(deletedEvent);
    }

    @Test
    public void testGetAllEvents() {
        String title1 = "test repository 1";
        String title2 = "test repository 2";
        Event event1 = new Event();
        event1.setId(new ObjectId());
        event1.setTitle(title1);
        event1.setStartDate(new Date());

        Event event2 = new Event();
        event2.setId(new ObjectId());
        event2.setTitle(title2);
        event2.setStartDate(new Date());

        eventRepository.createEvent(event1);
        eventRepository.createEvent(event2);

        List<Event> events = eventRepository.getAllEvents();

        Assertions.assertNotNull(events);
        Assertions.assertTrue(events.size() >= 2); // Ensure at least two events exist
        Assertions.assertTrue(events.stream().anyMatch(e -> e.getTitle().equals(title1)));
        Assertions.assertTrue(events.stream().anyMatch(e -> e.getTitle().equals(title2)));
    }
}
