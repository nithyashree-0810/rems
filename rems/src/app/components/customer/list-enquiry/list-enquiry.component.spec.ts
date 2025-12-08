import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEnquiryComponent } from './list-enquiry.component';

describe('ListEnquiryComponent', () => {
  let component: ListEnquiryComponent;
  let fixture: ComponentFixture<ListEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListEnquiryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
