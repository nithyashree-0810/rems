import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Login & Dashboard
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AboutComponent } from './components/about/about.component';

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
import { BookingHistoryComponent } from './components/Booking/booking-history/booking-history.component';

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
import { GalleryComponent } from './gallery/gallery.component';


import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [

  /** Authentication */
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },

  /** Layout Routes */
  { path: 'create-layout', component: LayoutComponent, canActivate: [AuthGuard] },
  { path: 'layouts', component: ViewLayoutsComponent, canActivate: [AuthGuard] },
  { path: 'edit-layout/:layoutName', component: EditLayoutComponent, canActivate: [AuthGuard] },
  { path: 'view-layout/:layoutName', component: ViewLayoutComponent, canActivate: [AuthGuard] },
  { path: 'report-layout', component: ReportLayoutComponent, canActivate: [AuthGuard] },

  /** Booking Routes */
  { path: 'new-booking', component: CreateBookingComponent, canActivate: [AuthGuard] },
  { path: 'booking-history', component: ListBookingComponent, canActivate: [AuthGuard] },
  { path: 'view-booking/:id', component: ViewBookingComponent, canActivate: [AuthGuard] },
  { path: 'edit-booking/:id', component: EditBookingComponent, canActivate: [AuthGuard] },
  { path: 'report-booking', component: ReportBookingComponent, canActivate: [AuthGuard] },

  // History routes
  { path: 'booking-history/plot/:plotId', component: BookingHistoryComponent, canActivate: [AuthGuard] },
  { path: 'booking-history/layout/:layoutId', component: BookingHistoryComponent, canActivate: [AuthGuard] },

  /** Customer / Enquiry Routes */
  { path: 'create-enquiry', component: CreateEnquiryComponent, canActivate: [AuthGuard] },
  { path: 'view-enquiries', component: ListEnquiryComponent, canActivate: [AuthGuard] },
  { path: 'edit-enquiry/:mobileNo', component: EditEnquiryComponent, canActivate: [AuthGuard] },
  { path: 'view-customer/:mobileNo', component: ViewEnquiryComponent, canActivate: [AuthGuard] },
  { path: 'report-enquiry', component: ReportEnquiryComponent, canActivate: [AuthGuard] },

  /** Plot Routes */
  { path: 'create-plot', component: CreatePlotComponent, canActivate: [AuthGuard] },
  { path: 'plots', component: ListPlotComponent, canActivate: [AuthGuard] },
  { path: 'edit-plot/:layoutName/:plotNo', component: EditPlotComponent, canActivate: [AuthGuard] },
  { path: 'view-plot/:layoutName/:plotNo', component: ViewPlotComponent, canActivate: [AuthGuard] },
  { path: 'report-plot', component: ReportPlotComponent, canActivate: [AuthGuard] },

  { path: 'gallery', component: GalleryComponent, canActivate: [AuthGuard] },

  /** Role Routes */
  { path: 'create-role', component: CreateRoleComponent, canActivate: [AuthGuard] },
  { path: 'edit-role/:roleId', component: EditRoleComponent, canActivate: [AuthGuard] },
  { path: 'list-role', component: ListRoleComponent, canActivate: [AuthGuard] },
  { path: 'view-role/:roleId', component: ViewRoleComponent, canActivate: [AuthGuard] },
  { path: 'report-role', component: ReportRoleComponent, canActivate: [AuthGuard] },

  /** 404 Fallback */
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
