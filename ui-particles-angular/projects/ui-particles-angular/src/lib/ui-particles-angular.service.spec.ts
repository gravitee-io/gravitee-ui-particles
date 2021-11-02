import { TestBed } from '@angular/core/testing';

import { UiParticlesAngularService } from './ui-particles-angular.service';

describe('UiParticlesAngularService', () => {
  let service: UiParticlesAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiParticlesAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
