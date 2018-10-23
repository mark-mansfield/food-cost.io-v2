import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientEditFieldComponent } from './ingredient-edit-field.component';

describe('IngredientEditFieldComponent', () => {
  let component: IngredientEditFieldComponent;
  let fixture: ComponentFixture<IngredientEditFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientEditFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientEditFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
