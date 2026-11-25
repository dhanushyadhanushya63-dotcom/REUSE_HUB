package com.reusehub.marketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MarketplaceApplication {
    public static void main(String[] args) {
        SpringApplication.run(MarketplaceApplication.class, args);
        System.out.println("==================================================");
        System.out.println("  ReUseHub Backend Server Started on Port 8080   ");
        System.out.println("  Buy • Sell • Donate - Sustainable Marketplace   ");
        System.out.println("==================================================");
    }
}
