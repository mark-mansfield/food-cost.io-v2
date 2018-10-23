import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedOutPageComponent } from './logged-out-page.component';

describe('LoggedOutPageComponent', () => {
  let component: LoggedOutPageComponent;
  let fixture: ComponentFixture<LoggedOutPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggedOutPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedOutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
