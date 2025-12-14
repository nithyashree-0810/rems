import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ViewLayoutsComponent } from './components/view-layouts/view-layouts.component';
import { EditLayoutComponent } from './components/edit-layout/edit-layout.component';
import { ViewLayoutComponent } from './components/view-layout/view-layout.component';

import { CreateEnquiryComponent } from './components/customer/create-enquiry/create-enquiry.component';
import { ListEnquiryComponent } from './components/customer/list-enquiry/list-enquiry.component';
import { EditEnquiryComponent } from './components/customer/edit-enquiry/edit-enquiry.component';
import { ViewEnquiryComponent } from './components/customer/view-enquiry/view-enquiry.component';

import { CreateBookingComponent } from './components/Booking/create-booking/create-booking.component';
import { ListBookingComponent } from './components/Booking/list-booking/list-booking.component';
import { ViewBookingComponent } from './components/Booking/view-booking/view-booking.component';
import { EditBookingComponent } from './components/Booking/edit-booking/edit-booking.component';

import { CreatePlotComponent } from './components/Plots/create-plot/create-plot.component';
import { ListPlotComponent } from './components/Plots/list-plot/list-plot.component';
import { EditPlotComponent } from './components/Plots/edit-plot/edit-plot.component';
import { ViewPlotComponent } from './components/Plots/view-plot/view-plot.component';
import { CreateRoleComponent } from './components/Role/create-role/create-role.component';
import { EditRoleComponent } from './components/Role/edit-role/edit-role.component';
import { ListRoleComponent } from './components/Role/list-role/list-role.component';
import { ViewRoleComponent } from './components/Role/view-role/view-role.component';

const routes: Routes = [
  // Auth / Home
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },

  // Layout routes
  { path: 'create-layout', component: LayoutComponent },
  { path: 'layouts', component: ViewLayoutsComponent },
  { path: 'edit-layout/:layoutName', component: EditLayoutComponent },
  { path: 'view-layout/:layoutName', component: ViewLayoutComponent },

  // Booking routes
  { path: 'new-booking', component: CreateBookingComponent },
  { path: 'booking-history', component: ListBookingComponent },
  { path: 'view-booking/:id', component: ViewBookingComponent },
  { path: 'edit-booking/:id', component: EditBookingComponent },

  // Customer / Enquiry routes
  { path: 'create-enquiry', component: CreateEnquiryComponent },
  { path: 'view-enquiries', component: ListEnquiryComponent },
  { path: 'edit-enquiry/:mobileNo', component: EditEnquiryComponent },
  { path: 'view-customer/:mobileNo', component: ViewEnquiryComponent },

  // Plot routes
  { path: 'create-plot', component: CreatePlotComponent },
  { path: 'plots', component: ListPlotComponent },
  { path: 'edit-plot/:layoutName/:plotNo', component: EditPlotComponent },
  { path: 'view-plot/:layoutName/:plotNo', component: ViewPlotComponent },

  //role routes
  {path: 'create-role' ,component:CreateRoleComponent},
  {path: 'edit-role/:roleId' ,component:EditRoleComponent},
  {path: 'list-role' ,component:ListRoleComponent},
  {path: 'view-role/:roleId' ,component:ViewRoleComponent},

  // Wildcard route for 404 page (optional)
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
