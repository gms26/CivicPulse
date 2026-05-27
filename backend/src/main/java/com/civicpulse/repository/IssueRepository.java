package com.civicpulse.repository;

import com.civicpulse.entity.Issue;
import com.civicpulse.entity.enums.IssueCategory;
import com.civicpulse.entity.enums.IssueStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {

    Page<Issue> findByReporterId(Long reporterId, Pageable pageable);

    Page<Issue> findByStatus(IssueStatus status, Pageable pageable);

    Page<Issue> findByCategory(IssueCategory category, Pageable pageable);

    Page<Issue> findByCategoryAndStatus(IssueCategory category, IssueStatus status, Pageable pageable);

    long countByStatus(IssueStatus status);

    long countByCategory(IssueCategory category);

    @Query("SELECT i FROM Issue i WHERE " +
           "(:category IS NULL OR i.category = :category) AND " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', cast(:keyword as string), '%')) " +
           "OR LOWER(i.locationAddress) LIKE LOWER(CONCAT('%', cast(:keyword as string), '%')))")
    Page<Issue> searchIssues(
            @Param("category") IssueCategory category,
            @Param("status") IssueStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query("SELECT i.category, COUNT(i) FROM Issue i GROUP BY i.category")
    List<Object[]> countByCategories();

    @Query("SELECT i.status, COUNT(i) FROM Issue i GROUP BY i.status")
    List<Object[]> countByStatuses();

    @Query(value = "SELECT DATE(created_at) as issue_date, COUNT(*) as issue_count " +
                   "FROM issues " +
                   "WHERE created_at >= CURRENT_DATE - INTERVAL '30 days' " +
                   "GROUP BY DATE(created_at) " +
                   "ORDER BY issue_date", 
           nativeQuery = true)
    List<Object[]> countIssuesLast30Days();
}
