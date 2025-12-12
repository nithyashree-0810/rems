package com.techietact.myrems.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techietact.myrems.entity.Agent;

public interface AgentRepository extends JpaRepository<Agent, Long> {

	long countByActiveTrue();

}
