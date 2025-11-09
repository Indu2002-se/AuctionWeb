package org.buddhi.auction.service;

import lombok.RequiredArgsConstructor;
import org.buddhi.auction.controller.WebSocketController;
import org.buddhi.auction.dto.BidRequest;
import org.buddhi.auction.dto.BidResponse;
import org.buddhi.auction.model.Bid;
import org.buddhi.auction.model.Item;
import org.buddhi.auction.model.User;
import org.buddhi.auction.repository.BidRepository;
import org.buddhi.auction.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;
    private final ItemRepository itemRepository;
    private final WebSocketController webSocketController;

    public List<Bid> getBidsByItemId(Long itemId) {
        return bidRepository.findByItemIdOrderByTimestampDesc(itemId);
    }

    @Transactional(readOnly = true)
    public List<BidResponse> getBidsByItemIdAsDto(Long itemId) {
        List<Bid> bids = bidRepository.findByItemIdOrderByTimestampDesc(itemId);
        return bids.stream()
                .map(BidResponse::fromBid)
                .collect(Collectors.toList());
    }

    public List<Bid> getBidsByUserId(Long userId) {
        return bidRepository.findByBidderIdOrderByTimestampDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<BidResponse> getBidsByUserIdAsDto(Long userId) {
        List<Bid> bids = bidRepository.findByBidderIdOrderByTimestampDesc(userId);
        return bids.stream()
                .map(BidResponse::fromBid)
                .collect(Collectors.toList());
    }

    @Transactional
    public Bid placeBid(BidRequest request, User bidder) {
        // Only bidders can place bids
        if (bidder.getRole() != User.Role.BIDDER) {
            throw new RuntimeException("Only bidders can place bids");
        }

        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Sellers cannot bid on their own items
        if (item.getSeller().getId().equals(bidder.getId())) {
            throw new RuntimeException("Sellers cannot bid on their own items");
        }

        // Validate auction status
        if (item.getStatus() != Item.AuctionStatus.ACTIVE) {
            throw new RuntimeException("Auction is not active");
        }

        // Validate auction time
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(item.getStartTime()) || now.isAfter(item.getEndTime())) {
            throw new RuntimeException("Auction is not within the bidding period");
        }

        // Validate bid amount
        if (request.getAmount().compareTo(item.getCurrentPrice()) <= 0) {
            throw new RuntimeException("Bid amount must be higher than current price");
        }

        // Create and save bid
        Bid bid = Bid.builder()
                .item(item)
                .bidder(bidder)
                .amount(request.getAmount())
                .timestamp(now)
                .build();

        bid = bidRepository.save(bid);

        // Update item's current price
        item.setCurrentPrice(request.getAmount());
        itemRepository.save(item);

        // Send WebSocket notification
        BidResponse bidResponse = BidResponse.fromBid(bid);
        webSocketController.broadcastBidUpdate(item.getId(), bidResponse);

        return bid;
    }

    public Bid getHighestBid(Long itemId) {
        return bidRepository.findHighestBidForItem(itemId)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public BidResponse getHighestBidAsDto(Long itemId) {
        Bid bid = bidRepository.findHighestBidForItem(itemId)
                .orElse(null);
        return bid != null ? BidResponse.fromBid(bid) : null;
    }

    public Long getBidCount(Long itemId) {
        return bidRepository.countBidsByItemId(itemId);
    }
}