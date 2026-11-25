package com.reusehub.marketplace.service;

import com.reusehub.marketplace.dto.MessageDto;
import com.reusehub.marketplace.entity.Message;
import com.reusehub.marketplace.entity.Product;
import com.reusehub.marketplace.entity.User;
import com.reusehub.marketplace.repository.MessageRepository;
import com.reusehub.marketplace.repository.ProductRepository;
import com.reusehub.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Message sendMessage(Long senderId, MessageDto dto) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Product product = null;
        if (dto.getProductId() != null) {
            product = productRepository.findById(dto.getProductId()).orElse(null);
        }

        Message msg = new Message(sender, receiver, product, dto.getMessageText());
        return messageRepository.save(msg);
    }

    public List<Message> getConversation(Long user1, Long user2) {
        List<Message> messages = messageRepository.findConversation(user1, user2);
        // Mark as read if user1 is receiver
        for (Message m : messages) {
            if (m.getReceiver().getId().equals(user1) && !m.getIsRead()) {
                m.setIsRead(true);
                messageRepository.save(m);
            }
        }
        return messages;
    }

    public List<Message> getUserMessages(Long userId) {
        return messageRepository.findAllUserMessages(userId);
    }
}
