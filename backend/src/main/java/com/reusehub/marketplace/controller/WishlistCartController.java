package com.reusehub.marketplace.controller;

import com.reusehub.marketplace.entity.Cart;
import com.reusehub.marketplace.entity.Product;
import com.reusehub.marketplace.entity.User;
import com.reusehub.marketplace.entity.Wishlist;
import com.reusehub.marketplace.repository.CartRepository;
import com.reusehub.marketplace.repository.ProductRepository;
import com.reusehub.marketplace.repository.UserRepository;
import com.reusehub.marketplace.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class WishlistCartController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // --- Wishlist Endpoints ---

    @GetMapping("/wishlist")
    public ResponseEntity<List<Wishlist>> getWishlist(@RequestParam Long userId) {
        return ResponseEntity.ok(wishlistRepository.findByUserId(userId));
    }

    @PostMapping("/wishlist")
    public ResponseEntity<?> addToWishlist(@RequestParam Long userId, @RequestParam Long productId) {
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            Map<String, String> res = new HashMap<>();
            res.put("message", "Already in wishlist");
            return ResponseEntity.ok(res);
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

        Wishlist w = new Wishlist(user, product);
        wishlistRepository.save(w);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Added to wishlist");
        return ResponseEntity.ok(res);
    }

    @Transactional
    @DeleteMapping("/wishlist")
    public ResponseEntity<?> removeFromWishlist(@RequestParam Long userId, @RequestParam Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Removed from wishlist");
        return ResponseEntity.ok(res);
    }

    // --- Cart Endpoints ---

    @GetMapping("/cart")
    public ResponseEntity<List<Cart>> getCart(@RequestParam Long userId) {
        return ResponseEntity.ok(cartRepository.findByUserId(userId));
    }

    @PostMapping("/cart")
    public ResponseEntity<?> addToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer quantity
    ) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = cartRepository.findByUserIdAndProductId(userId, productId)
                .orElse(new Cart(user, product, 0));
        cart.setQuantity(cart.getQuantity() + quantity);
        cartRepository.save(cart);

        Map<String, String> res = new HashMap<>();
        res.put("message", "Added to cart");
        return ResponseEntity.ok(res);
    }

    @Transactional
    @DeleteMapping("/cart")
    public ResponseEntity<?> removeFromCart(@RequestParam Long userId, @RequestParam Long productId) {
        cartRepository.deleteByUserIdAndProductId(userId, productId);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Removed from cart");
        return ResponseEntity.ok(res);
    }

    @Transactional
    @DeleteMapping("/cart/clear")
    public ResponseEntity<?> clearCart(@RequestParam Long userId) {
        cartRepository.deleteByUserId(userId);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Cart cleared");
        return ResponseEntity.ok(res);
    }
}
