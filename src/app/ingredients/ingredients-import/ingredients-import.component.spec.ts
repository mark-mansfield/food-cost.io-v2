import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsImportComponent } from './ingredients-import.component';

describe('IngredientsImportComponent', () => {
  let component: IngredientsImportComponent;
  let fixture: ComponentFixture<IngredientsImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientsImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientsImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
