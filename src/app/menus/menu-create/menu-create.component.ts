import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenusService } from '../menus.service';

@Component({
  selector: 'app-menu-create',
  templateUrl: './menu-create.component.html',
  styleUrls: ['./menu-create.component.css']
})
export class MenuCreateComponent implements OnInit {
  myForm: FormGroup;
  isLoading = false;
  submitButtonDisabled = true;
  constructor(private service: MenusService, private fb: FormBuilder) { }

  ngOnInit() {
    this.isLoading = true;
    this.myForm = this.fb.group({
      menuName: [null, [Validators.required, Validators.minLength(3)]],
      agree: [false]
    });
    this.isLoading = false;
  }

  get name() {
    return this.myForm.get('menuName');
  }

  toggleSubmitDisabled() {
    if (this.submitButtonDisabled) {
      this.submitButtonDisabled = false;
    } else {
      this.submitButtonDisabled = true;
    }
  }

  onSubmitForm() {
    this.service.addMenu(this.myForm.get('menuName').value.toLowerCase());
  }
}
