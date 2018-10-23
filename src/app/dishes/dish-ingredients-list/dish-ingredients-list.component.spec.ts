import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishIngredientsListComponent } from './dish-ingredients-list.component';

describe('DishIngredientsListComponent', () => {
  let component: DishIngredientsListComponent;
  let fixture: ComponentFixture<DishIngredientsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishIngredientsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishIngredientsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
