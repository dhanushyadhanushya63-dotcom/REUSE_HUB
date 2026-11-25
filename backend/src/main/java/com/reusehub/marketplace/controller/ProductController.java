package com.reusehub.marketplace.controller;

import com.reusehub.marketplace.dto.ProductRequest;
import com.reusehub.marketplace.entity.Product;
import com.reusehub.marketplace.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) Boolean donation,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long sellerId
    ) {
        if (sellerId != null) {
            return ResponseEntity.ok(productService.getProductsBySeller(sellerId));
        }
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(productService.search(search.trim()));
        }
        if (Boolean.TRUE.equals(featured)) {
            return ResponseEntity.ok(productService.getFeaturedProducts());
        }
        if (Boolean.TRUE.equals(donation)) {
            return ResponseEntity.ok(productService.getDonationProducts());
        }
        if (category != null) {
            return ResponseEntity.ok(productService.filterByCategory(category));
        }
        if (city != null || area != null) {
            return ResponseEntity.ok(productService.filterByLocation(city, area));
        }
        return ResponseEntity.ok(productService.getAllAvailableProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createProduct(
            @RequestParam Long sellerId,
            @RequestBody ProductRequest request
    ) {
        try {
            Product created = productService.createProduct(sellerId, request);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam Long sellerId,
            @RequestBody ProductRequest request
    ) {
        try {
            Product updated = productService.updateProduct(id, sellerId, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateProductStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        try {
            productService.updateStatus(id, Product.ProductStatus.valueOf(status.toUpperCase()));
            Map<String, String> res = new HashMap<>();
            res.put("message", "Status updated successfully");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long id,
            @RequestParam Long sellerId
    ) {
        try {
            productService.deleteProduct(id, sellerId);
            Map<String, String> res = new HashMap<>();
            res.put("message", "Product deleted successfully");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "./public/uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String originalName = file.getOriginalFilename();
            String ext = originalName != null && originalName.contains(".") 
                    ? originalName.substring(originalName.lastIndexOf(".")) : ".jpg";
            String newFilename = UUID.randomUUID() + ext;
            Path filePath = Paths.get(uploadDir, newFilename);
            Files.write(filePath, file.getBytes());

            Map<String, String> res = new HashMap<>();
            res.put("imageUrl", "/uploads/" + newFilename);
            return ResponseEntity.ok(res);
        } catch (IOException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Image upload failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(err);
        }
    }
}
