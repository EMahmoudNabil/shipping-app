import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UnitOfWorkServices } from '../../../core/services/unitOfWork.service';
import { ToastrService } from 'ngx-toastr';
import { OrderStatus } from '../../../models/OrderStatus.Interface';
import { OrderWithProductsDto, OrderProduct } from '../../../models/order.interface';
import { tap, catchError, finalize } from 'rxjs/operators';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { Branch } from '../../../models/Branch.Interface';
import { City } from '../../../models/City.interface';
import { Region } from '../../../models/Region.Interface ';


@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PageHeaderComponent
  ]
})
export class EditOrderComponent implements OnInit {
  orderId: number;
  orderForm!: FormGroup;
  loading = false;
  branches: Branch[] = [];
  regions: Region[] = [];
  cities: City[] = [];
  
  statusOptions = [
    { value: OrderStatus.Pending, label: 'قيد الانتظار' },
    { value: OrderStatus.WaitingForConfirmation, label: 'في انتظار التأكيد' },
    { value: OrderStatus.InProgress, label: 'قيد التنفيذ' },
    { value: OrderStatus.Delivered, label: 'تم التوصيل' },
    { value: OrderStatus.Declined, label: 'مرفوض' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _unitOfWork: UnitOfWorkServices,
    private toastr: ToastrService
  ) {
    this.orderId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    this.initForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.loadOrder();
  }

  private initForm(): void {
    this.orderForm = this.fb.group({
      orderTypes: [0, Validators.required],
      isOutOfCityShipping: [false],
      shippingId: [0, Validators.required],
      paymentType: [0, Validators.required],
      status: [OrderStatus.Pending, Validators.required],
      branch: ['', Validators.required],
      region: ['', Validators.required],
      city: ['', Validators.required],
      totalWeight: [0, [Validators.required, Validators.min(0.1)]],
      merchantName: ['', Validators.required],
      orderCost: [0, [Validators.required, Validators.min(0.01)]],
      customerInfo: ['', Validators.required],
      products: this.fb.array([])
    });
  }

  private loadOrder(): void {
    this.loading = true;
    this._unitOfWork.Order.getOrderById(this.orderId)
      .pipe(
        tap((order: OrderWithProductsDto) => {
          this.patchOrderForm(order);
        }),
        catchError(error => {
          this.handleError('فشل في تحميل الطلب', error);
          throw error;
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe();
  }

  private patchOrderForm(order: OrderWithProductsDto): void {
    this.orderForm.patchValue({
      orderTypes: order.orderTypes,
      isOutOfCityShipping: order.isOutOfCityShipping,
      shippingId: order.shippingId,
      paymentType: order.paymentType,
      status: order.status,
      branch: order.branch,
      region: order.region,
      city: order.city,
      totalWeight: order.totalWeight,
      merchantName: order.merchantName,
      orderCost: order.orderCost,
      customerInfo: order.customerInfo
    });

    // Clear and add products
    this.products.clear();
    order.products?.forEach(product => this.addProduct(product));
  }

  addProduct(product?: OrderProduct): void {
    const productForm = this.fb.group({
      name: [product?.name || '', Validators.required],
      weight: [product?.weight || 0, [Validators.required, Validators.min(0.1)]],
      quantity: [product?.quantity || 1, [Validators.required, Validators.min(1)]]
    });

    this.products.push(productForm);
    this.calculateTotals();
  }

  removeProduct(index: number): void {
    this.products.removeAt(index);
    this.calculateTotals();
  }

  private calculateTotals(): void {
    const totalWeight = this.products.controls.reduce((acc, product) => {
      return acc + (+product.get('weight')?.value * +product.get('quantity')?.value || 0);
    }, 0);

    this.orderForm.patchValue({ totalWeight: totalWeight.toFixed(2) });
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.toastr.error('يرجى التحقق من صحة البيانات المدخلة');
      return;
    }

    const orderData: OrderWithProductsDto = {
      ...this.orderForm.value,
      id: this.orderId
    };

    this._unitOfWork.Order.updateOrder(orderData)
      .pipe(
        tap(() => {
          this.toastr.success('تم تحديث الطلب بنجاح');
          this.router.navigate(['/orders']);
        }),
        catchError(error => {
          this.handleError('فشل في تحديث الطلب', error);
          throw error;
        })
      )
      .subscribe();
  }

  private loadInitialData(): void {
    this.loading = true;
    Promise.all([
      this._unitOfWork.Branch.getAll().toPromise(),
      this._unitOfWork.Region.getAll().toPromise()
    ])
      .then(([branches, regions]) => {
        this.branches = branches || [];
        this.regions = regions|| [];
      })
      .catch(error => {
        this.handleError('فشل في تحميل البيانات الأساسية', error);
      })
      .finally(() => (this.loading = false));
  }

  onRegionChange(): void {
    const regionId = this.orderForm.get('region')?.value;
    if (!regionId) return;

    this._unitOfWork.City.getByRegionId(regionId).subscribe({
      next: cities => {
        this.cities = cities;
        if (this.cities.length === 0) {
          this.toastr.warning('لا توجد مدن في هذه المنطقة');
        }
      },
      error: error => {
        this.handleError('فشل في تحميل المدن', error);
      }
    });
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.toastr.error(message);
  }

  get products(): FormArray {
    return this.orderForm.get('products') as FormArray;
  }
}