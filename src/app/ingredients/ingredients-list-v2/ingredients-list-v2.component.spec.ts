import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsListV2Component } from './ingredients-list-v2.component';

describe('IngredientsListV2Component', () => {
  let component: IngredientsListV2Component;
  let fixture: ComponentFixture<IngredientsListV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientsListV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientsListV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
