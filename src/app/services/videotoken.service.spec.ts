import { TestBed } from '@angular/core/testing';

import { VideotokenService } from './videotoken.service';

describe('VideotokenService', () => {
  let service: VideotokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideotokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
