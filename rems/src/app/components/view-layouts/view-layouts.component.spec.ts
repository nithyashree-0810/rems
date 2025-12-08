import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLayoutsComponent } from './view-layouts.component';

describe('ViewLayoutsComponent', () => {
  let component: ViewLayoutsComponent;
  let fixture: ComponentFixture<ViewLayoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewLayoutsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
