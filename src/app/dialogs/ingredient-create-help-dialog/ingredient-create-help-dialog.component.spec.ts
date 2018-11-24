import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientCreateHelpDialogComponent } from './ingredient-create-help-dialog.component';

describe('IngredientCreateHelpDialogComponent', () => {
  let component: IngredientCreateHelpDialogComponent;
  let fixture: ComponentFixture<IngredientCreateHelpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientCreateHelpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientCreateHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
