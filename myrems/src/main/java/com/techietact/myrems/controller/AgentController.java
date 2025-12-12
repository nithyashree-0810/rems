package com.techietact.myrems.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.techietact.myrems.bean.AgentBo;
import com.techietact.myrems.service.AgentService;

@RestController
@RequestMapping("/api/agents")
@CrossOrigin(origins = "http://localhost:4200")
public class AgentController {

    @Autowired
    private AgentService agentService;

    // Handle OPTIONS preflight requests
    @RequestMapping(method = RequestMethod.OPTIONS, value = "/**")
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public AgentBo addAgent(@RequestBody AgentBo bo) {
        System.out.println("📥 AgentBo RECEIVED:");
        System.out.println("agentName: " + bo.getAgentName());
        System.out.println("email: " + bo.getEmail());
        System.out.println("mobile: " + bo.getMobile());
        System.out.println("address: " + bo.getAddress());
        System.out.println("active: " + bo.getActive());
        
        return agentService.saveAgent(bo);
    }

    @GetMapping
    public List<AgentBo> getAll() {
        return agentService.getAllAgents();
    }

    @GetMapping("/{id}")
    public AgentBo findById(@PathVariable Long id) {
        return agentService.getAgentById(id);
    }
    
    @PutMapping("/{id}")
    public AgentBo updateAgent(@PathVariable Long id, @RequestBody AgentBo bo) {
        System.out.println(" UPDATING Agent ID: " + id);
        System.out.println("agentName: " + bo.getAgentName());
        System.out.println("email: " + bo.getEmail());
        System.out.println("active: " + bo.getActive());
        
        return agentService.updateAgent(id, bo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        agentService.deleteAgent(id);
        return ResponseEntity.ok("Deleted");
    }
    
    @GetMapping("/count")
    public Map<String, Long> getAgentCount() {
        long totalCount = agentService.getAllAgents().size();
        long activeCount = agentService.getAllAgents().stream()
            .filter(agent -> agent.getActive() != null && agent.getActive())
            .count();
        
        return Map.of(
            "total", totalCount,
            "active", activeCount
        );
    }
    
    @GetMapping("/active-count")
    public long getActiveAgentCount() {
        return agentService.getAllAgents().stream()
            .filter(agent -> agent.getActive() != null && agent.getActive())
            .count();
    }
}