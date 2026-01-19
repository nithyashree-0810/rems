import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Login & Dashboard
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// Layout
import { LayoutComponent } from './components/layout/layout.component';
import { ViewLayoutsComponent } from './components/view-layouts/view-layouts.component';
import { EditLayoutComponent } from './components/edit-layout/edit-layout.component';
import { ViewLayoutComponent } from './components/view-layout/view-layout.component';

// Customer / Enquiry
import { CreateEnquiryComponent } from './components/customer/create-enquiry/create-enquiry.component';
import { ListEnquiryComponent } from './components/customer/list-enquiry/list-enquiry.component';
import { EditEnquiryComponent } from './components/customer/edit-enquiry/edit-enquiry.component';
import { ViewEnquiryComponent } from './components/customer/view-enquiry/view-enquiry.component';

// Booking
import { CreateBookingComponent } from './components/Booking/create-booking/create-booking.component';
import { ListBookingComponent } from './components/Booking/list-booking/list-booking.component';
import { ViewBookingComponent } from './components/Booking/view-booking/view-booking.component';
import { EditBookingComponent } from './components/Booking/edit-booking/edit-booking.component';

// Plots
import { CreatePlotComponent } from './components/Plots/create-plot/create-plot.component';
import { ListPlotComponent } from './components/Plots/list-plot/list-plot.component';
import { EditPlotComponent } from './components/Plots/edit-plot/edit-plot.component';
import { ViewPlotComponent } from './components/Plots/view-plot/view-plot.component';

// Roles
import { CreateRoleComponent } from './components/Role/create-role/create-role.component';
import { EditRoleComponent } from './components/Role/edit-role/edit-role.component';
import { ListRoleComponent } from './components/Role/list-role/list-role.component';
import { ViewRoleComponent } from './components/Role/view-role/view-role.component';
import { ReportEnquiryComponent } from './components/customer/report-enquiry/report-enquiry.component';
import { ReportPlotComponent } from './components/Plots/report-plot/report-plot.component';
import { ReportBookingComponent } from './components/Booking/report-booking/report-booking.component';
import { ReportLayoutComponent } from './components/report-layout/report-layout.component';
import { ReportRoleComponent } from './components/Role/report-role/report-role.component';


const routes: Routes = [

  /** Authentication */
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },

  /** Layout Routes */
  { path: 'create-layout', component: LayoutComponent },
  { path: 'layouts', component: ViewLayoutsComponent },
  { path: 'edit-layout/:layoutName', component: EditLayoutComponent },
  { path: 'view-layout/:layoutName', component: ViewLayoutComponent },
  { path: 'report-layout', component: ReportLayoutComponent },

  /** Booking Routes */
  { path: 'new-booking', component: CreateBookingComponent },
  { path: 'booking-history', component: ListBookingComponent },
  { path: 'view-booking/:id', component: ViewBookingComponent },
  { path: 'edit-booking/:id', component: EditBookingComponent },
  { path: 'report-booking', component: ReportBookingComponent },

  /** Customer / Enquiry Routes */
  { path: 'create-enquiry', component: CreateEnquiryComponent },
  { path: 'view-enquiries', component: ListEnquiryComponent },
  { path: 'edit-enquiry/:mobileNo', component: EditEnquiryComponent },
  { path: 'view-customer/:mobileNo', component: ViewEnquiryComponent },
  { path: 'report-enquiry', component:ReportEnquiryComponent },

  /** Plot Routes */
  { path: 'create-plot', component: CreatePlotComponent },
  { path: 'plots', component: ListPlotComponent },
  { path: 'edit-plot/:layoutName/:plotNo', component: EditPlotComponent },
  { path: 'view-plot/:layoutName/:plotNo', component: ViewPlotComponent },
   { path: 'report-plot', component: ReportPlotComponent },

  /** Role Routes */
  { path: 'create-role', component: CreateRoleComponent },
  { path: 'edit-role/:roleId', component: EditRoleComponent },
  { path: 'list-role', component: ListRoleComponent },
  { path: 'view-role/:roleId', component: ViewRoleComponent },
  { path: 'report-role', component: ReportRoleComponent },

  /** 404 Fallback */
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
