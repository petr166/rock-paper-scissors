import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingGamesComponent } from './ongoing-games.component';

describe('OngoingGamesComponent', () => {
  let component: OngoingGamesComponent;
  let fixture: ComponentFixture<OngoingGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngoingGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
