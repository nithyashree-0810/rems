import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRoleComponent } from './report-role.component';

describe('ReportRoleComponent', () => {
  let component: ReportRoleComponent;
  let fixture: ComponentFixture<ReportRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
