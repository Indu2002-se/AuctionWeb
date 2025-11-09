package org.buddhi.auction.config;

import lombok.RequiredArgsConstructor;
import org.buddhi.auction.model.Item;
import org.buddhi.auction.model.User;
import org.buddhi.auction.repository.ItemRepository;
import org.buddhi.auction.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create sample users if they don't exist
        if (userRepository.count() == 0) {
            // Create a sample seller
            User seller = User.builder()
                    .username("seller1")
                    .email("seller@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.SELLER)
                    .build();
            userRepository.save(seller);

            // Create a sample bidder
            User bidder = User.builder()
                    .username("bidder1")
                    .email("bidder@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.BIDDER)
                    .build();
            userRepository.save(bidder);

            // Create sample auction items
            Item item1 = Item.builder()
                    .name("Vintage Watch")
                    .description("Beautiful antique pocket watch from the 1920s")
                    .startingPrice(new BigDecimal("100.00"))
                    .currentPrice(new BigDecimal("100.00"))
                    .imageUrl("https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop")
                    .startTime(LocalDateTime.now())
                    .endTime(LocalDateTime.now().plusDays(3))
                    .status(Item.AuctionStatus.ACTIVE)
                    .seller(seller)
                    .build();
            itemRepository.save(item1);

            Item item2 = Item.builder()
                    .name("Oil Painting")
                    .description("Original landscape oil painting by local artist")
                    .startingPrice(new BigDecimal("250.00"))
                    .currentPrice(new BigDecimal("250.00"))
                    .imageUrl("https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop")
                    .startTime(LocalDateTime.now())
                    .endTime(LocalDateTime.now().plusDays(5))
                    .status(Item.AuctionStatus.ACTIVE)
                    .seller(seller)
                    .build();
            itemRepository.save(item2);

            Item item3 = Item.builder()
                    .name("Rare Book Collection")
                    .description("First edition books from the 19th century")
                    .startingPrice(new BigDecimal("500.00"))
                    .currentPrice(new BigDecimal("500.00"))
                    .imageUrl("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop")
                    .startTime(LocalDateTime.now())
                    .endTime(LocalDateTime.now().plusDays(7))
                    .status(Item.AuctionStatus.ACTIVE)
                    .seller(seller)
                    .build();
            itemRepository.save(item3);

            System.out.println("Sample data loaded successfully!");
            System.out.println("Seller credentials: seller1 / password123");
            System.out.println("Bidder credentials: bidder1 / password123");
        }
    }
}