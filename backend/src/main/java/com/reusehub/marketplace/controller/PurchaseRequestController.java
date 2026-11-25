package com.reusehub.marketplace.controller;

import com.reusehub.marketplace.dto.PurchaseRequestDto;
import com.reusehub.marketplace.entity.PurchaseRequest;
import com.reusehub.marketplace.service.PurchaseRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class PurchaseRequestController {

    @Autowired
    private PurchaseRequestService purchaseRequestService;

    @PostMapping
    public ResponseEntity<?> createRequest(
            @RequestParam Long buyerId,
            @RequestBody PurchaseRequestDto dto
    ) {
        try {
            PurchaseRequest created = purchaseRequestService.createRequest(buyerId, dto);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<PurchaseRequest>> getSellerRequests(@PathVariable Long sellerId) {
        return ResponseEntity.ok(purchaseRequestService.getRequestsForSeller(sellerId));
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<PurchaseRequest>> getBuyerRequests(@PathVariable Long buyerId) {
        return ResponseEntity.ok(purchaseRequestService.getRequestsForBuyer(buyerId));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam Long sellerId,
            @RequestParam String status,
            @RequestParam(required = false) String response
    ) {
        try {
            PurchaseRequest updated = purchaseRequestService.updateStatus(id, sellerId, status, response);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }
}
