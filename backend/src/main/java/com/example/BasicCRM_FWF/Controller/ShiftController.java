package com.example.BasicCRM_FWF.Controller;

import com.example.BasicCRM_FWF.Service.Realtime.RealTimeInterface;
import com.example.BasicCRM_FWF.Service.ShiftEmployee.ShiftEmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shift")
@RequiredArgsConstructor
public class ShiftController {

    private final ShiftEmployeeService service;
    private final RealTimeInterface realTimeService;

//    @PostMapping("/upload")
//    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) throws IOException {
//        service.importFromExcel(file);
//        return ResponseEntity.ok("Upload successful" + file.getOriginalFilename());
//    }

//    @GetMapping("/shift-employee")
//    public ResponseEntity<List<ShiftDTO>> workTract() throws Exception {
//        List<ShiftDTO> shiftDTOS = realTimeService.autoSaveWorkTrack();
//        return ResponseEntity.ok(shiftDTOS);
//    }
}
