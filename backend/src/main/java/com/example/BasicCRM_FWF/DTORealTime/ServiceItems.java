package com.example.BasicCRM_FWF.DTORealTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceItems {
    private String serviceName;
    private String serviceUsageAmount;
    private String serviceUsagePercentage;
}
