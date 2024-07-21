package org.example.app.controller;

import org.bson.types.ObjectId;
import org.example.app.conversion.EventMapper;
import org.example.app.conversion.UserMapper;
import org.example.app.messages.EventDTO;
import org.example.datamodel.Event;
import org.example.repository.EventRepository;
import org.example.repository.UserRepository;
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

    @GetMapping(value = "/api/events/my-events", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<EventDTO>> getMyEvents(
            @RequestParam String from
    ) {
        Instant instant = Instant.parse(from);
        Date eventsFrom = Date.from(instant);
        ObjectId userId = new ObjectId("66856469a04f387c6fab0a05");
        List<EventDTO> events = eventRepository.getUserEvents(userId, eventsFrom).stream().map(EventMapper::toDTO).peek(eventDTO -> {
            if (eventDTO.getAdminIds().contains(userId.toHexString())) {
                eventDTO.setRole("admin");
            }else{
                eventDTO.getTasks().forEach(task -> {
                    if(task.getUserId().equals(userId.toHexString())){
                        eventDTO.setRole("organizer");
                    }
                });
            }
        }).toList();

        return ResponseEntity.ok(events);
    }

    @PostMapping(value = "/api/events",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EventDTO> createEvent(@RequestBody EventDTO eventDTO) {
        Event event = EventMapper.toEntity(eventDTO);
        eventRepository.createEvent(event);
        return ResponseEntity.ok(EventMapper.toDTO(event));
    }

    @GetMapping(value = "/api/events/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EventDTO> getEvent(@PathVariable String id) {
        ObjectId userId = new ObjectId("66856469a04f387c6fab0a05");
        EventDTO event = EventMapper.toDTO(eventRepository.getEventById(new ObjectId(id)));

        if(event.getTasks() != null) {
            event.setTasks(
                    event.getTasks().stream().peek(task -> task.setUser(
                            UserMapper.toDTO(
                                    userRepository.getUserById(new ObjectId(task.getUserId()))
                            )
                    )).toList()
            );
        }

        if(event.getParticipants() != null) {
            event.setParticipants(
                    event.getParticipants().stream().peek(participant -> participant.setUser(
                            UserMapper.toDTO(
                                    userRepository.getUserById(new ObjectId(participant.getUserId()))
                            )
                    )).toList()
            );
        }

        if (event.getAdminIds().contains(userId.toHexString())) {
            event.setRole("admin");
        }else{
            event.getTasks().forEach(task -> {
                if(task.getUserId().equals(userId.toHexString())){
                    event.setRole("organizer");
                }
            });
        }

        return ResponseEntity.ok(event);
    }

    @PostMapping(value = "api/events/save",
        consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<EventDTO> saveEvent(@RequestBody EventDTO eventDTO) {
        Event event;
        if(eventDTO.getId() == null){
            event = new Event();
        }else{
            event = eventRepository.getEventById(new ObjectId(eventDTO.getId()));
        }
        EventMapper.mergeDTOtoEntity(event, eventDTO);
        Event savedEvent = eventRepository.saveEvent(event);
        return ResponseEntity.ok(EventMapper.toDTO(savedEvent));
    }

    @PutMapping(value = "/api/events/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EventDTO> updateEvent(@PathVariable String id, @RequestBody EventDTO eventDTO) {
        eventDTO.setId(id);
        Event event = eventRepository.getEventById(new ObjectId(id));
        EventMapper.mergeDTOtoEntity(event, eventDTO);
        eventRepository.updateEvent(event);
        return ResponseEntity.ok(EventMapper.toDTO(event));
    }

    @DeleteMapping(value = "/api/events/{id}")
    public ResponseEntity<EventDTO> deleteEvent(@PathVariable String id) {
        eventRepository.deleteEventById(new ObjectId(id));
        return ResponseEntity.ok(null);
    }

    @DeleteMapping(value = "/api/events/{id}/tasks/{taskId}")
    public ResponseEntity deleteEventTask(@PathVariable String id, @PathVariable String taskId) {
        eventRepository.deleteEventTask(new ObjectId(id), new ObjectId(taskId));
        return ResponseEntity.ok(null);
    }

    @DeleteMapping(value = "/api/events/{id}/participants/{taskId}")
    public ResponseEntity deleteEventParticipant(@PathVariable String id, @PathVariable String taskId) {
        eventRepository.deleteEventParticipant(new ObjectId(id), new ObjectId(taskId));
        return ResponseEntity.ok(null);
    }
}
