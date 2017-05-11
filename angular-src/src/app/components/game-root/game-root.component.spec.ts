import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRootComponent } from './game-root.component';

describe('GameRootComponent', () => {
  let component: GameRootComponent;
  let fixture: ComponentFixture<GameRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
