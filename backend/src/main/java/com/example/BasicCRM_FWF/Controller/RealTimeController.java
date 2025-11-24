package com.example.BasicCRM_FWF.Controller;

import com.example.BasicCRM_FWF.DTORealTime.*;
import com.example.BasicCRM_FWF.Service.JWTService;
import com.example.BasicCRM_FWF.Service.Realtime.RealTimeInterface;
import com.example.BasicCRM_FWF.Service.Realtime.RealTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/real-time")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'CEO', 'TEAM_LEAD', 'AREA_MANAGER', 'STORE_LEAD', 'USER')")
public class RealTimeController {

    private final RealTimeInterface salesService;
    private final JWTService jwtService;

    @GetMapping("/sales-summary")
    public SalesSummaryDTO getSalesSummary(
            @RequestParam String dateStart,
            @RequestParam String dateEnd
    ) throws Exception {
        return salesService.getSales(dateStart, dateEnd);
    }

    @GetMapping("/sales-summary-copied")
    public SalesSummaryDTO getSalesSummaryCopied(
            @RequestParam String dateStart,
            @RequestParam String dateEnd
    ) throws Exception {
        return salesService.getSalesCopied(dateStart, dateEnd);
    }

    @GetMapping("/get-actual-revenue")
    public ResponseEntity<String> getActualRevenue(
            @RequestParam String dateStart,
            @RequestParam String dateEnd
    ) throws Exception {
        String actual = salesService.getActualRevenue(dateStart, dateEnd);
        return ResponseEntity.ok(actual);
    }

    @GetMapping("/service-summary")
    public ServiceSummaryDTO getServiceSummary(
            @RequestParam String dateStart,
            @RequestParam String dateEnd
    ) throws Exception {
        return salesService.getServiceSummary(dateStart, dateEnd);
    }

    @GetMapping("/sales-detail")
    public List<SalesDetailDTO> getSalesDetail(
            @RequestParam String dateStart,
            @RequestParam String dateEnd
    ) throws Exception {
        return salesService.getSalesDetail(dateStart, dateEnd);
    }

    @GetMapping("/booking")
    public BookingDTO getBooking(
            @RequestParam String dateStart,
            @RequestParam String dateEnd
    ) throws Exception {
        return salesService.getBookings(dateStart, dateEnd);
    }


    @GetMapping("/get-new-customer")
    public List<CustomerDTO> getNewCustomers(
            @RequestParam String dateStart,
            @RequestParam String dateEnd
    ) throws Exception {
        return salesService.getNewCustomers(dateStart, dateEnd);
    }

    @GetMapping("/get-old-customer")
    public List<CustomerDTO> getOldCustomers(
            @RequestParam String dateStart,
            @RequestParam String dateEnd
    )  throws Exception {
        return salesService.getOldCustomers(dateStart, dateEnd);
    }
//
//    @GetMapping("/by-type")
//    public ResponseEntity<?> getCustomersByType(
//            @RequestParam("start") String startDate,
//            @RequestParam("end") String endDate,
//            @RequestParam("type") String type) {
//
//        try {
//            List<CustomerDTO> result = salesService.getCustomersByType(startDate, endDate, type);
//            return ResponseEntity.ok(result);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Lỗi xử lý: " + e.getMessage());
//        }
//    }

    // Lấy booking theo khung giờ (lọc theo Khách có đến với nguồn Khách mới + Khách cũ)
    @GetMapping("/get-booking-by-hour")
    public List<CustomerDTO> getBookingByHour(
            @RequestParam String dateStart,
            @RequestParam String dateEnd
    )  throws Exception {
        return salesService.getAllBookingByHour(dateStart, dateEnd);
    }

    // Lấy đơn hàng theo khung giờ
    @GetMapping("/get-sales-by-hour")
    public List<Map<String, Object>> getSalesByHour(
            @RequestParam String dateStart,
            @RequestParam String dateEnd
    ) throws Exception {
        return salesService.getSalesByHours(dateStart, dateEnd);
    }

    @GetMapping("/token-expiration")
    public ResponseEntity<?> checkTokenExpiration(@RequestHeader("Authorization") String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Missing or invalid token");
        }
        String token = header.substring(7);
        long remainingMs = jwtService.getTokenRemainingTime(token);
        return ResponseEntity.ok(Map.of(
                "remaining_ms", remainingMs,
                "remaining_minutes", remainingMs / 60000
        ));
    }
}
