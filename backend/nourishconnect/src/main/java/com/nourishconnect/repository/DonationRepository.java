package com.nourishconnect.repository;

import com.nourishconnect.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, String> {
    List<Donation> findByDonorEmailIgnoreCaseOrderBySubmittedAtDesc(String email);
}