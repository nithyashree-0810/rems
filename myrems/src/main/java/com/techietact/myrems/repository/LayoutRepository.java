package com.techietact.myrems.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.techietact.myrems.entity.Layout;

@Repository
public interface LayoutRepository extends JpaRepository<Layout, Long>{

	Optional<Layout> findByLayoutName(String layoutName);

    List<Layout> findAllByLayoutName(String layoutName);

	List<Layout> findByLocation(String location);

	    @Query("SELECT l FROM Layout l WHERE " +
	           "(:layoutName IS NULL OR LOWER(l.layoutName) LIKE LOWER(CONCAT('%', :layoutName, '%'))) AND " +
	           "(:location IS NULL OR LOWER(l.location) LIKE LOWER(CONCAT('%', :location, '%')))")
	    List<Layout> searchLayouts(@Param("layoutName") String layoutName,
	                               @Param("location") String location);

	List<Layout> findByLayoutNameAndLocation(String layoutName, String location);

	List<Layout> findAllByOrderByCreatedDateAsc();

}
