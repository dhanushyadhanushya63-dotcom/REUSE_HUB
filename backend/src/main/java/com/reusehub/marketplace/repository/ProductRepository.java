package com.reusehub.marketplace.repository;

import com.reusehub.marketplace.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatus(Product.ProductStatus status);
    List<Product> findByFeaturedTrueAndStatus(Product.ProductStatus status);
    List<Product> findBySellerId(Long sellerId);
    List<Product> findByCategoryIdAndStatus(Long categoryId, Product.ProductStatus status);
    List<Product> findByCityIgnoreCaseAndStatus(String city, Product.ProductStatus status);
    List<Product> findByCityIgnoreCaseAndAreaIgnoreCaseAndStatus(String city, String area, Product.ProductStatus status);
    List<Product> findByIsDonationTrueAndStatus(Product.ProductStatus status);

    @Query("SELECT p FROM Product p WHERE p.status = 'AVAILABLE' AND (" +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.area) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> searchProducts(@Param("keyword") String keyword);
}
