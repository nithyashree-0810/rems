import { TestBed } from '@angular/core/testing';

import { RoleserviceServiceService } from './roleservice.service.service';

describe('RoleserviceServiceService', () => {
  let service: RoleserviceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleserviceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
