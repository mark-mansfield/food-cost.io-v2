import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DishService } from '../dish.service';
import { Dish } from '../dish.model';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrls: ['./edit-field.component.css']
})
export class EditFieldComponent implements OnInit {
  public dish: Dish;
  public field_value: string;
  private field: string;
  private id: string;
  public field_type: string;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private dishService: DishService
  ) {}

  ngOnInit() {
    this.field = this.route.snapshot.paramMap.get('field_name');
    this.id = this.route.snapshot.paramMap.get('_id');
    this.field_type = this.route.snapshot.paramMap.get('field_type');
    if (this.id) {
      this.dish = JSON.parse(localStorage.getItem('dish'));
      this.field_value = this.dish[this.field];
      console.log(this.field_value);
    } else {
      console.log('no id sent');
    }
  }

  upDateDish() {
    this.dish[this.field] = this.field_value;
    console.log(this.dish);
    this.dishService.updateDish(this.dish, this.field_value);
    this.router.navigate(['/dish/' + this.dish._id]);
  }
}
