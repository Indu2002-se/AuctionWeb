package org.buddhi.auction.service;

import lombok.RequiredArgsConstructor;
import org.buddhi.auction.dto.ItemResponse;
import org.buddhi.auction.model.Item;
import org.buddhi.auction.model.User;
import org.buddhi.auction.repository.ItemRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;

    public List<Item> getAllItems() {
        try {
            List<Item> items = itemRepository.findAll();
            System.out.println("Found " + items.size() + " items in database");
            return items;
        } catch (Exception e) {
            System.err.println("Error fetching items: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> getAllItemsAsDto() {
        try {
            List<Item> items = itemRepository.findAll();
            System.out.println("Found " + items.size() + " items in database");
            return items.stream()
                    .map(ItemResponse::fromItem)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching items: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public List<Item> getActiveItems() {
        return itemRepository.findByStatus(Item.AuctionStatus.ACTIVE);
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> getActiveItemsAsDto() {
        List<Item> items = itemRepository.findByStatus(Item.AuctionStatus.ACTIVE);
        return items.stream()
                .map(ItemResponse::fromItem)
                .collect(Collectors.toList());
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    @Transactional(readOnly = true)
    public ItemResponse getItemByIdAsDto(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        return ItemResponse.fromItem(item);
    }

    @Transactional
    public Item createItem(Item item, User seller) {
        item.setSeller(seller);
        item.setCurrentPrice(item.getStartingPrice());
        item.setStatus(Item.AuctionStatus.PENDING);
        item.setStartTime(LocalDateTime.now());
        return itemRepository.save(item);
    }

    public List<Item> getItemsBySeller(User seller) {
        return itemRepository.findBySeller(seller);
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> getItemsBySellerAsDto(User seller) {
        List<Item> items = itemRepository.findBySeller(seller);
        return items.stream()
                .map(ItemResponse::fromItem)
                .collect(Collectors.toList());
    }

    @Transactional
    public Item updateItem(Long id, Item itemDetails) {
        Item item = getItemById(id);
        item.setName(itemDetails.getName());
        item.setDescription(itemDetails.getDescription());
        item.setStartingPrice(itemDetails.getStartingPrice());
        item.setImageUrl(itemDetails.getImageUrl());
        item.setStartTime(itemDetails.getStartTime());
        item.setEndTime(itemDetails.getEndTime());
        return itemRepository.save(item);
    }

    @Transactional
    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    @Scheduled(fixedRate = 60000) // Check every minute
    @Transactional
    public void updateAuctionStatuses() {
        LocalDateTime now = LocalDateTime.now();

        // Activate pending auctions
        List<Item> pendingItems = itemRepository.findByStatusAndEndTimeBefore(
                Item.AuctionStatus.PENDING, now);
        pendingItems.forEach(item -> {
            if (item.getStartTime().isBefore(now)) {
                item.setStatus(Item.AuctionStatus.ACTIVE);
                itemRepository.save(item);
            }
        });

        // Close active auctions
        List<Item> activeItems = itemRepository.findByStatusAndEndTimeBefore(
                Item.AuctionStatus.ACTIVE, now);
        activeItems.forEach(item -> {
            item.setStatus(Item.AuctionStatus.CLOSED);
            itemRepository.save(item);
        });
    }
}