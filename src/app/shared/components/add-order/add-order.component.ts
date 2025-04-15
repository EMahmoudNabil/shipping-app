import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Merchant } from '../../../models/Merchant .Interface';
import { UnitOfWorkServices } from '../../../core/services/unitOfWork.service';
import { Order } from '../../../models/order.interface';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../models/Role.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { City } from '../../../models/City.interface';
import { Region } from '../../../models/Region.Interface ';
import { Branch } from '../../../models/Branch.Interface';
import { PageHeaderComponent } from "../page-header/page-header.component";

@Component({
  selector: 'app-add-order',
  imports: [CommonModule,
    ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.css'
})
export class AddOrderComponent  implements OnInit {
  orderForm: FormGroup;
  merchants: Merchant[] = [];
  branches: Branch[] = [];
  regions: Region[] = [];
  cities: City[] = [];
  isEmployee = false;

  constructor(
    private fb: FormBuilder,
    private _unitOfWork: UnitOfWorkServices,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.orderForm = this.fb.group({
      orderTypes: ['', Validators.required],
      isOutOfCityShipping: [false, Validators.required],
      shippingId: ['', Validators.required],
      paymentType: ['0', Validators.required],
      branch: ['', Validators.required],
      region: ['', Validators.required],
      city: ['', Validators.required],
      totalWeight: ['', [Validators.required, Validators.min(0.1)]],
      merchantName: [''],
      orderCost: ['', [Validators.required, Validators.min(0.01)]],
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerPhone1: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      customerPhone2: ['', [Validators.pattern(/^01[0125][0-9]{8}$/)]],
      customerAddress: ['', Validators.required],
      customerEmail: ['', [Validators.email]],
      products: this.fb.array([this.createProductFormGroup()])
    });
  }

  ngOnInit(): void {
    this.checkUserRole();
    this.loadInitialData();
  }

  private checkUserRole(): void {
    this._unitOfWork.Employee.getRoles().subscribe((roles: Role[]) => {
      this.isEmployee = roles.some(role => role.roleName === 'Employee');
      if (!this.isEmployee) {
        this.loadCurrentMerchant();
      }
    });
  }

  private loadCurrentMerchant(): void {
    const merchantName = this.authService.getCurrentUser()?.merchantName;
    if (merchantName) {
      this.orderForm.patchValue({ merchantName });
    }
  }

 
  private loadInitialData(): void {
    this._unitOfWork.Branch.getAll().subscribe({
      next: (branches) => this.branches = branches,
      error: (err) => this.showError('فشل تحميل الفروع', err)
    });

    this._unitOfWork.Region.getAll().subscribe({
      next: (regions) => this.regions = regions,
      error: (err) => this.showError('فشل تحميل المناطق', err)
    });

    // this._unitOfWork.City.getAll().subscribe({
    //   next: (cities) => this.cities = cities,
    //   error: (err) => this.showError('فشل تحميل المدن', err)
    // });

    if (this.isEmployee) {
      this._unitOfWork.Merchant.getAll().subscribe({
        next: (merchants) => this.merchants = merchants,
        error: (err) => this.showError('فشل تحميل التجار', err)
      });
    }
  }

  loadCities(regionId: number): void {
    if (!regionId) return;
    this._unitOfWork.City.getByRegionId(regionId).subscribe({
      next: (data) => {
        this.cities = data;
       
      },
      error: (error) => {
        this.toastr.error('فشل تحميل المدن');
      }
    });
  }
  
  onRegionChange(): void {
    const regionId = this.orderForm.get('region')?.value;
    if (regionId) {
      this.loadCities(regionId);
    }
  }
  get products(): FormArray {
    return this.orderForm.get('products') as FormArray;
  }

  createProductFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0.1)]],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  addProduct(): void {
    this.products.push(this.createProductFormGroup());
    this.calculateTotals();
  }

  removeProduct(index: number): void {
    this.products.removeAt(index);
    this.calculateTotals();
  }

  public  calculateTotals(): void {
    const totalWeight = this.products.controls.reduce((acc, product) => {
      return acc + (+product.get('weight')?.value * +product.get('quantity')?.value || 0);
    }, 0);


    const orderCost = this.products.controls.reduce((acc, product) => {
      return acc + (+product.get('weight')?.value * +product.get('quantity')?.value * 10) || 0; // افتراضي 10 جنيه للكيلو
    }, 0);

    this.orderForm.patchValue({
      totalWeight: totalWeight.toFixed(2),
      orderCost: orderCost.toFixed(2)
    });
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.markFormGroupTouched(this.orderForm);
      this.toastr.error('يرجى ملء جميع الحقول المطلوبة بشكل صحيح', 'خطأ');
      return;
    }

    const orderData: Order = {
      ...this.orderForm.value,
      products: this.orderForm.value.products.map((product: any) => ({
        name: product.name,
        weight: product.weight,
        quantity: product.quantity
      }))
    };

    this._unitOfWork.AddOrder.createOrder(orderData).subscribe({
      next: () => {
        this.toastr.success('تم إضافة الطلب بنجاح', 'نجاح');
        this.router.navigate(['/orders']);
      },
      error: (err) => this.showError('فشل إضافة الطلب', err)
    });
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private showError(message: string, error: any): void {
    console.error(error);
    this.toastr.error(message, 'خطأ');
  }}