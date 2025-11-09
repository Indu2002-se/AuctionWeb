package org.buddhi.auction.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessagePayload {
    private String type;
    private Long itemId;
    private Long bidId;
    private String username;
    private BigDecimal amount;
    private LocalDateTime timestamp;
    private String message;
}