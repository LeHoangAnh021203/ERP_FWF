package com.example.BasicCRM_FWF.DTORealTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDTO {
    private String notConfirmed;
    private String confirmed;
    private String denied;
    private String customerCome;
    private String customerNotCome;
    private String cancel;
    private String autoConfirmed;
}
