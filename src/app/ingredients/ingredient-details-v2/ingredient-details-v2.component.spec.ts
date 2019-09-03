import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientDetailsV2Component } from './ingredient-details-v2.component';

describe('IngredientDetailsV2Component', () => {
  let component: IngredientDetailsV2Component;
  let fixture: ComponentFixture<IngredientDetailsV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientDetailsV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientDetailsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
