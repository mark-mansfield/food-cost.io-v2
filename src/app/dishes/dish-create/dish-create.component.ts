import { Component} from '@angular/core';
import { DishService } from '../dish.service';
import { Dish } from '../dish.model';
@Component({
  selector: 'app-dish-create',
  templateUrl: './dish-create.component.html',
  styleUrls: ['./dish-create.component.css']
})
export class DishCreateComponent {

  dishName = '';

  constructor(  private service: DishService ) { }

  onAddDish() {

    console.log(this.dishName);
    this.service.addDish(null, this.dishName.toLocaleLowerCase());

  }
}
