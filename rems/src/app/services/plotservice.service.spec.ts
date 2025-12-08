import { TestBed } from '@angular/core/testing';

import { PlotserviceService } from './plotservice.service';

describe('PlotserviceService', () => {
  let service: PlotserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlotserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
