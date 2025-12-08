import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';

import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewLayoutsComponent } from './components/view-layouts/view-layouts.component';


import { HttpClientModule } from '@angular/common/http';

import { ListEnquiryComponent } from './components/customer/list-enquiry/list-enquiry.component';
import { ViewEnquiryComponent } from './components/customer/view-enquiry/view-enquiry.component';
import { CreateEnquiryComponent } from './components/customer/create-enquiry/create-enquiry.component';
import { EditEnquiryComponent } from './components/customer/edit-enquiry/edit-enquiry.component';
import { CreateBookingComponent } from './components/Booking/create-booking/create-booking.component';
import { ListBookingComponent } from './components/Booking/list-booking/list-booking.component';
import { EditBookingComponent } from './components/Booking/edit-booking/edit-booking.component';
import { ViewBookingComponent } from './components/Booking/view-booking/view-booking.component';
import { CreatePlotComponent } from './components/Plots/create-plot/create-plot.component';
import { ListPlotComponent } from './components/Plots/list-plot/list-plot.component';
import { EditPlotComponent } from './components/Plots/edit-plot/edit-plot.component';
import { ViewPlotComponent } from './components/Plots/view-plot/view-plot.component';
import { EditLayoutComponent } from './components/edit-layout/edit-layout.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    EditLayoutComponent,
    HeaderComponent,
    DashboardComponent,
    ViewLayoutsComponent,
    
    //customer
    CreateEnquiryComponent,
    EditEnquiryComponent,
    ListEnquiryComponent,
    ViewEnquiryComponent,
    //Booking
    CreateBookingComponent,
    ListBookingComponent,
    EditBookingComponent,
    ViewBookingComponent,
    CreatePlotComponent,
    ListPlotComponent, 
    EditPlotComponent,
    ViewPlotComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
   HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
