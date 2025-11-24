package com.example.BasicCRM_FWF.DTORealTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalesDetailDTO {
    private String productName;
    private String productPrice;
    private String productQuantity;
    private String productDiscount;
    private String productCode;
    private String productUnit;
    private String formatTable;
    private String cash;
    private String transfer;
    private String card;
    private String wallet;
    private String foxie;
}
