package com.techietact.myrems.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.techietact.myrems.entity.Plot;

@Repository
public interface PlotRepository extends JpaRepository<Plot,Long> {


	List<Plot> findByLayout_LayoutName(String layoutName);

	boolean existsByPlotNo(String plotNo);

	Optional<Plot> findByPlotNo(String plotNo);

	boolean existsByPlotNoAndLayout_LayoutName(String plotNo, String layoutName);


}
