package org.buddhi.auction.websocket;

import lombok.RequiredArgsConstructor;
import org.buddhi.auction.model.Bid;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class AuctionEventHandler {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastBidUpdate(Bid bid) {
        MessagePayload payload = MessagePayload.builder()
                .type("NEW_BID")
                .itemId(bid.getItem().getId())
                .bidId(bid.getId())
                .username(bid.getBidder().getUsername())
                .amount(bid.getAmount())
                .timestamp(bid.getTimestamp())
                .message("New bid placed")
                .build();

        messagingTemplate.convertAndSend("/topic/bids/" + bid.getItem().getId(), payload);
        messagingTemplate.convertAndSend("/topic/auction", payload);
    }

    public void broadcastAuctionEnd(Long itemId, String winnerUsername) {
        MessagePayload payload = MessagePayload.builder()
                .type("AUCTION_END")
                .itemId(itemId)
                .username(winnerUsername)
                .timestamp(LocalDateTime.now())
                .message("Auction has ended")
                .build();

        messagingTemplate.convertAndSend("/topic/auction/" + itemId, payload);
    }

    public void broadcastAuctionStart(Long itemId) {
        MessagePayload payload = MessagePayload.builder()
                .type("AUCTION_START")
                .itemId(itemId)
                .timestamp(LocalDateTime.now())
                .message("Auction has started")
                .build();

        messagingTemplate.convertAndSend("/topic/auction/" + itemId, payload);
    }
}