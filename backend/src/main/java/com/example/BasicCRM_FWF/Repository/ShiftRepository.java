package com.example.BasicCRM_FWF.Repository;

import com.example.BasicCRM_FWF.Model.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;

public interface ShiftRepository extends JpaRepository<Shift, Integer> {
//    Shift findByEmployeeNameAndDate(String employeeName, LocalDate date);

    @Query(value = """
        SELECT * FROM Shift WHERE employee_name = :employeeName AND date = :date
    """,nativeQuery = true)
    Shift findByNameAndDate(String employeeName, LocalDate date);
}
