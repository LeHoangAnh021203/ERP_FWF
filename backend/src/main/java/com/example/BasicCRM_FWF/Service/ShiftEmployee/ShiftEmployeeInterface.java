package com.example.BasicCRM_FWF.Service.ShiftEmployee;

import org.apache.poi.ss.usermodel.Cell;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Time;

public interface ShiftEmployeeInterface {
    public void importFromExcel(MultipartFile file);
}
