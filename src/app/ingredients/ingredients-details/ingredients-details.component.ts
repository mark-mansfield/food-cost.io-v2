import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { IngredientsService } from '../ingredients.service';
import { Ingredient } from '../ingredient.model';

@Component({
  selector: 'app-ingredients-details',
  templateUrl: './ingredients-details.component.html',
  styleUrls: ['./ingredients-details.component.css']
})


export class IngredientsDetailsComponent implements OnInit {

  public hasData = false;
  public selectedId: string;
  public ingredient: Ingredient;

  public name: string;
  public price: string;
  public unit_amount: string;
  public unit_type: string;
  public supplier: string;
  public category: string;
  public sub_category: string;

  constructor(private route: ActivatedRoute, private router: Router, private service: IngredientsService) { }

  ngOnInit() {
    this.ingredient = JSON.parse(localStorage.getItem('ingredient'));
    this.hasData = true;
    console.log(this.ingredient);
  }

}
