package com.techietact.myrems.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techietact.myrems.bean.AgentBo;
import com.techietact.myrems.entity.Agent;
import com.techietact.myrems.repository.AgentRepository;
@Service
public class AgentServiceImpl implements AgentService{
	   @Autowired
	   private AgentRepository repo;
	   
	@Override
	public AgentBo saveAgent(AgentBo bo) {
		   Agent agent = new Agent();
	        agent.setAgentName(bo.getAgentName());
	        agent.setMobile(bo.getMobile());
	        agent.setEmail(bo.getEmail());
	        agent.setAddress(bo.getAddress());
	        agent.setActive(bo.getActive());

	        Agent saved = repo.save(agent);
	        bo.setId(saved.getId());
	        return bo;	
	}

	@Override
	public List<AgentBo> getAllAgents() {
		  return repo.findAll().stream().map(agent -> {
	            AgentBo bo = new AgentBo();
	            bo.setId(agent.getId());
	            bo.setAgentName(agent.getAgentName());
	            bo.setMobile(agent.getMobile());
	            bo.setEmail(agent.getEmail());
	            bo.setAddress(agent.getAddress());
	            bo.setActive(agent.isActive());
	            return bo;
	        }).collect(Collectors.toList());
	}

	@Override
	public AgentBo getAgentById(Long id) {
		 return repo.findById(id)
	                .map(agent -> {
	                    AgentBo bo = new AgentBo();
	                    bo.setId(agent.getId());
	                    bo.setAgentName(agent.getAgentName());
	                    bo.setMobile(agent.getMobile());
	                    bo.setEmail(agent.getEmail());
	                    bo.setAddress(agent.getAddress());
	                    bo.setActive(agent.isActive());
	                    return bo;
	                })
	                .orElse(null);
	}

	@Override
	public void deleteAgent(Long id) {
        repo.deleteById(id);
		
	}
	  public long getTotalAgentCount() {
	        return repo.count();
	    }
	    
	    public long getActiveAgentCount() {
	        return repo.countByActiveTrue();
	    }

		@Override
		public AgentBo updateAgent(Long id, AgentBo bo) {
			    Agent existing = repo.findById(id)
			            .orElseThrow(() -> new RuntimeException("Agent not found with ID: " + id));

			        // Update fields only if they are non-null (optional)
			        if (bo.getAgentName() != null) existing.setAgentName(bo.getAgentName());
			        if (bo.getEmail() != null) existing.setEmail(bo.getEmail());
			        if (bo.getMobile() != null) existing.setMobile(bo.getMobile());
			        if (bo.getAddress() != null) existing.setAddress(bo.getAddress());
			        if (bo.getActive() != null) existing.setActive(bo.getActive());

			        Agent saved = repo.save(existing);

			        // Convert back to AgentBo to return
			        return new AgentBo(
			            saved.getAgentName(),
			            saved.getEmail(),
			            saved.getMobile(),
			            saved.getAddress()
			        );
			    
			
		}
}
