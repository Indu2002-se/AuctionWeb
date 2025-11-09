package org.buddhi.auction.repository;

import org.buddhi.auction.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByItemIdOrderByTimestampDesc(Long itemId);
    List<Bid> findByBidderIdOrderByTimestampDesc(Long bidderId);

    @Query("SELECT b FROM Bid b WHERE b.item.id = :itemId ORDER BY b.amount DESC")
    Optional<Bid> findHighestBidForItem(Long itemId);

    @Query("SELECT COUNT(b) FROM Bid b WHERE b.item.id = :itemId")
    Long countBidsByItemId(Long itemId);
}