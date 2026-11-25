package com.reusehub.marketplace.controller;

import com.reusehub.marketplace.entity.Product;
import com.reusehub.marketplace.entity.Report;
import com.reusehub.marketplace.entity.User;
import com.reusehub.marketplace.repository.ProductRepository;
import com.reusehub.marketplace.repository.PurchaseRequestRepository;
import com.reusehub.marketplace.repository.ReportRepository;
import com.reusehub.marketplace.repository.UserRepository;
import com.reusehub.marketplace.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PurchaseRequestRepository purchaseRequestRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalDonations = productRepository.findByIsDonationTrueAndStatus(Product.ProductStatus.AVAILABLE).size();
        long totalRequests = purchaseRequestRepository.count();

        stats.put("totalUsers", totalUsers);
        stats.put("totalProducts", totalProducts);
        stats.put("totalDonations", totalDonations);
        stats.put("totalRequests", totalRequests);
        // Sustainability metrics
        stats.put("wasteSavedKg", totalProducts * 4.8);
        stats.put("co2PreventedKg", totalProducts * 12.3);
        stats.put("waterConservedLiters", totalProducts * 1450);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            User updated = userService.updateUserStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getReports() {
        return ResponseEntity.ok(reportRepository.findAll());
    }

    @PatchMapping("/reports/{id}")
    public ResponseEntity<?> updateReportStatus(@PathVariable Long id, @RequestParam String status) {
        return reportRepository.findById(id).map(r -> {
            r.setStatus(Report.ReportStatus.valueOf(status.toUpperCase()));
            reportRepository.save(r);
            Map<String, String> res = new HashMap<>();
            res.put("message", "Report status updated");
            return ResponseEntity.ok(res);
        }).orElse(ResponseEntity.notFound().build());
    }
}
