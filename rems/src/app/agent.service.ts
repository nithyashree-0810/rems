import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Agent {
  id?: number;
  agentName: string;
  email: string;
  mobile: string;
  address?: string;
  active?: boolean; // Always boolean
}

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private baseUrl = 'http://localhost:8080/api/agents';

  constructor(private http: HttpClient) { }

  // ✅ Get all agents
  getAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.baseUrl);
  }

  // ✅ Get agent by ID
  getAgentById(id: number): Observable<Agent> {
    return this.http.get<Agent>(`${this.baseUrl}/${id}`);
  }

  // ✅ Add new agent
  addAgent(agentData: Agent): Observable<Agent> {
    return this.http.post<Agent>(this.baseUrl, agentData);
  }

  // ✅ Update existing agent
  updateAgent(id: number, agentData: Agent): Observable<Agent> {
    return this.http.put<Agent>(`${this.baseUrl}/${id}`, agentData);
  }

  // ✅ Delete agent
  deleteAgent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ✅ Get total agent count
  getAgentCount(): Observable<number> {
    return this.getAgents().pipe(
      map(agents => agents.length)
    );
  }

  // ✅ Get active agent count (type-safe)
  getActiveAgentCount(): Observable<number> {
    return this.getAgents().pipe(
      map(agents => agents.filter(agent => agent.active === true).length)
    );
  }

  // ✅ Get dashboard stats (type-safe)
  getDashboardStats(): Observable<{ totalAgents: number; activeAgents: number; inactiveAgents: number }> {
    return this.getAgents().pipe(
      map(agents => {
        const activeCount = agents.filter(agent => agent.active === true).length;
        return {
          totalAgents: agents.length,
          activeAgents: activeCount,
          inactiveAgents: agents.length - activeCount
        };
      })
    );
  }
}
