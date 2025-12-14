package com.techietact.myrems.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.techietact.myrems.entity.Role;
import com.techietact.myrems.service.RoleService;

@CrossOrigin("*")
@RequestMapping("/api/role")
@RestController
public class RoleController {

	@Autowired
	private RoleService roleService;
	//private EnquiryRepository enquiryRepository;
	
	@PostMapping
    public ResponseEntity<?> create(@RequestBody Role role) {
        try {
            return ResponseEntity.ok(roleService.create(role));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Role> getAll() {
        return roleService.getAll();
    }

    @GetMapping("/check-mobile/{mobileNo}")
    public boolean checkMobile(@PathVariable String mobileNo) {
        return roleService.mobileExists(mobileNo);
    }

    @GetMapping("/check-email/{email}")
    public boolean checkEmail(@PathVariable String email) {
        if (email == null || email.trim().isEmpty()) {
            return false; 
        }
        return roleService.emailExists(email);
    }
    
    @PutMapping("/update/{roleId}")
    public ResponseEntity<Role> update(@PathVariable Long roleId, @RequestBody Role roleDetails) {
        Role updatedRole = roleService.update(roleId, roleDetails);
        return ResponseEntity.ok(updatedRole);
    }

    @DeleteMapping("/delete/{roleId}")
    public ResponseEntity<String> delete(@PathVariable Long roleId) {
        roleService.delete(roleId);
        return ResponseEntity.ok("Role deleted successfully");
    }
    
    @GetMapping("/get/{roleId}")
    public ResponseEntity<Role> getRole(@PathVariable Long roleId) {
        Role role = roleService.getByRoleId(roleId);
        return ResponseEntity.ok(role);
    }
    
    @GetMapping("/search/{keyword}")
    public List<Role> search(@PathVariable String keyword) {
        return roleService.search(keyword);
    }
}
