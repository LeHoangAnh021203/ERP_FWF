package com.example.BasicCRM_FWF.Service.ServiceRecord;

import com.example.BasicCRM_FWF.DTORequest.CustomerReportRequest;
import com.example.BasicCRM_FWF.DTOResponse.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ServiceRecordInterface {
    public void importFromExcelOrigin(MultipartFile file);

    public void importSaleServiceFile(MultipartFile file);

    public List<DailyServiceTypeStatDTO> getServiceTypeBreakdown(CustomerReportRequest request);

    public ServiceSummaryDTO getServiceSummary(CustomerReportRequest request);

    public List<RegionServiceTypeUsageDTO> getServiceUsageByRegion(CustomerReportRequest request);

    public List<ServiceUsageDTO> getServiceUsageByShop(CustomerReportRequest request);

    public List<TopServiceUsage> getTop10ServiceUsage(CustomerReportRequest request);

    public List<TopServiceRevenue> getTop10ServicesByRevenue(CustomerReportRequest request);

    public List<TopServiceRevenue> getBottom3ServiceRevenue(CustomerReportRequest request);

    public List<TopServiceUsage> getBottom3ServicesUsage(CustomerReportRequest request);

    public List<ServiceStatsDTO> getTopServiceTable(CustomerReportRequest request);

}
