import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumpadDialogComponent } from './numpad-dialog.component';

describe('NumpadDialogComponent', () => {
  let component: NumpadDialogComponent;
  let fixture: ComponentFixture<NumpadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumpadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumpadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
