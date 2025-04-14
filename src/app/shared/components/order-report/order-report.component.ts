import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrderReport } from '../../../models/OrderReport.Interface';
import { OrderReportService } from '../../../core/services/OrderReport.Service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ],
})
export class OrderReportComponent implements OnInit {
  orderReports: OrderReport[] = [];
  statuses: string[] = ['Pending', 'Completed', 'Cancelled']; // Example statuses
  filters = { status: '', startDate: '', endDate: '' }; // Filter object
  PageNumber: number = 1;
  pageSize: number = 10;
  pages: number[] = [];
  totalItems: number = 0;
  totalPages: number = 1;

  constructor(
    private toastr: ToastrService,
    private orderReportService: OrderReportService
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    const params = {
      PageNumber: this.PageNumber,
      PageSize: this.pageSize,
      Status: this.filters.status,
      StartDate: this.filters.startDate,
      EndDate: this.filters.endDate,
    };

    this.orderReportService.getAllWithPagination(params).subscribe({
      next: (response: any) => {
        this.orderReports = response.data || response;
        this.totalItems = response.totalCount || 0;
        this.calculateTotalPages();
        this.updatePageNumbers();
      },
      error: () => {
        this.toastr.error('حدث خطأ أثناء تحميل التقارير');
      },
    });
  }

  filterReports(): void {
    this.PageNumber = 1; // Reset to the first page
    this.loadReports();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  updatePageNumbers(): void {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  nextPage(): void {
    if (this.PageNumber < this.totalPages) {
      this.PageNumber++;
      this.loadReports();
    }
  }

  prevPage(): void {
    if (this.PageNumber > 1) {
      this.PageNumber--;
      this.loadReports();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.PageNumber = page;
      this.loadReports();
    }
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.PageNumber = 1;
    this.loadReports();
  }
}