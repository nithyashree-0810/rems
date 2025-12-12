import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { AgentService } from '../../../agent.service';

@Component({
  selector: 'app-add-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent {

  // Form fields
  agentName: string = '';
  email: string = '';
  mobile: string = '';
  address: string = '';

  // Loading & status messages
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private agentService: AgentService, private location: Location) {}

  // Navigate back
  goBack(): void {
    this.location.back();
  }

  // Clear the form
  clearForm(): void {
    if (confirm('Are you sure you want to clear all fields?')) {
      this.resetForm();
      this.successMessage = '';
      this.errorMessage = '';
    }
  }

  // Reset form fields
  private resetForm(): void {
    this.agentName = '';
    this.email = '';
    this.mobile = '';
    this.address = '';
  }

  // Validate the form
  private validateForm(): boolean {
    if (!this.agentName.trim()) {
      this.errorMessage = 'Agent Name is required';
      return false;
    }

    if (!this.email.trim()) {
      this.errorMessage = 'Email is required';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email';
      return false;
    }

    if (!this.mobile.trim()) {
      this.errorMessage = 'Mobile number is required';
      return false;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(this.mobile)) {
      this.errorMessage = 'Please enter a valid 10-digit mobile number';
      return false;
    }

    if (!this.address.trim()) {
      this.errorMessage = 'Address is required';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  // Submit the form
  addAgent(): void {
    if (!this.validateForm()) return;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const agentData = {
      agentName: this.agentName.trim(),
      email: this.email.trim(),
      mobile: this.mobile.trim(),
      address: this.address.trim()
    };

    this.agentService.addAgent(agentData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = '✅ Agent added successfully to database!';
        this.resetForm();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = '❌ Failed to add agent: ' +
          (error.error?.message || error.message || 'Server error');
      }
    });
  }
}
