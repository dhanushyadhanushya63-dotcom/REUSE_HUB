package com.reusehub.marketplace.controller;

import com.reusehub.marketplace.dto.MessageDto;
import com.reusehub.marketplace.entity.Message;
import com.reusehub.marketplace.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<?> sendMessage(
            @RequestParam Long senderId,
            @RequestBody MessageDto dto
    ) {
        try {
            Message msg = messageService.sendMessage(senderId, dto);
            return ResponseEntity.ok(msg);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<Message>> getConversation(
            @RequestParam Long user1,
            @RequestParam Long user2
    ) {
        return ResponseEntity.ok(messageService.getConversation(user1, user2));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Message>> getUserMessages(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getUserMessages(userId));
    }
}
