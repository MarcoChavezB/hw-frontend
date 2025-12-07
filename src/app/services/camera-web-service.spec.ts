import { TestBed } from '@angular/core/testing';

import { CameraWebService } from './camera-web-service';

describe('CameraWebService', () => {
  let service: CameraWebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraWebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
