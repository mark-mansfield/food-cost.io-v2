import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DishService } from '../dish.service';

@Component({
  selector: 'app-dish-create',
  templateUrl: './dish-create.component.html',
  styleUrls: ['./dish-create.component.css']
})
export class DishCreateComponent implements OnInit {
  myForm: FormGroup;
  isLoading = false;
  submitButtonDisabled = true;
  constructor(private service: DishService, private fb: FormBuilder) { }

  ngOnInit() {
    this.isLoading = true;
    this.myForm = this.fb.group({
      dishName: ['', [Validators.required, Validators.minLength(3)]],
      agree: [false]
    });
    this.isLoading = false;
  }

  get name() {
    return this.myForm.get('dishName');
  }

  toggleSubmitDisabled() {
    if (this.submitButtonDisabled) {
      this.submitButtonDisabled = false;
    } else {
      this.submitButtonDisabled = true;
    }
  }

  onSubmitForm() {
    // this.service.addDish(null, this.myForm.get('dishName').value.toLocaleLowerCase());
  }
}
