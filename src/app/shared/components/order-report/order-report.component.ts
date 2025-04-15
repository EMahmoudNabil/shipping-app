import { Component, OnInit } from '@angular/core';
import { OrderReportService } from '../../../core/services/order-report.service';
import { ToastrService } from 'ngx-toastr';
import { OrderReport } from '../../../models/OrderReport.Interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.css'],
  imports: [FormsModule,CommonModule],
  standalone: true,
})
export class OrderReportComponent implements OnInit {
  orderReports: OrderReport[] = []; // Initialize as an empty array
  orderStatuses = [
    { value: 'WaitingForConfirmation', label: 'في انتظار التأكيد' },
    { value: 'Pending', label: 'قيد الانتظار' },
    { value: 'InProgress', label: 'قيد التنفيذ' },
    { value: 'Delivered', label: 'تم التسليم' },
    { value: 'Cancelled', label: 'تم الإلغاء' },
    { value: 'Declined', label: 'مرفوض' },
  ];
  filters = {
    orderStatus: '',
    startDate: '',
    endDate: '',
  };
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;
  loading: boolean | undefined;
  error: boolean | undefined;

  constructor(
    private orderReportService: OrderReportService,
    private toastr: ToastrService,
  ) {}
  sortReportsByDate(order: 'asc' | 'desc'): void {
    this.orderReports.sort((a, b) => {
      const dateA = new Date(a.reportDate).getTime();
      const dateB = new Date(b.reportDate).getTime();
  
      if (order === 'asc') {
        return dateA - dateB; // Ascending order
      } else {
        return dateB - dateA; // Descending order
      }
    });
  }
  ngOnInit(): void {
    this.loadReports();
  }
  loadReports(): void {
    this.loading = true;
    this.error = false;
    
    this.orderReportService
      .getOrderReports(this.pageNumber, this.pageSize, this.filters)
      .subscribe({
        next: (response) => {
          this.orderReports = Array.isArray(response) ? response : [];
          this.totalPages = this.calculateTotalPages(this.orderReports.length);
          this.loading = false;
          this.filterAndSortReports();
        },
        error: (error) => {
          console.error('API Error:', error);
          this.error = true;
          this.loading = false;
          this.toastr.error('فشل تحميل التقارير');
        },
      });
  }
  // Helper method to calculate total pages if not provided by API
  calculateTotalPages(totalItems: number): number {
    return Math.ceil(totalItems / this.pageSize) || 1;
  }

  searchReports(): void {
    this.pageNumber = 1;
    this.loadReports();
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadReports();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadReports();
    }
  }
  filterAndSortReports(): void {
    const startDate = this.filters.startDate ? new Date(this.filters.startDate).setHours(0, 0, 0, 0) : null;
    const endDate = this.filters.endDate ? new Date(this.filters.endDate).setHours(23, 59, 59, 999) : null;
    this.orderReports = this.orderReports
      .filter((report) => {
        const reportDate = new Date(report.reportDate).getTime();
        if (startDate && reportDate < startDate) {
          return false; 
        }
        if (endDate && reportDate > endDate) {
          return false; 
        }
        return true; 
      })
      .sort((a, b) => {
        const dateA = new Date(a.reportDate).getTime();
        const dateB = new Date(b.reportDate).getTime();
        return dateA - dateB; 
      });
  } 
}