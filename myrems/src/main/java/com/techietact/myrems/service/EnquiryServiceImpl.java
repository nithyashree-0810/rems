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
    if (repository.existsByMobileNo(enquiry.getMobileNo())) {
        throw new RuntimeException("Mobile number already exists!");
    }
    if (enquiry.getEmail() != null && !enquiry.getEmail().trim().isEmpty()) {
        if (repository.existsByEmail(enquiry.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }
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
    return repository.findByMobileNo(mobileNo);
}

public Enquiry update(Long mobileNo, Enquiry updated) {
    Enquiry existing = getByMobileNo(mobileNo);
    existing.setFirstName(updated.getFirstName());
    existing.setLastName(updated.getLastName());
    existing.setFatherName(updated.getFatherName());
    existing.setAddress(updated.getAddress());
    existing.setPincode(updated.getPincode());
    existing.setEmail(updated.getEmail());
    existing.setAadharNo(updated.getAadharNo());
    //existing.setPanNo(updated.getPanNo());
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

}
