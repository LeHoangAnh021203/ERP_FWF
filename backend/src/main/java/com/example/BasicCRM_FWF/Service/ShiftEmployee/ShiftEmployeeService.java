package com.example.BasicCRM_FWF.Service.ShiftEmployee;

import com.example.BasicCRM_FWF.Model.Region;
import com.example.BasicCRM_FWF.Model.Shift;
import com.example.BasicCRM_FWF.Repository.RegionRepository;
import com.example.BasicCRM_FWF.Repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.example.BasicCRM_FWF.Utils.ServiceUtils.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShiftEmployeeService {

    private final ShiftRepository repository;
    private final RegionRepository regionRepository;

//    public void importFromExcel(MultipartFile file) {
//        int successCount = 0;
//        int failCount = 0;
//        int updateCount = 0;
//        int updateFailCount = 0;
//
//        try (InputStream is = file.getInputStream()) {
//            Workbook workbook = WorkbookFactory.create(is);
//            Sheet sheet = workbook.getSheetAt(0);
//
//            String lastEmployeeName = null;
//            String lastFacility = null;
//
//            Map<String, Region> regionMap = regionRepository.findAll()
//                    .stream()
//                    .collect(Collectors.toMap(
//                            r -> r.getShop_name().trim(),
//                            Function.identity()
//                    ));
//
//            for (int i = 3; i <= sheet.getLastRowNum(); i++) {
//                Row row = sheet.getRow(i);
//                if (row == null) continue;
//
//                // === B1: Đọc giá trị (null-safe, carry-forward) ===
//                String employeeNameRaw = getSafeString(row.getCell(0));
//                String employeeName = isBlank(employeeNameRaw) ? lastEmployeeName : employeeNameRaw;
//                if (!isBlank(employeeNameRaw)) lastEmployeeName = employeeNameRaw;
//
//                String facilityCell = getSafeString( row.getCell(1));
//                String facilityRaw = isBlank(facilityCell) ? lastFacility : facilityCell;
//                if (!isBlank(facilityCell)) lastFacility = facilityCell;
//
//                // Chuẩn hoá (trim) để map đúng key
//                facilityRaw = trimToNull(facilityRaw);
//
//                // === B2: Xác định facilityRegion (null-safe) ===
//                Region facilityRegion = null;
//                if (facilityRaw == null || "Quản lý cơ sở".equals(facilityRaw)) {
//                    facilityRegion = null;
//                } else {
//                    facilityRegion = regionMap.get(facilityRaw);
//                    // Không có trong map -> có thể log cảnh báo để kiểm tra dữ liệu master
//                    if (facilityRegion == null) {
//                        log.warn("Row {}: facility '{}' không tồn tại trong regionMap", i, facilityRaw);
//                    }
//                }
//
//                // === B3: Parse date/time/number an toàn ===
//                String rawDate = getSafeString(row.getCell(2));
//                LocalDate date = parseLocalDate(rawDate, "dd-MM-yyyy"); // trả null nếu rỗng/sai định dạng
//
//                String rawTime = getSafeString(row.getCell(3));
//                Time checkInOut = parseTimeNullSafe(rawTime); // trả null nếu rỗng/sai
//
//                String checkInFacility = getSafeString(row.getCell(4));
//                String typeCheckInOut = getSafeString(row.getCell(5));
//
//                Double bonusFine = parseDoubleNullSafe(getSafeString(row.getCell(6)));
//                String reasonType = getSafeString(row.getCell(7));
//                String reasonDesc = getSafeString(row.getCell(8));
//
//                Double mandays = parseDoubleNullSafe(getSafeString(row.getCell(9)));
//
//                // cột 10 (index 10) có gì không? bạn đang nhảy từ 9 -> 11. Kiểm tra lại template.
//                Double dailyAllowance = parseDoubleNullSafe(getSafeString(row.getCell(11)));
//
//                // === B4: Validate bắt buộc trước khi query repo ===
//                if (isBlank(employeeName) || date == null) {
//                    log.warn("Row {}: thiếu trường bắt buộc (employeeName/date). Bỏ qua.", i);
//                    continue;
//                }
//
//                try {
//                    Shift existingShift = repository.findByNameAndDate(employeeName, date);
//
//                    if (existingShift == null) {
//                        // --- Insert check-in ---
//                        Shift shift = Shift.builder()
//                                .employeeName(employeeName)
//                                .facility(facilityRegion)
//                                .date(date)
//                                .checkIn(checkInOut)
//                                .checkInFacility("Đúng điểm".equals(checkInFacility) ? null : checkInFacility)
//                                .typeCheckIn(typeCheckInOut)
//                                .bonusFineCheckIn((bonusFine != null && bonusFine == 0) ? null : bonusFine)
//                                .reasonTypeCheckIn(reasonType)
//                                .reasonDescriptionCheckIn(reasonDesc)
//                                .mandays(mandays)
//                                .dailyAllowance(dailyAllowance)
//                                .build();
//                        repository.save(shift);
//                        successCount++;
//                        log.info("[{}] Imported check-in: {} | {}", successCount, employeeName, date);
//                    } else {
//                        // --- Update check-out ---
//                        existingShift.setCheckOut(checkInOut);
//                        existingShift.setTypeCheckOut(typeCheckInOut);
//                        existingShift.setBonusFineCheckOut((bonusFine != null && bonusFine == 0) ? null : bonusFine);
//                        existingShift.setReasonTypeCheckOut(reasonType);
//                        existingShift.setReasonDescriptionCheckOut(reasonDesc);
//                        repository.save(existingShift);
//                        updateCount++;
//                        log.info("[{}] Updated check-out: {} | {}", updateCount, employeeName, date);
//                    }
//                } catch (Exception e) {
//                    try {
//                        Shift check = repository.findByNameAndDate(employeeName, date);
//                        if (check == null) {
//                            failCount++;
//                            log.warn("[{}] Insert failed for {} - {}. Err: {}", failCount, employeeName, date, e.toString());
//                        } else {
//                            updateFailCount++;
//                            log.warn("[{}] Update failed for {} - {}. Err: {}", updateFailCount, employeeName, date, e.toString());
//                        }
//                    } catch (Exception nested) {
//                        // Trong trường hợp repo cũng ném lỗi do tham số null hoặc DB issue
//                        failCount++;
//                        log.warn("[{}] Failure (unknown stage) for {} - {}. Err: {}; Nested: {}",
//                                failCount, employeeName, date, e.toString(), nested.toString());
//                    }
//                }
//            }
//
//            log.info("Import complete: Inserted {}, Updated {}, Insert Failures {}, Update Failures {}",
//                    successCount, updateCount, failCount, updateFailCount);
//
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to load excel", e);
//        }
//    }


}
