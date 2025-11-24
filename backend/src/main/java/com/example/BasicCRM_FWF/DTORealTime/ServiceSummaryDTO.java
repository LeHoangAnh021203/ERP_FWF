package com.example.BasicCRM_FWF.DTORealTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceSummaryDTO {
    private String totalServices;
    private String totalServicesServing;
    private String totalServiceDone;
    private List<ServiceItems> items;
}
