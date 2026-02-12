import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewLayoutsComponent } from './components/view-layouts/view-layouts.component';
import { ViewLayoutComponent } from './components/view-layout/view-layout.component';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

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
import { CreateRoleComponent } from './components/Role/create-role/create-role.component';
import { EditRoleComponent } from './components/Role/edit-role/edit-role.component';
import { ListRoleComponent } from './components/Role/list-role/list-role.component';
import { ViewRoleComponent } from './components/Role/view-role/view-role.component';
import { ReportEnquiryComponent } from './components/customer/report-enquiry/report-enquiry.component';
import { ReportPlotComponent } from './components/Plots/report-plot/report-plot.component';
import { ReportBookingComponent } from './components/Booking/report-booking/report-booking.component';
import { ReportLayoutComponent } from './components/report-layout/report-layout.component';
import { ReportRoleComponent } from './components/Role/report-role/report-role.component';
import { GalleryComponent } from './gallery/gallery.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { BookingHistoryComponent } from './components/Booking/booking-history/booking-history.component';
import { SharedModule } from './shared/shared.module';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    EditLayoutComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    ViewLayoutsComponent,
    ViewLayoutComponent,

    //customer
    CreateEnquiryComponent,
    EditEnquiryComponent,
    ListEnquiryComponent,
    ViewEnquiryComponent,
    ReportEnquiryComponent,

    //Booking
    CreateBookingComponent,
    ListBookingComponent,
    EditBookingComponent,
    ReportBookingComponent,

    //Plot
    CreatePlotComponent,
    ListPlotComponent,
    EditPlotComponent,
    ViewPlotComponent,
    ReportPlotComponent,

    //Role
    CreateRoleComponent,
    EditRoleComponent,
    ListRoleComponent,
    ViewRoleComponent,
    ReportRoleComponent,

    ReportLayoutComponent,
    GalleryComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    BookingHistoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    SharedModule,
    ViewBookingComponent
  ],
  providers: [
    provideAnimations()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
