package com.reusehub.marketplace.repository;

import com.reusehub.marketplace.entity.PurchaseRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PurchaseRequestRepository extends JpaRepository<PurchaseRequest, Long> {
    List<PurchaseRequest> findByBuyerId(Long buyerId);
    List<PurchaseRequest> findBySellerId(Long sellerId);
    List<PurchaseRequest> findByProductId(Long productId);
}
