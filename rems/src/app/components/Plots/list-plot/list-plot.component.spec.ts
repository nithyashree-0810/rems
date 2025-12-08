import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlotComponent } from './list-plot.component';

describe('ListPlotComponent', () => {
  let component: ListPlotComponent;
  let fixture: ComponentFixture<ListPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListPlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
