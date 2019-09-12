import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishIngredientsAddComponent } from './dish-ingredients-add.component';

describe('DishIngredientsAddComponent', () => {
  let component: DishIngredientsAddComponent;
  let fixture: ComponentFixture<DishIngredientsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishIngredientsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishIngredientsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
