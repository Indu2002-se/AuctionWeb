package org.buddhi.auction.repository;

import org.buddhi.auction.model.Item;
import org.buddhi.auction.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByStatus(Item.AuctionStatus status);
    List<Item> findByStatusAndEndTimeAfter(Item.AuctionStatus status, LocalDateTime time);
    List<Item> findByStatusAndEndTimeBefore(Item.AuctionStatus status, LocalDateTime time);
    List<Item> findBySeller(User seller);
}