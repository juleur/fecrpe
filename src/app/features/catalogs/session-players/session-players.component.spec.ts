import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPlayersComponent } from './session-players.component';

describe('SessionPlayersComponent', () => {
  let component: SessionPlayersComponent;
  let fixture: ComponentFixture<SessionPlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionPlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
