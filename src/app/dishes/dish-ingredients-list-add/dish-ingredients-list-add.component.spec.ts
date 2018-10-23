import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishIngredientsListAddComponent } from './dish-ingredients-list-add.component';

describe('DishIngredientsListAddComponent', () => {
  let component: DishIngredientsListAddComponent;
  let fixture: ComponentFixture<DishIngredientsListAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishIngredientsListAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishIngredientsListAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
