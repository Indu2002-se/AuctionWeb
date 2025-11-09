package org.buddhi.auction.controller;

import lombok.RequiredArgsConstructor;
import org.buddhi.auction.dto.BidResponse;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/auction/{itemId}/join")
    public void joinAuction(@DestinationVariable Long itemId) {
        // Handle user joining auction room
        System.out.println("User joined auction: " + itemId);
    }

    @MessageMapping("/auction/{itemId}/leave")
    public void leaveAuction(@DestinationVariable Long itemId) {
        // Handle user leaving auction room
        System.out.println("User left auction: " + itemId);
    }

    public void broadcastBidUpdate(Long itemId, BidResponse bidResponse) {
        messagingTemplate.convertAndSend("/topic/auction/" + itemId + "/bids", bidResponse);
    }
}