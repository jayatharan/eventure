package fr.epita.app.controller;


import fr.epita.app.messages.LoginDTO;
import fr.epita.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
public class AuthController {
    @Autowired
    UserRepository userRepository;

    @PostMapping(value = "/api/auth/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> login(@RequestBody LoginDTO dto){
        String token = userRepository.login(dto);
        return ResponseEntity.ok(token);
    }
}
