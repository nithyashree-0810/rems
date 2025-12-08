import { TestBed } from '@angular/core/testing';

import { LayoutserviceService } from './layoutservice.service';

describe('LayoutserviceService', () => {
  let service: LayoutserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
