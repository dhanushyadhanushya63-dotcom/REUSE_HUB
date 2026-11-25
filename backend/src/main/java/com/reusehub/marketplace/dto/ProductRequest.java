package com.reusehub.marketplace.dto;

import java.math.BigDecimal;

public class ProductRequest {
    private String title;
    private Long categoryId;
    private String description;
    private BigDecimal price;
    private Boolean isDonation = false;
    private String conditionType = "GOOD";
    private String state = "Tamil Nadu";
    private String city = "Chennai";
    private String area;
    private String pickupLocation;
    private String primaryImageUrl;

    public ProductRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Boolean getIsDonation() { return isDonation; }
    public void setIsDonation(Boolean isDonation) { this.isDonation = isDonation; }

    public String getConditionType() { return conditionType; }
    public void setConditionType(String conditionType) { this.conditionType = conditionType; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getPrimaryImageUrl() { return primaryImageUrl; }
    public void setPrimaryImageUrl(String primaryImageUrl) { this.primaryImageUrl = primaryImageUrl; }
}
