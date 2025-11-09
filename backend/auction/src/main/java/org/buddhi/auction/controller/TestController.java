package org.buddhi.auction.controller;

import lombok.RequiredArgsConstructor;
import org.buddhi.auction.dto.ItemResponse;
import org.buddhi.auction.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TestController {

    private final ItemService itemService;

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "message", "Backend is running successfully",
            "timestamp", System.currentTimeMillis()
        ));
    }

    @GetMapping("/items")
    public ResponseEntity<?> testItems() {
        try {
            List<ItemResponse> items = itemService.getAllItemsAsDto();
            return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "count", items.size(),
                "items", items,
                "message", "Items fetched successfully using DTO"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "status", "ERROR",
                "error", e.getMessage(),
                "message", "Failed to fetch items"
            ));
        }
    }

    @GetMapping("/database")
    public ResponseEntity<?> testDatabase() {
        try {
            // Test basic database connectivity
            List<ItemResponse> items = itemService.getAllItemsAsDto();
            return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "database", "Connected",
                "itemCount", items.size(),
                "message", "Database connection successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "status", "ERROR",
                "database", "Failed",
                "error", e.getMessage(),
                "message", "Database connection failed"
            ));
        }
    }
}