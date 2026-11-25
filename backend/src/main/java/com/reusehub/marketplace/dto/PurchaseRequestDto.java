package com.reusehub.marketplace.dto;

import java.time.LocalDate;

public class PurchaseRequestDto {
    private Long productId;
    private Long buyerId;
    private LocalDate pickupDate;
    private String pickupTime;
    private String buyerMessage;
    private String sellerResponse;
    private String status;

    public PurchaseRequestDto() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public LocalDate getPickupDate() { return pickupDate; }
    public void setPickupDate(LocalDate pickupDate) { this.pickupDate = pickupDate; }

    public String getPickupTime() { return pickupTime; }
    public void setPickupTime(String pickupTime) { this.pickupTime = pickupTime; }

    public String getBuyerMessage() { return buyerMessage; }
    public void setBuyerMessage(String buyerMessage) { this.buyerMessage = buyerMessage; }

    public String getSellerResponse() { return sellerResponse; }
    public void setSellerResponse(String sellerResponse) { this.sellerResponse = sellerResponse; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
