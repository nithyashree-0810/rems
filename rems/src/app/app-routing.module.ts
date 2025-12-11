import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { ViewLayoutsComponent } from './components/view-layouts/view-layouts.component';
import { CreateEnquiryComponent } from './components/customer/create-enquiry/create-enquiry.component';
import { ListEnquiryComponent } from './components/customer/list-enquiry/list-enquiry.component';
import { EditEnquiryComponent } from './components/customer/edit-enquiry/edit-enquiry.component';
import { ViewEnquiryComponent } from './components/customer/view-enquiry/view-enquiry.component';
import { CreateBookingComponent } from './components/Booking/create-booking/create-booking.component';
import { ListBookingComponent } from './components/Booking/list-booking/list-booking.component';
import { CreatePlotComponent } from './components/Plots/create-plot/create-plot.component';
import { ListPlotComponent } from './components/Plots/list-plot/list-plot.component';
import { EditLayoutComponent } from './components/edit-layout/edit-layout.component';
import { ViewLayoutComponent } from './components/view-layout/view-layout.component';
import { EditPlotComponent } from './components/Plots/edit-plot/edit-plot.component';
import { ViewPlotComponent } from './components/Plots/view-plot/view-plot.component';


const routes: Routes = [
  
  {   path: '', component: LoginComponent },
  {   path: 'dashboard',component: DashboardComponent},
  {   path: 'create-layout', component:LayoutComponent},
  {   path: 'layouts', component:ViewLayoutsComponent},
  { path: 'edit-layout/:layoutName', component: EditLayoutComponent },
  { path: 'view-layout/:layoutName', component: ViewLayoutComponent },
  //create
  {path:'new-booking',component:CreateBookingComponent},
  //list
 {path:'booking-history',component:ListBookingComponent},
 //create
 {path:'create-enquiry',component:CreateEnquiryComponent},
//list customer
 {path:'view-enquiries',component:ListEnquiryComponent},
//edit customer
 {path:'edit-enquiry/:mobileNo',component:EditEnquiryComponent},
 //particular customer
 {path:'view-customer/:mobileNo',component:ViewEnquiryComponent},
 { path: 'edit-plot/:layoutName/:plotNo', component: EditPlotComponent },
  { path: 'view-plot/:layoutName/:plotNo', component: ViewPlotComponent },
 
 {path:'create-plot',component:CreatePlotComponent},
 {path:'plots',component:ListPlotComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
