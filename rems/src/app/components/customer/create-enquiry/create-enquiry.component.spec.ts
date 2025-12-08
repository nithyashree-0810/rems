import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEnquiryComponent } from './create-enquiry.component';

describe('CreateEnquiryComponent', () => {
  let component: CreateEnquiryComponent;
  let fixture: ComponentFixture<CreateEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateEnquiryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
