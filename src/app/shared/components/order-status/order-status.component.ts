import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnitOfWorkServices } from '../../../core/services/unitOfWork.service';
import { PageHeaderComponent } from "../page-header/page-header.component";
import { RouterModule } from '@angular/router';
import { OrderStatus } from '../../../models/OrderStatus.Interface';
import { OrderWithProductsDto } from '../../../models/order.interface';
import { catchError, finalize, tap } from 'rxjs';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PageHeaderComponent]
})
export class OrderStatusComponent implements OnInit {
  orders: OrderWithProductsDto[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  selectedOrder: OrderWithProductsDto | null = null;
  newStatus: OrderStatus | null = null;
  currentStatus: OrderStatus | null = null;
  searchTerm = '';
  
  // Make OrderStatus enum available to the template
  OrderStatus = OrderStatus;
  
  statusOptions = [
    { value: OrderStatus.Pending, label: 'قيد الانتظار' },
    { value: OrderStatus.WaitingForConfirmation, label: 'في انتظار التأكيد' },
    { value: OrderStatus.InProgress, label: 'قيد التنفيذ' },
    { value: OrderStatus.Delivered, label: 'تم التسليم' },
    { value: OrderStatus.DeliveredToCourier, label: 'تم التسليم للمندوب' },
    { value: OrderStatus.Declined, label: 'مرفوض' },
    { value: OrderStatus.UnreachableCustomer, label: 'لا يمكن الوصول' },
    { value: OrderStatus.PartialDelivery, label: 'تم التسليم جزئياً' },
    { value: OrderStatus.CanceledByRecipient, label: 'تم الإلغاء من المستلم' },
    { value: OrderStatus.DeclinedWithPartialPayment, label: 'مرفوض مع دفع جزئي' },
    { value: OrderStatus.DeclinedWithFullPayment, label: 'مرفوض مع دفع كامل' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private _unitOfWork: UnitOfWorkServices,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    if (this.loading) return; // Prevent multiple simultaneous requests
    
    this.loading = true;
    
    const params = {
      PageNumber: this.currentPage.toString(),
      PageSize: this.pageSize.toString(),
      SearchTerm: this.searchTerm?.trim() || ''
    };

    this._unitOfWork.Order.getOrdersByStatus(this.currentStatus, params)
      .pipe(
        finalize(() => this.loading = false) // Always set loading to false when done
      )
      .subscribe({
        next: (response) => {
          if (response && response.items) {
            this.orders = response.items.map((order: OrderWithProductsDto) => ({
              ...order,
              region: order.region || 'غير محدد',
              city: order.city || 'غير محدد',
              customerInfo: order.customerInfo || '',
              merchantName: order.merchantName || 'غير محدد',
              selected: false
            }));
            this.totalItems = response.totalItems;
            this.totalPages = response.totalPages;
          }
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.toastr.error(this.getErrorMessage(error));
        }
      });
  }

  private getErrorMessage(error: any): string {
    if (error.error?.errors) {
      return Object.values(error.error.errors).join(', ');
    }
    return error.message || 'فشل في تحميل الطلبات';
  }

  filterByStatus(status: OrderStatus | null): void {
    this.currentStatus = status;
    this.currentPage = 1; // Reset to first page
    this.loadOrders();
  }

  onSearch(): void {
    // Reset page when searching
    this.currentPage = 1;
    // Trim search term
    this.searchTerm = this.searchTerm?.trim();
    this.loadOrders();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadOrders();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadOrders();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadOrders();
    }
  }

  onPageSizeChange(event: any): void {
    const newSize = parseInt(event.target.value, 10);
    if (newSize !== this.pageSize) {
      this.pageSize = newSize;
      this.currentPage = 1; // Reset to first page
      this.loadOrders();
    }
  }

  getStatusLabel(status: string | OrderStatus): string {
    // Handle both string and enum types
    let statusValue: OrderStatus;
    
    if (typeof status === 'string') {
      // Convert string status to enum value
      statusValue = this.convertStatusToEnum(status);
    } else {
      statusValue = status;
    }
    
    const option = this.statusOptions.find(opt => opt.value === statusValue);
    return option ? option.label : 'غير معروف';
  }
  
  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  extractCustomerInfo(order: any, type: 'name' | 'phone'): string {
    if (!order.customerInfo) return 'غير محدد';
    
    const parts = order.customerInfo.split(' ');
    if (parts.length < 2) return 'غير محدد';

    return type === 'name' ? parts[0] : parts[1];
  }

  getDisplayValue(value: any, defaultValue: string = 'غير محدد'): string {
    return value || defaultValue;
  }

  // Convert string status to enum
  private convertStatusToEnum(status: string): OrderStatus {
    switch(status) {
      case 'Pending': return OrderStatus.Pending;
      case 'WaitingForConfirmation': return OrderStatus.WaitingForConfirmation;
      case 'InProgress': return OrderStatus.InProgress;
      case 'Delivered': return OrderStatus.Delivered;
      case 'Declined': return OrderStatus.Declined;
      case 'DeliveredToCourier': return OrderStatus.DeliveredToCourier;
      case 'UnreachableCustomer': return OrderStatus.UnreachableCustomer;
      case 'PartialDelivery': return OrderStatus.PartialDelivery;
      case 'CanceledByRecipient': return OrderStatus.CanceledByRecipient;
      case 'DeclinedWithPartialPayment': return OrderStatus.DeclinedWithPartialPayment;
      case 'DeclinedWithFullPayment': return OrderStatus.DeclinedWithFullPayment;
      default: return OrderStatus.Pending;
    }
  }

  getStatusClass(status: OrderStatus): string {
    switch(status) {
      case OrderStatus.Pending: return 'btn-warning';
      case OrderStatus.WaitingForConfirmation: return 'btn-info';
      case OrderStatus.InProgress: return 'btn-primary';
      case OrderStatus.Delivered: return 'btn-success';
      case OrderStatus.Declined: return 'btn-danger';
      case OrderStatus.DeliveredToCourier: return 'btn-secondary';
      case OrderStatus.UnreachableCustomer: return 'btn-info';
      case OrderStatus.PartialDelivery: return 'btn-danger';
      case OrderStatus.CanceledByRecipient: return 'btn-warning';
      case OrderStatus.DeclinedWithPartialPayment: return 'btn-warning';
      case OrderStatus.DeclinedWithFullPayment: return 'btn-warning';
      default: return 'btn-secondary';
    }
  }

  getStatusButtonClass(status: OrderStatus): string {
    if (this.newStatus === status) {
      return this.getStatusClass(status);
    }
    return 'btn-outline-secondary';
  }

  selectStatus(status: OrderStatus): void {
    this.newStatus = status;
  }

  openStatusModal(order: OrderWithProductsDto): void {
    this.selectedOrder = {...order}; // Create a copy to avoid direct mutation
    this.newStatus = order.status; // Set initial status to current status
  }

  closeStatusModal(): void {
    this.selectedOrder = null;
    this.newStatus = null;
  }

  updateOrderStatus(): void {
    if (!this.selectedOrder || this.newStatus === null || this.newStatus === undefined) {
      this.toastr.error('الرجاء اختيار حالة جديدة');
      return;
    }

    // Create a copy of the order with only the necessary fields
    const updatedOrder: OrderWithProductsDto = {
      ...this.selectedOrder,
      status: this.newStatus
    };

    this.loading = true;

    this._unitOfWork.Order.updateOrder(updatedOrder)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          this.toastr.success('تم تحديث حالة الطلب بنجاح');
          this.loadOrders(); // Reload all orders to reflect changes
          this.closeStatusModal();
        },
        error: (error) => {
          console.error('Update status error:', error);
          this.toastr.error(this.getErrorMessage(error) || 'فشل في تحديث حالة الطلب');
        }
      });
  }

  selectAllOrders(event: any): void {
    const checked = event.target.checked;
    this.orders.forEach(order => order.selected = checked);
  }

  exportToPDF(): void {
    // Implement PDF export functionality
    this.toastr.info('جاري تصدير PDF...');
  }

  exportToExcel(): void {
    // Implement Excel export functionality
    this.toastr.info('جاري تصدير Excel...');
  }

  deleteOrder(id: number): void {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا الطلب؟')) {
      this.loading = true;
      
      this._unitOfWork.Order.deleteOrder(id)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: () => {
            this.toastr.success('تم حذف الطلب بنجاح');
            this.loadOrders();
          },
          error: (error) => {
            console.error('Failed to delete order:', error);
            this.toastr.error(this.getErrorMessage(error) || 'فشل في حذف الطلب');
          }
        });
    }
  }

  printOrder(id: number): void {
    // Implement print functionality
    this.toastr.info('جاري تحضير الطباعة...');
    // You would typically open a new window or generate a print view here
  }
}