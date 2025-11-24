package com.example.BasicCRM_FWF.Utils;

import org.apache.commons.lang3.tuple.Pair;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class ServiceUtils {

    public static String getString(Cell cell) {
        return cell == null ? null : cell.toString().trim();
    }

    public static boolean isRowEmpty(Row row) {
        for (int c = 0; c <= 4; c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != CellType.BLANK && !getString(cell).isEmpty()) {
                return false;
            }
        }
        return true;
    }

    public static BigDecimal toBigDecimal(Cell cell) {
        try {
            return new BigDecimal(cell.toString().trim().replace(",", ""));
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    public static double calculateGrowth(long previous, long current) {
        if (previous == 0) return 100.0;
        return ((double) (current - previous) / previous) * 100.0;
    }

    public static String safePhone(String phone) {
        return phone == null ? "" : phone.trim();
    }

    public static BigDecimal avg(List<BigDecimal> values) {
        if (values == null || values.isEmpty()) return BigDecimal.ZERO;
        return values.stream().reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(values.size()), RoundingMode.HALF_UP);
    }

    public static double pct(long curr, long prev) {
        return prev > 0 ? ((double)(curr - prev) / prev) * 100.0 : 0.0;
    }

    public static int parseExcelInteger(String value) {
        if (value == null || value.isBlank()) return 0;
        return (int) Double.parseDouble(value);
    }

    public static boolean isWholeMonthSelection(LocalDateTime fromDate, LocalDateTime toDate) {
        LocalDate fromD = fromDate.toLocalDate();
        LocalDate toD   = toDate.toLocalDate();

        boolean sameMonthYear = fromD.getYear() == toD.getYear() && fromD.getMonth() == toD.getMonth();

        if (!sameMonthYear) return false;

        LocalDate firstDay = fromD.withDayOfMonth(1);
        LocalDate lastDay  = fromD.with(TemporalAdjusters.lastDayOfMonth());

        return fromD.isEqual(firstDay) && toD.isEqual(lastDay);
    }

    public static Map<String, Object[]> toMap(List<Object[]> raw) {
        return raw.stream().collect(Collectors.toMap(
                row -> (String) row[0],
                row -> new Object[]{ row[1], row[2] }
        ));
    }

    public static Pair<String, Integer> extractQuantityAndCleanName(String s) {
        if (s == null) return org.apache.commons.lang3.tuple.Pair.of(null, 0);

        String input = s.trim().replaceAll("\\s+", " ");
        Matcher m = Pattern.compile("\\((\\d+)\\)\\s*$").matcher(input);

        int quantity = 1;
        if (m.find()) {
            try { quantity = Integer.parseInt(m.group(1)); } catch (NumberFormatException ignore) { quantity = 1; }
        }
        String cleanName = cleanTailNumber(input);
        return org.apache.commons.lang3.tuple.Pair.of(cleanName, quantity);
    }

    public static String cleanTailNumber(String s) {
        return s.replaceAll("\\s*\\(\\d+\\)$", "");
    }

    // Helper method to safely cast to BigDecimal
    public static BigDecimal toSafeBigDecimal(Object value) {
        return value != null ? (BigDecimal) value : BigDecimal.ZERO;
    }

    public static double calculateGrowthBigDecimal(BigDecimal previous, BigDecimal current) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) return 100.0;
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

    public static double calculatePercentChange(BigDecimal previous, BigDecimal current) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) == 0 ? 0 : 100.0;
        }
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)).doubleValue();
    }

    public static String getStringCell(Cell cell) {
        if (cell == null) return null;

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    LocalDateTime dt = cell.getLocalDateTimeCellValue();
                    return dt.format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy"));
                } else {
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            case BLANK:
                return "";
            default:
                return null;
        }
    }

    public static String getOptional(Cell cell) {
        String s = getString(cell);
        return (s == null || s.isBlank()) ? null : s;
    }

    public static String getSafeString(Cell cell) {
        try {
            return getString(cell);
        } catch (Exception e) {
            return "ERR(" + e.getMessage() + ")";
        }
    }

    public static LocalDateTime parseDate(String value) {
        List<String> patterns = List.of("HH:mm dd/MM/yyyy");
        for (String p : patterns) {
            try {
                return LocalDateTime.parse(value, DateTimeFormatter.ofPattern(p));
            } catch (Exception ignored) {}
        }
        throw new IllegalArgumentException("Invalid date format: " + value);
    }

    public static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    public static String normalize(String s) {
        return s == null ? null : s.replaceAll("\\s+", " ").trim().toLowerCase();
    }


    public static String normalizeShop(String s) {
        if (s == null) return null;
        String t = s.trim().toLowerCase();
        t = t.replaceAll("\\s+", " ");
        t = t.replaceAll("[()\\[\\]{}]", "");
        return t;
    }

    public static String trimToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    public static LocalDate parseLocalDate(String s, String pattern) {
        try {
            if (isBlank(s)) return null;
            return LocalDate.parse(s.trim(), DateTimeFormatter.ofPattern(pattern));
        } catch (Exception e) {
            return null;
        }
    }

    public static Double parseDoubleNullSafe(String s) {
        try {
            if (isBlank(s)) return null;
            return Double.parseDouble(s.trim());
        } catch (Exception e) {
            return null;
        }
    }

    // Bạn đã có parseTime(rawTime); bọc null-safe
    public static Time parseTimeNullSafe(String s) {
        try {
            if (isBlank(s)) return null;
            return parseTime(s.trim()); // hàm gốc của bạn
        } catch (Exception e) {
            return null;
        }
    }

    private String safeString(Cell cell) {
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            return null;
        } else  {
            switch (cell.getCellType()) {
                case STRING: return cell.getStringCellValue().trim();
                case NUMERIC:
                    if (DateUtil.isCellDateFormatted(cell)) {
                        return cell.getLocalDateTimeCellValue().toLocalTime().toString();
                    } else {
                        return String.valueOf(cell.getNumericCellValue());
                    }
                case FORMULA:
                    return cell.getCellFormula();
                case BOOLEAN:
                    return String.valueOf(cell.getBooleanCellValue());
                default: return null;
            }
        }
    }

    public static Time parseTime(String timeString) {
        if  (timeString.isBlank()) return null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalTime localTime = LocalTime.parse(timeString, formatter);
        return  Time.valueOf(localTime);
    }
}
