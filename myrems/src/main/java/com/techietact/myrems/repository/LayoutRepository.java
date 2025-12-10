package com.techietact.myrems.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.techietact.myrems.entity.Layout;

@Repository
public interface LayoutRepository extends JpaRepository<Layout,String>{

	Optional<Layout> getByLayoutName(String layoutName);

	List<Layout> findByLayoutName(String layoutName);

	List<Layout> findByLocation(String location);

	List<Layout> findByLayoutNameAndLocation(String layoutName, String location);

	List<Layout> findAllByOrderByCreatedDateAsc();
	

	//LayoutBO save(LayoutBO layoutBO);

}
