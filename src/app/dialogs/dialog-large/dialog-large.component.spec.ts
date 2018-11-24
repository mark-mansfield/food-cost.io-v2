import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLargeComponent } from './dialog-large.component';

describe('DialogLargeComponent', () => {
  let component: DialogLargeComponent;
  let fixture: ComponentFixture<DialogLargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogLargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
