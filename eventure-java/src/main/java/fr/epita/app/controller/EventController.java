package fr.epita.app.controller;

import fr.epita.app.conversion.EventMapper;
import fr.epita.app.conversion.UserMapper;
import fr.epita.app.messages.EventDTO;
import fr.epita.datamodel.Event;
import fr.epita.repository.EventRepository;
import fr.epita.repository.UserRepository;
import fr.epita.services.JWTService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
public class EventController {

    @Autowired
    EventRepository eventRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    JWTService jwtService;

    @GetMapping(value = "/api/events/my-events", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<EventDTO>> getMyEvents(
            @RequestParam String from,
            @RequestHeader("Authorization") String authorizationHeader) {
        String stringUserId = jwtService.extractUserIdFromAuthorizationHeader(authorizationHeader);

        if (stringUserId == null) {
            return ResponseEntity.badRequest().build();
        }

        ObjectId userId = new ObjectId(stringUserId);

        Instant instant = Instant.parse(from);
        Date eventsFrom = Date.from(instant);

        List<EventDTO> events = eventRepository.getUserEvents(userId, eventsFrom).stream().map(EventMapper::toDTO)
                .peek(eventDTO -> {
                    if (eventDTO.getAdminIds().contains(userId.toHexString())) {
                        eventDTO.setRole("admin");
                    } else {
                        eventDTO.getTasks().forEach(task -> {
                            if (task.getUserId().equals(userId.toHexString())) {
                                eventDTO.setRole("organizer");
                            }
                        });
                    }
                }).toList();

        return ResponseEntity.ok(events);
    }

    @PostMapping(value = "/api/events", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EventDTO> createEvent(
            @RequestBody EventDTO eventDTO,
            @RequestHeader("Authorization") String authorizationHeader) {
        String stringUserId = jwtService.extractUserIdFromAuthorizationHeader(authorizationHeader);

        if (stringUserId == null) {
            return ResponseEntity.badRequest().build();
        }

        Event event = EventMapper.toEntity(eventDTO);

        eventRepository.createEvent(event);
        return ResponseEntity.ok(EventMapper.toDTO(event));
    }

    @GetMapping(value = "/api/events/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EventDTO> getEvent(@PathVariable String id,
            @RequestHeader("Authorization") String authorizationHeader) {
        String stringUserId = jwtService.extractUserIdFromAuthorizationHeader(authorizationHeader);

        if (stringUserId == null) {
            return ResponseEntity.badRequest().build();
        }

        ObjectId userId = new ObjectId(stringUserId);
        EventDTO event = EventMapper.toDTO(eventRepository.getEventById(new ObjectId(id)));

        if (event.getTasks() != null) {
            event.setTasks(
                    event.getTasks().stream().peek(task -> task.setUser(
                            UserMapper.toDTO(
                                    userRepository.getUserById(new ObjectId(task.getUserId())))))
                            .toList());
        }

        if (event.getParticipants() != null) {
            event.setParticipants(
                    event.getParticipants().stream().peek(participant -> participant.setUser(
                            UserMapper.toDTO(
                                    userRepository.getUserById(new ObjectId(participant.getUserId())))))
                            .toList());
        }

        if (event.getAdminIds().contains(userId.toHexString())) {
            event.setRole("admin");
        } else {
            event.getTasks().forEach(task -> {
                if (task.getUserId().equals(userId.toHexString())) {
                    event.setRole("organizer");
                }
            });
        }

        return ResponseEntity.ok(event);
    }

    @PostMapping(value = "api/events/save", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EventDTO> saveEvent(
            @RequestBody EventDTO eventDTO,
            @RequestHeader("Authorization") String authorizationHeader) {
        String stringUserId = jwtService.extractUserIdFromAuthorizationHeader(authorizationHeader);

        if (stringUserId == null) {
            return ResponseEntity.badRequest().build();
        }

        Event event;
        if (eventDTO.getId() == null) {
            event = new Event();
        } else {
            event = eventRepository.getEventById(new ObjectId(eventDTO.getId()));
        }
        EventMapper.mergeDTOtoEntity(event, eventDTO);
        Event savedEvent = eventRepository.saveEvent(event);
        return ResponseEntity.ok(EventMapper.toDTO(savedEvent));
    }

    @PutMapping(value = "/api/events/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EventDTO> updateEvent(@PathVariable String id, @RequestBody EventDTO eventDTO,
            @RequestHeader("Authorization") String authorizationHeader) {
        String stringUserId = jwtService.extractUserIdFromAuthorizationHeader(authorizationHeader);

        if (stringUserId == null) {
            return ResponseEntity.badRequest().build();
        }

        eventDTO.setId(id);
        Event event = eventRepository.getEventById(new ObjectId(id));
        EventMapper.mergeDTOtoEntity(event, eventDTO);
        eventRepository.updateEvent(event);
        return ResponseEntity.ok(EventMapper.toDTO(event));
    }

    @DeleteMapping(value = "/api/events/{id}")
    public ResponseEntity<EventDTO> deleteEvent(@PathVariable String id,
            @RequestHeader("Authorization") String authorizationHeader) {
        String stringUserId = jwtService.extractUserIdFromAuthorizationHeader(authorizationHeader);

        if (stringUserId == null) {
            return ResponseEntity.badRequest().build();
        }
        eventRepository.deleteEventById(new ObjectId(id));
        return ResponseEntity.ok(null);
    }

    @DeleteMapping(value = "/api/events/{id}/tasks/{taskId}")
    public ResponseEntity deleteEventTask(@PathVariable String id, @PathVariable String taskId,
            @RequestHeader("Authorization") String authorizationHeader) {
        String stringUserId = jwtService.extractUserIdFromAuthorizationHeader(authorizationHeader);

        if (stringUserId == null) {
            return ResponseEntity.badRequest().build();
        }
        eventRepository.deleteEventTask(new ObjectId(id), new ObjectId(taskId));
        return ResponseEntity.ok(null);
    }

    @DeleteMapping(value = "/api/events/{id}/participants/{taskId}")
    public ResponseEntity deleteEventParticipant(@PathVariable String id, @PathVariable String taskId,
            @RequestHeader("Authorization") String authorizationHeader) {
        String stringUserId = jwtService.extractUserIdFromAuthorizationHeader(authorizationHeader);

        if (stringUserId == null) {
            return ResponseEntity.badRequest().build();
        }
        eventRepository.deleteEventParticipant(new ObjectId(id), new ObjectId(taskId));
        return ResponseEntity.ok(null);
    }
}
