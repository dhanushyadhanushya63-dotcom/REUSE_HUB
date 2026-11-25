package com.reusehub.marketplace.repository;

import com.reusehub.marketplace.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByStatus(Report.ReportStatus status);
}
