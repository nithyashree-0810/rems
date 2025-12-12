package com.techietact.myrems.service;

import java.util.List;

import com.techietact.myrems.bean.AgentBo;

public interface AgentService {
	AgentBo saveAgent(AgentBo bo);
	
    List<AgentBo> getAllAgents();
    
    AgentBo getAgentById(Long id);
    
    void deleteAgent(Long id);

	AgentBo updateAgent(Long id, AgentBo bo);
    
    
}
