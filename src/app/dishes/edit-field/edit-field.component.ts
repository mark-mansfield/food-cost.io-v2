import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DishService } from '../dish.service';
import { Dish } from '../dish.model';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrls: ['./edit-field.component.css']
})
export class EditFieldComponent implements OnInit {
  public dish: Dish;
  public field_value: string;
  isLoading = false;
  public field: string;
  private id: string;
  public field_type: string;
  nameFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  nameValue = '';

  constructor(private route: ActivatedRoute, public router: Router, private dishService: DishService) {}

  ngOnInit() {
    this.isLoading = true;
    this.field = this.route.snapshot.paramMap.get('field_name');
    this.id = this.route.snapshot.paramMap.get('_id');
    // this.field_type = this.route.snapshot.paramMap.get('field_type');
    if (this.id) {
      this.dish = JSON.parse(localStorage.getItem('dish'));
      this.field_value = this.dish[this.field];
      this.isLoading = false;
    } else {
      console.log('no id sent');
    }
  }

  onUpDateDish() {
    this.dish[this.field] = this.nameValue;
    console.log(this.field);
    this.dishService.updateDish(this.dish, this.field_value);
    this.router.navigate(['/dish/' + this.dish._id]);
  }
}
