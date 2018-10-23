import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishIngredientsEditComponent } from './dish-ingredients-edit.component';

describe('DishIngredientsEditComponent', () => {
  let component: DishIngredientsEditComponent;
  let fixture: ComponentFixture<DishIngredientsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishIngredientsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishIngredientsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
