package com.reusehub.marketplace.service;

import com.reusehub.marketplace.dto.ProductRequest;
import com.reusehub.marketplace.entity.Category;
import com.reusehub.marketplace.entity.Product;
import com.reusehub.marketplace.entity.User;
import com.reusehub.marketplace.repository.CategoryRepository;
import com.reusehub.marketplace.repository.ProductRepository;
import com.reusehub.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Product> getAllAvailableProducts() {
        return productRepository.findByStatus(Product.ProductStatus.AVAILABLE);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndStatus(Product.ProductStatus.AVAILABLE);
    }

    public List<Product> getDonationProducts() {
        return productRepository.findByIsDonationTrueAndStatus(Product.ProductStatus.AVAILABLE);
    }

    public Optional<Product> getProductById(Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        productOpt.ifPresent(p -> {
            p.setViewCount(p.getViewCount() + 1);
            productRepository.save(p);
        });
        return productOpt;
    }

    public List<Product> getProductsBySeller(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }

    public List<Product> filterByLocation(String city, String area) {
        if (city != null && !city.isEmpty() && area != null && !area.isEmpty()) {
            return productRepository.findByCityIgnoreCaseAndAreaIgnoreCaseAndStatus(city, area, Product.ProductStatus.AVAILABLE);
        } else if (city != null && !city.isEmpty()) {
            return productRepository.findByCityIgnoreCaseAndStatus(city, Product.ProductStatus.AVAILABLE);
        }
        return getAllAvailableProducts();
    }

    public List<Product> filterByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndStatus(categoryId, Product.ProductStatus.AVAILABLE);
    }

    public List<Product> search(String keyword) {
        return productRepository.searchProducts(keyword);
    }

    public Product createProduct(Long sellerId, ProductRequest request) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setSeller(seller);
        product.setCategory(category);
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setIsDonation(request.getIsDonation());
        product.setConditionType(Product.ConditionType.valueOf(request.getConditionType()));
        product.setState(request.getState() != null ? request.getState() : "Tamil Nadu");
        product.setCity(request.getCity());
        product.setArea(request.getArea());
        product.setPickupLocation(request.getPickupLocation());
        product.setPrimaryImageUrl(request.getPrimaryImageUrl());
        product.setStatus(Product.ProductStatus.AVAILABLE);

        return productRepository.save(product);
    }

    public Product updateProduct(Long productId, Long sellerId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized: you do not own this listing");
        }

        if (request.getTitle() != null) product.setTitle(request.getTitle());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getIsDonation() != null) product.setIsDonation(request.getIsDonation());
        if (request.getConditionType() != null) product.setConditionType(Product.ConditionType.valueOf(request.getConditionType()));
        if (request.getCity() != null) product.setCity(request.getCity());
        if (request.getArea() != null) product.setArea(request.getArea());
        if (request.getPickupLocation() != null) product.setPickupLocation(request.getPickupLocation());
        if (request.getPrimaryImageUrl() != null) product.setPrimaryImageUrl(request.getPrimaryImageUrl());

        return productRepository.save(product);
    }

    public void updateStatus(Long productId, Product.ProductStatus status) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStatus(status);
        productRepository.save(product);
    }

    public void deleteProduct(Long productId, Long sellerId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        if (!product.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized: you do not own this listing");
        }
        productRepository.delete(product);
    }
}
