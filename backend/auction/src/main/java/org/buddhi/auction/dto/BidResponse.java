package org.buddhi.auction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.buddhi.auction.model.Bid;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidResponse {
    private Long id;
    private Long itemId;
    private String itemName;
    private Long bidderId;
    private String bidderUsername;
    private BigDecimal amount;
    private LocalDateTime timestamp;

    public static BidResponse fromBid(Bid bid) {
        return BidResponse.builder()
                .id(bid.getId())
                .itemId(bid.getItem() != null ? bid.getItem().getId() : null)
                .itemName(bid.getItem() != null ? bid.getItem().getName() : null)
                .bidderId(bid.getBidder() != null ? bid.getBidder().getId() : null)
                .bidderUsername(bid.getBidder() != null ? bid.getBidder().getUsername() : null)
                .amount(bid.getAmount())
                .timestamp(bid.getTimestamp())
                .build();
    }
}