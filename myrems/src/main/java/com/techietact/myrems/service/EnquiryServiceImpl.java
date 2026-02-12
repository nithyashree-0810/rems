package com.techietact.myrems.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techietact.myrems.entity.Enquiry;
import com.techietact.myrems.repository.EnquiryRepository;

import jakarta.transaction.Transactional;

@Service
public class EnquiryServiceImpl implements EnquiryService {
@Autowired 

private EnquiryRepository repository;
	
public Enquiry create(Enquiry enquiry) {
    if (enquiry.getMobileNo() != null) {
        Optional<Enquiry> existing = repository.findByMobileNo(enquiry.getMobileNo());
        if (existing.isPresent()) {
            Enquiry e = existing.get();
            throw new RuntimeException("This mobile number already exists under the name: " + e.getFirstName() + " " + e.getLastName());
        }
    }
    if (enquiry.getEmail() != null && !enquiry.getEmail().trim().isEmpty()) {
        if (repository.existsByEmail(enquiry.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }
    }

    // Validation for firstName
    if (enquiry.getFirstName() == null || enquiry.getFirstName().trim().isEmpty()) {
        throw new RuntimeException("First Name is required.");
    }
    if (enquiry.getFirstName().length() > 30) {
        throw new RuntimeException("First Name cannot exceed 30 characters.");
    }
    if (!enquiry.getFirstName().matches("^[a-zA-Z ]+$")) {
        throw new RuntimeException("First Name can only contain alphabets and spaces.");
    }

    enquiry.setCreatedDate(LocalDateTime.now());

    return repository.save(enquiry);
}

//public List<Enquiry> getAll() {
//    return repository.findAllByOrderByCreatedDateAsc();
//}
public List<Enquiry> getAll() {
    return repository.findAllByOrderByCreatedDateDesc();
}


public Enquiry getByMobileNo(Long mobileNo) {
    return repository.findByMobileNo(mobileNo).orElse(null);
}

public Enquiry update(Long mobileNo, Enquiry updated) {
    Enquiry existing = getByMobileNo(mobileNo);
    if (existing == null) {
        throw new RuntimeException("Customer not found with mobile: " + mobileNo);
    }
    existing.setFirstName(updated.getFirstName());
    existing.setLastName(updated.getLastName());
    existing.setFatherName(updated.getFatherName());
    existing.setAddress(updated.getAddress());
    existing.setPincode(updated.getPincode());
    existing.setEmail(updated.getEmail());
    existing.setAadharNo(updated.getAadharNo());
    //existing.setPanNo(updated.getPanNo());
    existing.setProfileImagePath(updated.getProfileImagePath());
    existing.setReferralName(updated.getReferralName());
    existing.setReferralNumber(updated.getReferralNumber());
    existing.setLayoutName(updated.getLayoutName());
    existing.setLayoutLocation(updated.getLayoutLocation());
    existing.setComment(updated.getComment());
    return repository.save(existing);
}

public void delete(Long mobileNo) {
    repository.deleteById(mobileNo);
}

public boolean mobileExists(Long mobileNo) {
    return repository.existsByMobileNo(mobileNo);
}

public boolean emailExists(String email) {
    return repository.existsByEmail(email);
}
@Override
public List<Enquiry> search(String keyword) {
    Long mobile = null;

    // Check if keyword is a mobile number
    try {
        mobile = Long.parseLong(keyword);
    } catch (Exception e) {
        mobile = null; // Not a number → ignore
    }

    return repository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrMobileNoOrEmailContainingIgnoreCase(
            keyword, keyword, mobile, keyword
    );
}

@Override
public List<Enquiry> advancedSearch(String layoutLocation, String referralName, String layoutName, String firstName, String mobileNo, String address) {
    return repository.advancedSearch(
            layoutLocation == null ? "" : layoutLocation,
            referralName == null ? "" : referralName,
            layoutName == null ? "" : layoutName,
            firstName == null ? "" : firstName,
            mobileNo == null ? "" : mobileNo,
            address == null ? "" : address
    );
}

@Override
public String getExistingMobileName(Long mobileNo) {
    return repository.findByMobileNo(mobileNo)
            .map(e -> e.getFirstName() + " " + e.getLastName())
            .orElse("");
}

}
