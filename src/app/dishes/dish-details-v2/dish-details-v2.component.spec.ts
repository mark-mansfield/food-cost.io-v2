import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishDetailsV2Component } from './dish-details-v2.component';

describe('DishDetailsV2Component', () => {
  let component: DishDetailsV2Component;
  let fixture: ComponentFixture<DishDetailsV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishDetailsV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishDetailsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
