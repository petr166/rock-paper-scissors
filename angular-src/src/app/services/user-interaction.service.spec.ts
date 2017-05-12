import { TestBed, inject } from '@angular/core/testing';

import { UserInteractionService } from './user-interaction.service';

describe('UserInteractionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserInteractionService]
    });
  });

  it('should ...', inject([UserInteractionService], (service: UserInteractionService) => {
    expect(service).toBeTruthy();
  }));
});
