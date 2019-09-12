import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { SuppliersService } from '../suppliers.service';
import { GlobalService } from '../../global.service';

import { Supplier } from '../supplier.model';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.css']
})
export class SuppliersListComponent implements OnInit, OnDestroy {

  public suppliers: Supplier[] = [];
  public searchTerm: string;
  public supplierCount: number;
  iconBadgeText = '';
  isLoading = false;
  searchFoundNothing = false;
  noSuppliersFound = false;
  suppliersSub: Subscription;
  noSearchResultsSub: Subscription;
  postsPerPage = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25];


  constructor(
    private globalService: GlobalService,
    private supplierService: SuppliersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.supplierService.getSuppliersAndPaginate(this.pageIndex, this.postsPerPage);
    this.isLoading = true;
    this.suppliersSub = this.supplierService.getSuppliersUpdateListener().subscribe((data) => {
      this.suppliers = data;
      this.isLoading = false;
      this.supplierCount = data.length;
    });

    this.noSearchResultsSub = this.supplierService.getNoSearchResultsUpdatedListener().subscribe(result => {
      this.searchFoundNothing = result;
    });

  }

  search(searchValue) {
    if (searchValue) {
      this.supplierService.searchSupplierByName(searchValue);
    }
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData)
    this.supplierService.paginateOnChange(pageData.pageIndex, pageData.pageSize);
  }

  getSupplierBadgeText(supplierName) {
    return this.globalService.getIconBadgeText(supplierName);
  }

  editSupplier(supplier) {
    this.supplierService.saveLocalSupplierData(supplier)
    this.router.navigate(['suppliers/' + supplier.id + '/details']);
  }

  ngOnDestroy() {
    this.suppliersSub.unsubscribe();
    this.noSearchResultsSub.unsubscribe();
  }
}
