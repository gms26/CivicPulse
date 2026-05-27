package com.civicpulse.service;

import com.civicpulse.dto.response.AnalyticsResponse;
import com.civicpulse.entity.enums.IssueCategory;
import com.civicpulse.entity.enums.IssueStatus;
import com.civicpulse.repository.IssueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final IssueRepository issueRepository;

    public AnalyticsService(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    @Transactional(readOnly = true)
    public AnalyticsResponse getSummary() {
        long totalIssues = issueRepository.count();
        long openIssues = issueRepository.countByStatus(IssueStatus.OPEN);
        long inProgressIssues = issueRepository.countByStatus(IssueStatus.IN_PROGRESS);
        long resolvedIssues = issueRepository.countByStatus(IssueStatus.RESOLVED);
        
        double resolutionRate = 0.0;
        if (totalIssues > 0) {
            resolutionRate = ((double) resolvedIssues / totalIssues) * 100.0;
        }

        AnalyticsResponse response = new AnalyticsResponse();
        response.setTotalIssues(totalIssues);
        response.setOpenIssues(openIssues);
        response.setInProgressIssues(inProgressIssues);
        response.setResolvedIssues(resolvedIssues);
        response.setResolutionRate(resolutionRate);

        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getIssuesByCategory() {
        List<Object[]> results = issueRepository.countByCategories();
        Map<String, Long> categoryCounts = new HashMap<>();
        
        for (Object[] result : results) {
            IssueCategory category = (IssueCategory) result[0];
            Long count = ((Number) result[1]).longValue();
            categoryCounts.put(category.name(), count);
        }
        
        return categoryCounts;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getIssuesByStatus() {
        List<Object[]> results = issueRepository.countByStatuses();
        Map<String, Long> statusCounts = new HashMap<>();
        
        for (Object[] result : results) {
            IssueStatus status = (IssueStatus) result[0];
            Long count = ((Number) result[1]).longValue();
            statusCounts.put(status.name(), count);
        }
        
        return statusCounts;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getIssueTrends() {
        List<Object[]> results = issueRepository.countIssuesLast30Days();
        Map<String, Long> trends = new HashMap<>();
        
        for (Object[] result : results) {
            String dateString = result[0].toString();
            Long count = ((Number) result[1]).longValue();
            trends.put(dateString, count);
        }
        
        return trends;
    }
}
