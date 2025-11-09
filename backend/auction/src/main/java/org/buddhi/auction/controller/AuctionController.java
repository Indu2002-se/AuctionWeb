package org.buddhi.auction.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.buddhi.auction.dto.BidRequest;
import org.buddhi.auction.dto.BidResponse;
import org.buddhi.auction.dto.CreateItemRequest;
import org.buddhi.auction.dto.ItemResponse;
import org.buddhi.auction.model.Bid;
import org.buddhi.auction.model.Item;
import org.buddhi.auction.model.User;
import org.buddhi.auction.service.BidService;
import org.buddhi.auction.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuctionController {

    private final ItemService itemService;
    private final BidService bidService;

    // Test endpoint to verify backend is working
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is working!");
    }

    // Debug endpoint to check items
    @GetMapping("/debug/items")
    public ResponseEntity<?> debugItems() {
        try {
            List<ItemResponse> items = itemService.getAllItemsAsDto();
            return ResponseEntity.ok(Map.of(
                "count", items.size(),
                "items", items,
                "message", "Items fetched successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "error", e.getMessage(),
                "message", "Error fetching items"
            ));
        }
    }

    // Item endpoints
    @GetMapping("/items/all")
    public ResponseEntity<?> getAllItems() {
        try {
            List<ItemResponse> items = itemService.getAllItemsAsDto();
            System.out.println("API returning " + items.size() + " items");
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            System.err.println("Error in getAllItems API: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching items: " + e.getMessage());
        }
    }

    @GetMapping("/items/active")
    public ResponseEntity<List<ItemResponse>> getActiveItems() {
        return ResponseEntity.ok(itemService.getActiveItemsAsDto());
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        try {
            ItemResponse item = itemService.getItemByIdAsDto(id);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/items")
    public ResponseEntity<?> createItem(
            @Valid @RequestBody CreateItemRequest request,
            @AuthenticationPrincipal User user) {
        try {
            // Only sellers can create items
            if (user.getRole() != User.Role.SELLER) {
                return ResponseEntity.status(403).body("Only sellers can create items");
            }
            
            Item item = Item.builder()
                    .name(request.getName())
                    .description(request.getDescription())
                    .startingPrice(request.getStartingPrice())
                    .imageUrl(request.getImageUrl())
                    .endTime(request.getEndTime())
                    .build();
                    
            Item createdItem = itemService.createItem(item, user);
            ItemResponse response = ItemResponse.fromItem(createdItem);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error creating item: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/items/my-items")
    public ResponseEntity<?> getMyItems(@AuthenticationPrincipal User user) {
        try {
            // Only sellers can view their items
            if (user.getRole() != User.Role.SELLER) {
                return ResponseEntity.status(403).body("Only sellers can view their items");
            }
            List<ItemResponse> items = itemService.getItemsBySellerAsDto(user);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            System.err.println("Error fetching my items: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Long id, @RequestBody Item item) {
        try {
            return ResponseEntity.ok(itemService.updateItem(id, item));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.ok().build();
    }

    // Bid endpoints
    @PostMapping("/bids")
    public ResponseEntity<?> placeBid(
            @Valid @RequestBody BidRequest request,
            @AuthenticationPrincipal User user) {
        try {
            System.out.println("Placing bid - User: " + (user != null ? user.getUsername() : "null"));
            System.out.println("Bid request: " + request);
            
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
            }
            
            Bid bid = bidService.placeBid(request, user);
            BidResponse response = BidResponse.fromBid(bid);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error placing bid: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/bids/item/{itemId}")
    public ResponseEntity<?> getBidsByItem(@PathVariable Long itemId) {
        try {
            List<BidResponse> bids = bidService.getBidsByItemIdAsDto(itemId);
            return ResponseEntity.ok(bids);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/bids/my-bids")
    public ResponseEntity<?> getMyBids(@AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
            }
            List<BidResponse> bids = bidService.getBidsByUserIdAsDto(user.getId());
            return ResponseEntity.ok(bids);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/bids/highest/{itemId}")
    public ResponseEntity<?> getHighestBid(@PathVariable Long itemId) {
        try {
            BidResponse bid = bidService.getHighestBidAsDto(itemId);
            if (bid != null) {
                return ResponseEntity.ok(bid);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/bids/count/{itemId}")
    public ResponseEntity<Long> getBidCount(@PathVariable Long itemId) {
        return ResponseEntity.ok(bidService.getBidCount(itemId));
    }
}