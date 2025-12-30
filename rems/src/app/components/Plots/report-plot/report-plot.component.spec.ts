import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPlotComponent } from './report-plot.component';

describe('ReportPlotComponent', () => {
  let component: ReportPlotComponent;
  let fixture: ComponentFixture<ReportPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportPlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
