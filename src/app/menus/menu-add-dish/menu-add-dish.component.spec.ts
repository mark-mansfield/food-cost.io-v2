import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAddDishComponent } from './menu-add-dish.component';

describe('MenuAddDishComponent', () => {
  let component: MenuAddDishComponent;
  let fixture: ComponentFixture<MenuAddDishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuAddDishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuAddDishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
