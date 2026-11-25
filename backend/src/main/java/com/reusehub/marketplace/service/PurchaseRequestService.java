package com.reusehub.marketplace.service;

import com.reusehub.marketplace.dto.PurchaseRequestDto;
import com.reusehub.marketplace.entity.Product;
import com.reusehub.marketplace.entity.PurchaseRequest;
import com.reusehub.marketplace.entity.User;
import com.reusehub.marketplace.repository.ProductRepository;
import com.reusehub.marketplace.repository.PurchaseRequestRepository;
import com.reusehub.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseRequestService {

    @Autowired
    private PurchaseRequestRepository purchaseRequestRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public PurchaseRequest createRequest(Long buyerId, PurchaseRequestDto dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        User seller = product.getSeller();

        PurchaseRequest request = new PurchaseRequest();
        request.setProduct(product);
        request.setBuyer(buyer);
        request.setSeller(seller);
        request.setStatus(PurchaseRequest.RequestStatus.PENDING);
        request.setPickupDate(dto.getPickupDate());
        request.setPickupTime(dto.getPickupTime());
        request.setBuyerMessage(dto.getBuyerMessage());

        return purchaseRequestRepository.save(request);
    }

    public List<PurchaseRequest> getRequestsForSeller(Long sellerId) {
        return purchaseRequestRepository.findBySellerId(sellerId);
    }

    public List<PurchaseRequest> getRequestsForBuyer(Long buyerId) {
        return purchaseRequestRepository.findByBuyerId(buyerId);
    }

    public PurchaseRequest updateStatus(Long requestId, Long sellerId, String status, String response) {
        PurchaseRequest req = purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!req.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized: only the seller can respond");
        }

        PurchaseRequest.RequestStatus newStatus = PurchaseRequest.RequestStatus.valueOf(status.toUpperCase());
        req.setStatus(newStatus);
        if (response != null) {
            req.setSellerResponse(response);
        }

        // If accepted, mark product reserved
        if (newStatus == PurchaseRequest.RequestStatus.ACCEPTED) {
            Product p = req.getProduct();
            p.setStatus(Product.ProductStatus.RESERVED);
            productRepository.save(p);
        } else if (newStatus == PurchaseRequest.RequestStatus.COMPLETED) {
            Product p = req.getProduct();
            p.setStatus(p.getIsDonation() ? Product.ProductStatus.DONATED : Product.ProductStatus.SOLD);
            productRepository.save(p);
        }

        return purchaseRequestRepository.save(req);
    }
}
