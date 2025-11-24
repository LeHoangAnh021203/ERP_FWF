package com.example.BasicCRM_FWF.Service.Realtime;

import com.example.BasicCRM_FWF.DTORealTime.*;
import com.example.BasicCRM_FWF.Model.Shift;
import com.example.BasicCRM_FWF.Repository.ShiftRepository;
import com.example.BasicCRM_FWF.Service.AuthRealTime.AuthService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class RealTimeService implements RealTimeInterface {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final AuthService authService;
    private final ShiftRepository shiftRepository;

    @Value("${application.stock.id}")
    private String stockId;

    // Hàm gọi API doanh số
    @Override
    public SalesSummaryDTO getSales(String dateStart, String dateEnd) throws Exception {
        String token = authService.getToken(); // login -> lấy token real-time, chỉ login lại khi token hết hạn
        String url = "https://app.facewashfox.com/api/v3/r23/ban-hang/doanh-so-danh-sach";

        // Body request
        Map<String, Object> payload = new HashMap<>();
        payload.put("StockID", "");
        payload.put("DateStart", dateStart);
        payload.put("DateEnd", dateEnd);
        payload.put("Pi", 1);
        payload.put("Ps", 1000);
        payload.put("Voucher", "");
        payload.put("Payment", "");
        payload.put("IsMember", "");
        payload.put("MemberID", "");
        payload.put("SourceName", "");
        payload.put("ShipCode", "");
        payload.put("ShowsX", "2");
        payload.put("DebtFrom", null);
        payload.put("DebtTo", null);
        payload.put("no", "");

        // Headers API
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Authorization", "Bearer " + token);
        headers.set("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X)");
        headers.set("Referer", "https://app.facewashfox.com/ban-hang/doanh-so");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            JsonNode result = objectMapper.readTree(response.getBody()).path("result");

            SalesSummaryDTO dto = new SalesSummaryDTO();
            dto.setTotalRevenue(result.path("TotalValue").decimalValue().toPlainString());
            dto.setToPay(result.path("ToPay").decimalValue().toPlainString());
            dto.setActualRevenue(result.path("DaThToan").decimalValue().toPlainString());
            dto.setCash(result.path("DaThToan_TM").decimalValue().toPlainString());
            dto.setTransfer(result.path("DaThToan_CK").decimalValue().toPlainString());
            dto.setCard(result.path("DaThToan_QT").decimalValue().toPlainString());
            dto.setWalletUsageRevenue(result.path("DaThToan_Vi").decimalValue().toPlainString());
            dto.setFoxieUsageRevenue(result.path("DaThToan_ThTien").decimalValue().toPlainString());
            dto.setDebt(result.path("ConNo").decimalValue().toPlainString());

            return dto;
        } else {
            throw new RuntimeException("API error: " + response.getStatusCode());
        }
    }

    @Override
    public SalesSummaryDTO getSalesCopied(String dateStart, String dateEnd) throws Exception {
        String token = authService.getToken(); // login -> lấy token real-time, chỉ login lại khi token hết hạn
        String url = "https://app.facewashfox.com/api/v3/r23/ban-hang/doanh-so-danh-sach";

        // Body request
        Map<String, Object> payload = new HashMap<>();
        payload.put("StockID", "");
        payload.put("DateStart", dateStart);
        payload.put("DateEnd", dateEnd);
        payload.put("Pi", 1);
        payload.put("Ps", 1000);
        payload.put("Voucher", "");
        payload.put("Payment", "");
        payload.put("IsMember", "");
        payload.put("MemberID", "");
        payload.put("SourceName", "");
        payload.put("ShipCode", "");
        payload.put("ShowsX", "2");
        payload.put("DebtFrom", null);
        payload.put("DebtTo", null);
        payload.put("no", "");

        // Headers API
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Authorization", "Bearer " + token);
        headers.set("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X)");
        headers.set("Referer", "https://app.facewashfox.com/ban-hang/doanh-so");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            JsonNode result = objectMapper.readTree(response.getBody()).path("result");

            SalesSummaryDTO dto = new SalesSummaryDTO();
            dto.setTotalRevenue(result.path("TotalValue").decimalValue().toPlainString());
            dto.setToPay(result.path("ToPay").decimalValue().toPlainString());
            dto.setActualRevenue(result.path("DaThToan").decimalValue().toPlainString());
            dto.setCash(result.path("DaThToan_TM").decimalValue().toPlainString());
            dto.setTransfer(result.path("DaThToan_CK").decimalValue().toPlainString());
            dto.setCard(result.path("DaThToan_QT").decimalValue().toPlainString());
            dto.setWalletUsageRevenue(result.path("DaThToan_Vi").decimalValue().toPlainString());
            dto.setFoxieUsageRevenue(result.path("DaThToan_ThTien").decimalValue().toPlainString());
            dto.setDebt(result.path("ConNo").decimalValue().toPlainString());

            return dto;
        } else {
            throw new RuntimeException("API error: " + response.getStatusCode());
        }
    }

    @Override
    public String getActualRevenue(String dateStart, String dateEnd) throws Exception {
        String token = authService.getToken();
        String url = "https://app.facewashfox.com/api/v3/r23/ban-hang/doanh-so-danh-sach";

        // Body request
        Map<String, Object> payload = new HashMap<>();
        payload.put("StockID", "");
        payload.put("DateStart", dateStart);
        payload.put("DateEnd", dateEnd);
        payload.put("Pi", 1);
        payload.put("Ps", 1000);
        payload.put("Voucher", "");
        payload.put("Payment", "");
        payload.put("IsMember", "");
        payload.put("MemberID", "");
        payload.put("SourceName", "");
        payload.put("ShipCode", "");
        payload.put("ShowsX", "2");
        payload.put("DebtFrom", null);
        payload.put("DebtTo", null);
        payload.put("no", "");

        // Headers API
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Authorization", "Bearer " + token);
        headers.set("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X)");
        headers.set("Referer", "https://app.facewashfox.com/ban-hang/doanh-so");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            JsonNode result = objectMapper.readTree(response.getBody()).path("result");
            return result.path("DaThToan").decimalValue().toPlainString();
        } else {
            throw new RuntimeException("API error: " + response.getStatusCode());
        }
    }

    @Override
    public ServiceSummaryDTO getServiceSummary(String dateStart, String dateEnd) throws Exception {
        String token = authService.getToken();
        String url = "https://app.facewashfox.com/api/v3/r23/dich-vu/tong-quan";

        Map<String, Object> payload = new HashMap<>();
        payload.put("StockID", "");
        payload.put("DateStart", dateStart);
        payload.put("DateEnd", dateEnd);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Authorization", "Bearer " + token);
        headers.set("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X)");
        headers.set("Referer", "https://app.facewashfox.com/dich-vu/tong-quan");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            JsonNode result = objectMapper.readTree(response.getBody()).path("result");

            ServiceSummaryDTO dto = new ServiceSummaryDTO();
            dto.setTotalServices(String.valueOf(result.path("TotalCasesInDay")));
            dto.setTotalServicesServing(String.valueOf(result.path("DoingCases")));
            dto.setTotalServiceDone(String.valueOf(result.path("DoneCases")));

            List<ServiceItems> items = new ArrayList<>();
            for (JsonNode itemNode : result.path("Items")){
                ServiceItems item = new ServiceItems();
                item.setServiceName(itemNode.path("ProServiceName").asText());
                item.setServiceUsageAmount(String.valueOf(itemNode.path("CasesNum").asInt()));
                item.setServiceUsagePercentage(String.valueOf(itemNode.path("CasesPercent").asDouble()));

                items.add(item);
            }
            dto.setItems(items);

            return dto;
        } else {
            throw new RuntimeException("API Error: " + response.getStatusCode());
        }
    }

    @Override
    public List<SalesDetailDTO> getSalesDetail(String dateStart, String dateEnd) throws Exception {
        String token = authService.getToken();

        String url = "https://app.facewashfox.com/api/v3/r23/ban-hang/doanh-so-chi-tiet";

        Map<String, Object> payload = new HashMap<>();
        payload.put("DateStart", dateStart);
        payload.put("DateEnd", dateEnd);
        payload.put("BrandIds", "");
        payload.put("CategoriesIds", "");
        payload.put("ProductIds", "");
        payload.put("TimeToReal", 1);
        payload.put("ShowsType", "1");
        payload.put("StockRoles", stockId);
        payload.put("Pi", 1);
        payload.put("Voucher", "");
        payload.put("Payment", "");
        payload.put("IsMember", "");

        // Headers API
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Authorization", "Bearer " + token);
        headers.set("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X)");
        headers.set("Referer", "https://app.facewashfox.com/ban-hang/doanh-so");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            JsonNode result = objectMapper.readTree(response.getBody()).path("result");

            List<SalesDetailDTO> details = new ArrayList<>();

            if (result.isArray()) {
                for (JsonNode item : result) {
                    SalesDetailDTO dto = new SalesDetailDTO();
                    dto.setProductName(item.path("ProdTitle").asText());
                    dto.setProductPrice(item.path("SumTopay").decimalValue().toPlainString());
                    dto.setProductQuantity(item.path("SumQTy").decimalValue().toPlainString());
                    dto.setProductDiscount(item.path("Giamgia").decimalValue().toPlainString());
                    dto.setProductCode(item.path("DynamicID").asText());
                    dto.setProductUnit(item.path("StockUnit").asText());
                    dto.setFormatTable(item.path("Format").asText());

                    // doanh thu theo phương thức thanh toán
                    dto.setCash(item.path("TM").decimalValue().toPlainString());
                    dto.setTransfer(item.path("CK").decimalValue().toPlainString());
                    dto.setCard(item.path("QT").decimalValue().toPlainString());
                    dto.setWallet(item.path("Vi").decimalValue().toPlainString());
                    dto.setFoxie(item.path("TT").decimalValue().toPlainString());

                    details.add(dto);
                }
            }

            return details;
        } else {
            throw new RuntimeException("API lỗi: " + response.getStatusCode());
        }
    }

    @Override
    public BookingDTO getBookings(String dateStart, String dateEnd) throws Exception {
        String token = authService.getToken();
        String url = "https://app.facewashfox.com/api/v3/r23/dich-vu/bao-cao-dat-lich";

        Map<String, Object> payload = new HashMap<>();
        payload.put("StockID", "");
        payload.put("DateStart", dateStart);
        payload.put("DateEnd", dateEnd);
        payload.put("Pi", 1);
        payload.put("Ps", 1000);
        payload.put("StatusMember", "");
        payload.put("StatusBook", "");
        payload.put("StatusAtHome", "");
        payload.put("MemberID", "");
        payload.put("UserID", "");
        payload.put("UserServiceIDs", "");
        payload.put("include", "IsNewMember,OrderInDate");
        payload.put("StocksRoles", stockId);
        payload.put("Status", "XAC_NHAN,XAC_NHAN_TU_DONG,CHUA_XAC_NHAN,KHACH_KHONG_DEN,KHACH_DEN,TU_CHOI");

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Authorization", "Bearer " + token);
        headers.set("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X)");
        headers.set("Referer", "https://app.facewashfox.com/ban-hang/doanh-so");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            JsonNode root = objectMapper.readTree(response.getBody()).path("result");
            JsonNode sumNode = root.path("Sum");

            BookingDTO dto = new BookingDTO();
            dto.setNotConfirmed(sumNode.path("CHUA_XAC_NHAN").asText("0"));
            dto.setConfirmed(sumNode.path("XAC_NHAN").asText("0"));
            dto.setDenied(sumNode.path("TU_CHOI").asText("0"));
            dto.setCustomerCome(sumNode.path("KHACH_DEN").asText("0"));
            dto.setCustomerNotCome(sumNode.path("KHACH_KHONG_DEN").asText("0"));
            dto.setCancel(sumNode.path("KHACH_HUY").asText("0"));
            dto.setAutoConfirmed(sumNode.path("XAC_NHAN_TU_DONG").asText("0"));

            return dto;
        }

        throw new RuntimeException("API call failed with status: " + response.getStatusCode());
    }

    @Override
    public List<CustomerDTO> getNewCustomers(String dateStart, String dateEnd) throws Exception {
        String token = authService.getToken();
        String url = "https://app.facewashfox.com/api/v3/r23/dich-vu/bao-cao-dat-lich";

        // Payload dùng format khách mới
        Map<String, Object> payload = new HashMap<>();
        payload.put("StockID", "");
        payload.put("DateStart", dateStart);
        payload.put("DateEnd", dateEnd);
        payload.put("Pi", 1);
        payload.put("Ps", 1000);
        payload.put("StatusMember", "KHACH_MOI");
        payload.put("StatusBook", "");
        payload.put("StatusAtHome", "");
        payload.put("MemberID", "");
        payload.put("UserID", "");
        payload.put("UserServiceIDs", "");
        payload.put("include", "IsNewMember,OrderInDate");
        payload.put("StocksRoles", stockId);
        payload.put("Status", "KHACH_DEN");

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Authorization", "Bearer " + token);
        headers.set("User-Agent", "Mozilla/5.0");
        headers.set("Referer", "https://app.facewashfox.com/");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode() != HttpStatus.OK) {
            throw new RuntimeException("API call failed: " + response.getStatusCode());
        }

        JsonNode root = objectMapper.readTree(response.getBody()).path("result");
        JsonNode items = root.path("Items");  // 🔥 JSON mới dùng Items, KHÔNG còn Members!

        Map<String, Integer> sourceCountMap = new HashMap<>();
        Set<Integer> uniqueMemberIds = new HashSet<>();

        if (items.isArray()) {
            for (JsonNode item : items) {

                int memberId = item.path("MemberID").asInt();

                // Lọc trùng MemberID
                if (!uniqueMemberIds.add(memberId)) {
                    continue;
                }

                // Lấy source chuẩn
                String source = item.path("Member").path("Source").asText("");

                if (source == null || source.trim().isEmpty() || source.equalsIgnoreCase("app")) {

                    // fallback sang Desc -> Tags:
                    String desc = item.path("Desc").asText("");
                    if (desc.contains("Tags:")) {
                        source = desc.split("Tags:")[1].trim();
                        if (source.contains("\n")) {
                            source = source.split("\n")[0].trim();
                        }
                    } else {
                        source = "Không xác định";
                    }
                }

                sourceCountMap.put(source, sourceCountMap.getOrDefault(source, 0) + 1);
            }
        }

        // Convert DTO
        List<CustomerDTO> results = new ArrayList<>();
        for (Map.Entry<String, Integer> e : sourceCountMap.entrySet()) {
            CustomerDTO dto = new CustomerDTO();
            dto.setType(e.getKey());
            dto.setCount(e.getValue());
            results.add(dto);
        }

        return results;
    }

    @Override
    public List<CustomerDTO> getOldCustomers(String dateStart, String dateEnd) throws Exception {
        String token = authService.getToken();
        String url = "https://app.facewashfox.com/api/v3/r23/dich-vu/bao-cao-dat-lich";

        // Payload cho khách cũ
        Map<String, Object> payload = new HashMap<>();
        payload.put("StockID", "");
        payload.put("DateStart", dateStart);
        payload.put("DateEnd", dateEnd);
        payload.put("Pi", 1);
        payload.put("Ps", 1000);
        payload.put("StatusMember", "KHACH_CU");
        payload.put("StatusBook", "");
        payload.put("StatusAtHome", "");
        payload.put("MemberID", "");
        payload.put("UserID", "");
        payload.put("UserServiceIDs", "");
        payload.put("include", "IsNewMember,OrderInDate");
        payload.put("StocksRoles", stockId);
        payload.put("Status", "KHACH_DEN");

        // Headers API
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Authorization", "Bearer " + token);
        headers.set("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X)");
        headers.set("Referer", "https://app.facewashfox.com/dich-vu/bao-cao-dat-lich");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response =
                restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            JsonNode root = objectMapper.readTree(response.getBody()).path("result");
            JsonNode items = root.path("Items");

            // Nhóm theo tags (Source hoặc Desc -> Tags)
            Map<String, Integer> tagCountMap = new HashMap<>();

            if (items.isArray()) {
                for (JsonNode item : items) {
                    String tag = item.path("Member").path("Source").asText(); // ưu tiên Source
                    if (tag == null || tag.isEmpty()) {
                        // Nếu Source rỗng thì fallback sang Desc -> "Tags: ..."
                        String desc = item.path("Desc").asText();
                        if (desc != null && desc.contains("Tags:")) {
                            tag = desc.split("Tags:")[1].trim();
                            // Cắt bỏ phần sau ký tự xuống dòng nếu có
                            if (tag.contains("\n")) {
                                tag = tag.split("\n")[0].trim();
                            }
                        } else {
                            tag = "app";
                        }
                    }
                    tagCountMap.put(tag, tagCountMap.getOrDefault(tag, 0) + 1);
                }
            }

            // Convert sang DTO
            List<CustomerDTO> results = new ArrayList<>();
            for (Map.Entry<String, Integer> entry : tagCountMap.entrySet()) {
                CustomerDTO dto = new CustomerDTO();
                dto.setType(entry.getKey());
                dto.setCount(entry.getValue());
                results.add(dto);
            }

            return results;
        } else {
            throw new RuntimeException("API call failed with status: " + response.getStatusCode());
        }
    }

    @Override
    public List<CustomerDTO> getAllBookingByHour(String dateStart, String dateEnd) throws Exception {
        String token = authService.getToken();
        String url = "https://app.facewashfox.com/api/v3/r23/dich-vu/bao-cao-dat-lich";

        // Payload: bỏ lọc StatusMember để lấy tất cả khách
        Map<String, Object> payload = new HashMap<>();
        payload.put("StockID", "");
        payload.put("DateStart", dateStart);
        payload.put("DateEnd", dateEnd);
        payload.put("Pi", 1);
        payload.put("Ps", 1000);
        payload.put("StatusMember", ""); // lấy cả khách mới + cũ
        payload.put("StatusBook", "");
        payload.put("StatusAtHome", "");
        payload.put("MemberID", "");
        payload.put("UserID", "");
        payload.put("UserServiceIDs", "");
        payload.put("include", "IsNewMember,OrderInDate");
        payload.put("StocksRoles", stockId);
        payload.put("Status", "KHACH_DEN"); // để trống = tất cả trạng thái

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Authorization", "Bearer " + token);
        headers.set("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X)");
        headers.set("Referer", "https://app.facewashfox.com/dich-vu/bao-cao-dat-lich");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response =
                restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode() != HttpStatus.OK) {
            throw new RuntimeException("API call failed with status: " + response.getStatusCode());
        }

        JsonNode root = objectMapper.readTree(response.getBody()).path("result");
        JsonNode items = root.path("Items");

        // Nhóm theo giờ trong BookDate
        Map<String, Integer> hourCountMap = new TreeMap<>(); // sắp xếp theo giờ

        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        DateTimeFormatter hourFormatter = DateTimeFormatter.ofPattern("HH:00");

        if (items.isArray()) {
            for (JsonNode item : items) {
                String bookDateStr = item.path("BookDate").asText();
                if (bookDateStr == null || bookDateStr.isEmpty()) continue;

                try {
                    LocalDateTime bookDate = LocalDateTime.parse(bookDateStr, inputFormatter);
                    String hourLabel = bookDate.format(hourFormatter); // ví dụ: "09:00", "14:00"
                    hourCountMap.put(hourLabel, hourCountMap.getOrDefault(hourLabel, 0) + 1);
                } catch (Exception e) {
                    // Bỏ qua lỗi parse nếu có
                }
            }
        }

        // Convert sang DTO
        List<CustomerDTO> results = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : hourCountMap.entrySet()) {
            CustomerDTO dto = new CustomerDTO();
            dto.setType(entry.getKey());   // dùng 'type' để lưu giờ
            dto.setCount(entry.getValue());
            results.add(dto);
        }

        return results;
    }

    @Override
    public List<Map<String, Object>> getSalesByHours(String dateStart, String dateEnd) throws Exception {
        String token = authService.getToken();
        String url = "https://app.facewashfox.com/api/v3/r23/ban-hang/doanh-so-danh-sach";

        Map<String, Object> payload = new HashMap<>();
        payload.put("StockID", "");
        payload.put("DateStart", dateStart);
        payload.put("DateEnd", dateEnd);
        payload.put("Pi", 1);
        payload.put("Ps", 1000);
        payload.put("Voucher", "");
        payload.put("Payment", "");
        payload.put("IsMember", "");
        payload.put("MemberID", "");
        payload.put("SourceName", "");
        payload.put("ShipCode", "");
        payload.put("ShowsX", "2");
        payload.put("DebtFrom", null);
        payload.put("DebtTo", null);
        payload.put("no", "");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Authorization", "Bearer " + token);
        headers.set("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X)");
        headers.set("Referer", "https://app.facewashfox.com/ban-hang/doanh-so");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode() != HttpStatus.OK) {
            throw new RuntimeException("API call failed: " + response.getStatusCode());
        }

        JsonNode items = objectMapper.readTree(response.getBody())
                .path("result")
                .path("Items");

        Map<String, Map<String, Integer>> groupedData = new TreeMap<>();

        DateTimeFormatter dateTimeFmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        DateTimeFormatter dayFmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (JsonNode item : items) {
            String createDateStr = item.path("CreateDate").asText(null);
            if (createDateStr == null || createDateStr.isEmpty()) continue;

            LocalDateTime createDate = LocalDateTime.parse(createDateStr, dateTimeFmt);
            int hour = createDate.getHour();
            if (hour < 9 || hour > 22) continue; // ❌ Skip ngoài khung 9:00 - 23:59

            String day = createDate.format(dayFmt);
            String timeRange = getTimeRange(createDate);

            groupedData
                    .computeIfAbsent(day, k -> new TreeMap<>())
                    .merge(timeRange, 1, Integer::sum);
        }

        List<Map<String, Object>> responseList = new ArrayList<>();
        for (Map.Entry<String, Map<String, Integer>> dayEntry : groupedData.entrySet()) {
            String day = dayEntry.getKey();
            for (Map.Entry<String, Integer> timeEntry : dayEntry.getValue().entrySet()) {
                Map<String, Object> obj = new HashMap<>();
                obj.put("date", day);
                obj.put("timeRange", timeEntry.getKey());
                obj.put("totalSales", timeEntry.getValue());
                responseList.add(obj);
            }
        }

        return responseList;
    }

    /**
     * ✅ Trả về 14 khung giờ từ 09:00 - 23:59, mỗi khung 1 tiếng
     */
    private static String getTimeRange(LocalDateTime createDate) {
        int hour = createDate.getHour();

        switch (hour) {
            case 9:  return "09:00 - 09:59";
            case 10: return "10:00 - 10:59";
            case 11: return "11:00 - 11:59";
            case 12: return "12:00 - 12:59";
            case 13: return "13:00 - 13:59";
            case 14: return "14:00 - 14:59";
            case 15: return "15:00 - 15:59";
            case 16: return "16:00 - 16:59";
            case 17: return "17:00 - 17:59";
            case 18: return "18:00 - 18:59";
            case 19: return "19:00 - 19:59";
            case 20: return "20:00 - 20:59";
            case 21: return "21:00 - 21:59";
            case 22: return "22:00 - 22:59";
            default: return null;
        }
    }

    @Override
    @Scheduled(cron = "0 0 1 * * *")
    public void autoSaveWorkTrack() throws Exception {
        String token = authService.getToken();
        String url = "https://app.facewashfox.com/api/v3/userwork23@workList";

        LocalDateTime pastDay = LocalDateTime.now().minusDays(1);
        String dateStart = pastDay.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        String endDate = dateStart;

        Map<String, Object> payload = new HashMap<>();
        payload.put("From", dateStart);
        payload.put("To", endDate);
        payload.put("key", "");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Authorization", "Bearer " + token);
        headers.set("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X)");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode() != HttpStatus.OK) {
            throw new RuntimeException("API call failed: " + response.getStatusCode());
        }

        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode items = root.path("list");
        if (items.isArray()) {
            for (JsonNode item : items) {
                String userId = item.path("UserID").asText();  // ✅ đúng key
                String fullname = item.path("FullName").asText();
                String username = item.path("UserName").asText();
                String stockId = item.path("StockID").asText();
                String stockTitle = item.path("StockTitle").asText();

                JsonNode dates = item.path("Dates");
                if (dates.isArray()) {
                    for (JsonNode dateNode : dates) {
                        String date = dateNode.path("Date").asText();
                        JsonNode workTrack = dateNode.path("WorkTrack");

                        // ✅ Kiểm tra null
                        if (workTrack.isMissingNode() || workTrack.isNull()) continue;

                        String checkIn = workTrack.path("CheckIn").asText();
                        String checkOut = workTrack.path("CheckOut").asText();

                        JsonNode info = workTrack.path("Info");
                        double diSom = 0, diMuon = 0, veSom = 0, veMuon = 0;

                        if (info.has("DI_MUON")) {
                            diMuon = 0 - Math.abs(info.path("DI_MUON").path("Value").asDouble(0)); // luôn âm
                        }
                        if (info.has("VE_SOM")) {
                            veSom = 0 - Math.abs(info.path("VE_SOM").path("Value").asDouble(0)); // luôn âm
                        }
                        if (info.has("CheckOut") && info.path("CheckOut").has("VE_MUON")) {
                            veMuon = Math.abs(info.path("CheckOut").path("VE_MUON").path("Value").asDouble(0)); // luôn dương
                        }

                        String typeCheckIn = info.path("Type").asText();
                        String desTypeCheckIn = info.path("Desc").asText();

                        JsonNode workToday = info.path("WorkToday");
                        JsonNode checkOutNode = info.path("CheckOut");
                        String title = workToday.path("Title").asText();
                        String timeFrom = workToday.path("TimeFrom").asText();
                        String timeTo = workToday.path("TimeTo").asText();
                        String mandays = workToday.path("Value").asText();
                        String typeCheckOut = checkOutNode.path("Type").asText();
                        String desTypeCheckOut = checkOutNode.path("Desc").asText();

                        Shift dto = Shift.builder()
                                .fullname(fullname)
                                .username(username)
                                .stockId(stockId)
                                .stockTitle(stockTitle)
                                .date(date)
                                .checkIn(checkIn)
                                .checkOut(checkOut)
                                .title(title)
                                .timeFrom(timeFrom)
                                .timeTo(timeTo)
                                .mandays(mandays)
                                .typeCheckIn(typeCheckIn)
                                .desTypeCheckIn(desTypeCheckIn)
                                .typeCheckOut(typeCheckOut)
                                .desTypeCheckOut(desTypeCheckOut)
                                .diSom(diSom)
                                .diMuon(diMuon)
                                .veSom(veSom)
                                .veMuon(veMuon)
                                .build();

                        shiftRepository.save(dto);
                    }
                }
            }
        }
        log.info("==== AUTO SAVE WORK TRACK ====");
    }

}
