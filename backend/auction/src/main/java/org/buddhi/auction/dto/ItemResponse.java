package org.buddhi.auction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.buddhi.auction.model.Item;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal startingPrice;
    private BigDecimal currentPrice;
    private String imageUrl;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Item.AuctionStatus status;
    private Long sellerId;
    private String sellerUsername;
    private Long winnerId;
    private String winnerUsername;
    private int bidCount;

    public static ItemResponse fromItem(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .startingPrice(item.getStartingPrice())
                .currentPrice(item.getCurrentPrice())
                .imageUrl(item.getImageUrl())
                .startTime(item.getStartTime())
                .endTime(item.getEndTime())
                .status(item.getStatus())
                .sellerId(item.getSeller() != null ? item.getSeller().getId() : null)
                .sellerUsername(item.getSeller() != null ? item.getSeller().getUsername() : null)
                .winnerId(item.getWinner() != null ? item.getWinner().getId() : null)
                .winnerUsername(item.getWinner() != null ? item.getWinner().getUsername() : null)
                .bidCount(item.getBids() != null ? item.getBids().size() : 0)
                .build();
    }
}