import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SuppliersService } from '../suppliers.service';
import { GlobalService } from '../../global.service';
import { Subscription } from 'rxjs';
import { Supplier } from '../supplier.model';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.css']
})
export class SuppliersListComponent implements OnInit {
  private suppliersSub: Subscription;
  public suppliers: Supplier[] = [];
  iconBadgeText = '';
  isLoading = false;
  constructor(
    private globalService: GlobalService,
    private supplierService: SuppliersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.supplierService.getSuppliers();
    this.isLoading = true;
    this.suppliersSub = this.supplierService.getSuppliersUpdateListener().subscribe((data: Supplier[]) => {
      this.suppliers = data;
      this.isLoading = false;
    });
  }

  getSupplierBadgeText(supplierName) {
    return this.globalService.getIconBadgeText(supplierName);
  }

  saveSupplierToLocal(supplier) {
    localStorage.setItem('supplier', JSON.stringify(supplier));
    this.router.navigate(['suppliers/' + supplier.id + '/details']);
  }
}
