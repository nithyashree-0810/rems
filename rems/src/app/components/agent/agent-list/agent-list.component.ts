import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgentService, Agent } from '../../../agent.service';

@Component({
  selector: 'app-agent-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.css']
})
export class AgentListComponent implements OnInit {

  agents: Agent[] = [];
  allAgents: Agent[] = [];
  searchTerm: string = '';

  selectedAgent: Agent = {} as Agent; 
  editMode: boolean = false;

  constructor(
    private agentService: AgentService,
    private router: Router   // ✅ FIXED — Router injected properly
  ) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  // Load all agents
  loadAgents(): void {
    this.agentService.getAgents().subscribe({
      next: (data: Agent[]) => {
        this.allAgents = data;
        this.agents = [...this.allAgents];
      },
      error: err => console.error('Error loading agents:', err)
    });
  }

  // Prepare agent for editing
  editAgent(agent: Agent): void {
    if (!agent.id) return;
    this.selectedAgent = { ...agent };
    this.editMode = true;
  }

  // Update existing agent
  updateAgent(): void {
    if (!this.selectedAgent.id) return;

    this.agentService.updateAgent(this.selectedAgent.id, this.selectedAgent).subscribe({
      next: () => {
        this.loadAgents();
        this.cancelEdit();
      },
      error: err => console.error('Update failed:', err)
    });
  }

  // Cancel editing
  cancelEdit(): void {
    this.selectedAgent = {} as Agent;
    this.editMode = false;
  }

  // Delete agent
  deleteAgent(agent: Agent): void {
    if (!agent.id) return;
    if (confirm('Are you sure you want to delete this agent?')) {
      this.agentService.deleteAgent(agent.id).subscribe({
        next: () => {
          this.agents = this.agents.filter(a => a.id !== agent.id);
          this.allAgents = this.allAgents.filter(a => a.id !== agent.id);
        },
        error: err => console.error('Delete failed:', err)
      });
    }
  }

  // Search / filter agents
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.trim();
    this.filterAgents();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.agents = [...this.allAgents];
  }

  filterAgents(): void {
    if (!this.searchTerm) {
      this.agents = [...this.allAgents];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.agents = this.allAgents.filter(agent =>
      agent.agentName.toLowerCase().includes(term) ||
      agent.email.toLowerCase().includes(term) ||
      agent.mobile.includes(this.searchTerm)
    );
  }

  // Back button logic
  goBack(): void {
    if (this.editMode) {
      this.cancelEdit();            
    } else {
      this.router.navigate(['/dashboard']);  
    }
  }

}
