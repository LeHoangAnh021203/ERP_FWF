package com.example.BasicCRM_FWF.Service.Realtime;

import com.example.BasicCRM_FWF.DTORealTime.*;

import java.util.List;
import java.util.Map;

public interface RealTimeInterface {
    public SalesSummaryDTO getSales(String dateStart, String dateEnd) throws Exception;

    public SalesSummaryDTO getSalesCopied(String dateStart, String dateEnd) throws Exception;

    public String getActualRevenue(String dateStart, String dateEnd) throws Exception;

    public ServiceSummaryDTO getServiceSummary(String dateStart, String dateEnd) throws Exception;

    public List<SalesDetailDTO> getSalesDetail(String dateStart, String dateEnd) throws Exception;

    public BookingDTO getBookings(String dateStart, String dateEnd) throws Exception;

    public List<CustomerDTO> getNewCustomers(String dateStart, String dateEnd) throws Exception;

    public List<CustomerDTO> getOldCustomers(String dateStart, String dateEnd) throws Exception;

    public List<CustomerDTO> getAllBookingByHour(String dateStart, String dateEnd) throws Exception;

    public List<Map<String, Object>> getSalesByHours(String dateStart, String dateEnd) throws Exception;

    public void autoSaveWorkTrack() throws Exception;

//    public List<CustomerDTO> getCustomersByType(String dateStart, String dateEnd, String type) throws Exception;
}
