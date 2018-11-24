import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, RequiredValidator } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IngredientsService } from '../ingredients.service';
import { mimeType } from '../ingredients-import/mime-type.validator';
import { Subscription } from 'rxjs';
import { MatStepper, MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { Ingredient } from '../ingredient.model';
import { DialogLargeComponent } from '../../dialogs/dialog-large/dialog-large.component';
import { v4 as uuid } from 'uuid';
@Component({
  selector: 'app-ingredients-import',
  templateUrl: './ingredients-import.component.html',
  styleUrls: ['./ingredients-import.component.css']
})
export class IngredientsImportComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  name = '';
  filename = '';
  message = '';
  step = 0;
  public colName;
  islinear = false;
  isLoading = false;
  hasData = false;
  showTick = false;
  form: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  importDataSub: Subscription;
  file: any;
  uploadedData: any;
  fileData: any;
  columnKeys: any;

  previewDataSource = [];
  previewDisplayColumn = ['title'];
  reviewTableDataSource: any;
  reviewDataDisplayedColumnDefs: string[] = [
    'ingredient_name',
    'ingredient_price',
    'purchase_amount',
    'category',
    'supplier'
  ];
  reviewTableData = new MatTableDataSource<Ingredient>(this.reviewTableDataSource);

  reviewTableColumnData = [];

  // because once a user slects a column name it must
  // become disabled to avoid duplicate column names
  public modelProps = {
    select_a_column: true,
    ingredient_name: false,
    ingredient_price: false,
    unit_amount: false,
    purchase_amount: false,
    unit_type: false,
    supplier: false,
    category: false,
    sub_category: false
  };

  constructor(
    private _formBuilder: FormBuilder,
    private ingredientsService: IngredientsService,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.reviewTableDataSource = [];
    this.uploadedData = [];
    this.reviewTableData.paginator = this.paginator;
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: ['', Validators.required]
    });
    this.fifthFormGroup = this._formBuilder.group({
      fifthCtrl: ['', Validators.required]
    });
    this.sixthFormGroup = this._formBuilder.group({
      sixthCtrl: ['', Validators.required]
    });

    this.form = new FormGroup({
      file: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      submit: new FormControl(null)
    });

    this.columnKeys = Object.entries(this.modelProps);

    // review table column data
    this.columnKeys.forEach(item => {
      this.reviewTableColumnData.push(item[0]);
    });
    this.reviewTableColumnData.shift();

    // listen for changes
    this.importDataSub = this.ingredientsService.getIngredientsImportDataUpdateListener().subscribe(data => {
      if (data) {
        const previewColData = [];
        this.uploadedData = data;
        this.message = 'click next to continue';
        this.hasData = true;
        this.uploadedData.forEach(item => {
          previewColData.push(item.slice(0, 5));
        });
        this.previewDataSource = previewColData;
        // create ingredient objects
        this.reviewTableDataSource = [];
        this.uploadedData[0].forEach(el => {
          const object: Ingredient = {
            id: uuid(),
            hash_key: '',
            ingredient_name: '',
            ingredient_price: '',
            unit_amount: '',
            purchase_amount: '',
            unit_type: '',
            supplier: '',
            category: '',
            sub_category: ''
          };
          // update the variable
          this.reviewTableDataSource.push(object);
          //  add teh variable to the MattableDataSource.data property
          this.reviewTableData.data = this.reviewTableDataSource;
        });
      }
      console.log('Review table data source::');
      console.log(this.reviewTableDataSource);
    });
  }

  // open dialog
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogLargeComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      switch (result) {
        case 'overwrite':
          console.log('overwriting exisitng items and adding new items');
          this.overWriteDupedIngredThenImport();
          break;
        default:
          console.log('removeing duplicates only adding new items');
          this.removeDupeIngredientsThenImport();
          break;
      }
    });
  }

  // check for dupes in import and current data
  onCheckForDupes() {
    const hasDupes = this.ingredientsService.hasDupes(this.reviewTableDataSource);
    return hasDupes;
  }

  // merge all import and existing ingredients together
  mergeIngredients() {
    const ingredientsDoc = this.ingredientsService.loadLocalIngredientsData();
    this.reviewTableDataSource.forEach(item => {
      ingredientsDoc.ingredients.push(item);
    });
    return ingredientsDoc;
  }

  // adds new data to old data then imports
  mergeThenImport() {
    const ingredientsDocMerged = this.mergeIngredients();
    this.ingredientsService.importIngredients(ingredientsDocMerged);
  }

  // keeps existing and adds new
  removeDupeIngredientsThenImport() {
    const ingredientsDoc = this.mergeIngredients();
    ingredientsDoc.ingredients = this.ingredientsService.removeDuplicateIngredients(ingredientsDoc.ingredients);
    this.ingredientsService.importIngredients(ingredientsDoc);
  }

  // overwrites exisiting ingredients and adds new ingredients
  overWriteDupedIngredThenImport() {
    const ingredientsDoc = this.ingredientsService.overwriteAndAddNewIngredients(this.reviewTableDataSource);
    this.ingredientsService.importIngredients(ingredientsDoc);
  }

  onImport() {
    //  perform dupe checking and upload
    if (this.onCheckForDupes()) {
      this.openDialog();
    } else {
      // just import the data direct
      this.mergeThenImport();
    }
  }
  //  bind selected column name property to ingredient import column
  setColumnName(colNum, idx) {
    //  so we can't select a column name twice from the select list
    this.columnKeys[idx][1] = true;
    // bind property selected column name to the users column data
    const propertyName = this.columnKeys[idx][0];
    let addNameToHashKey = false;
    let addSupplierToHashKey = false;
    switch (propertyName) {
      case 'ingredient_name':
        // add name to hash key
        addNameToHashKey = true;
        break;
      case 'supplier':
        // add supplier to hash key
        addSupplierToHashKey = true;
        break;
      default:
        break;
    }
    this.uploadedData[colNum].forEach((item, index) => {
      if (addNameToHashKey) {
        this.reviewTableDataSource[index].hash_key = item;
      }
      if (addSupplierToHashKey) {
        this.reviewTableDataSource[index].hash_key += '**' + item;
      }

      this.reviewTableDataSource[index][propertyName] = item;
    });
    console.log(this.reviewTableDataSource);
    this.stepper.selected.completed = true;
  }

  // get the file and validate it
  onFilePicked(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ file: this.file });
    const extension = this.file.name.split('.')[1];

    // check file extension here and show an error.
    // we do a deeper validation in the mimetype middlewear 'validators: [Validators.required],'
    if (extension !== 'csv') {
      this.message = `Invalid file type: \r\n ${this.file.name}  selected`;
      console.log(this.file);
    } else {
      this.message = this.file.name;
      this.showTick = true;
    }

    // inform angular that we have updated the file form control value
    this.form.get('file').updateValueAndValidity();
  }

  // upload selected file
  onSubmit() {
    if (this.form.invalid) {
      this.message = 'invalid file selected';
    } else {
      this.showTick = false;
      this.isLoading = true;
      this.fileData = this.form.value.file;
      this.ingredientsService.uploadFile(this.fileData);
      this.stepper.selected.completed = true;
      this.form.reset();
      this.stepper.next();
    }
  }
}
