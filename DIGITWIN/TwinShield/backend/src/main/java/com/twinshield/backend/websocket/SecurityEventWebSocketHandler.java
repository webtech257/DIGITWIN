package com.twinshield.backend.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SecurityEventWebSocketHandler extends TextWebSocketHandler {

    private static final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("🟢 Real-Time SOC WebSocket Connected: Session ID=" + session.getId());
        
        // Send initial connection ACK
        session.sendMessage(new TextMessage("{\"type\":\"SYSTEM_CONNECTED\",\"status\":\"LIVE\",\"message\":\"TwinShield Security Stream Connected\"}"));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("🔴 Real-Time SOC WebSocket Closed: Session ID=" + session.getId());
    }

    public void broadcast(String jsonPayload) {
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(jsonPayload));
                } catch (IOException e) {
                    System.err.println("WebSocket broadcast error: " + e.getMessage());
                }
            }
        }
    }
}
