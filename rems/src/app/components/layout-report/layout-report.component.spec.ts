import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutReportComponent } from './layout-report.component';

describe('LayoutReportComponent', () => {
  let component: LayoutReportComponent;
  let fixture: ComponentFixture<LayoutReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
