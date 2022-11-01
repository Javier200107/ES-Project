import { TestBed } from '@angular/core/testing';

import { HomeFeedService } from './home-feed.service';

describe('HomeFeedService', () => {
  let service: HomeFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
