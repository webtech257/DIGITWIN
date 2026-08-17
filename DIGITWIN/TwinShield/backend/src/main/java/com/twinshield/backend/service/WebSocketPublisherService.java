package com.twinshield.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twinshield.backend.websocket.SecurityEventWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class WebSocketPublisherService {

    @Autowired(required = false)
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private SecurityEventWebSocketHandler webSocketHandler;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void broadcastSecurityEvent(Map<String, Object> eventData) {
        try {
            String jsonPayload = objectMapper.writeValueAsString(eventData);
            
            // 1. Broadcast to raw WebSocket sessions (/ws-direct)
            webSocketHandler.broadcast(jsonPayload);

            // 2. Broadcast to STOMP Broker (/topic/security-events)
            if (messagingTemplate != null) {
                messagingTemplate.convertAndSend("/topic/security-events", eventData);
            }
            
            System.out.println("📡 REAL-TIME EVENT BROADCAST: " + jsonPayload);
        } catch (Exception e) {
            System.err.println("Failed to broadcast real-time security event: " + e.getMessage());
        }
    }
}
