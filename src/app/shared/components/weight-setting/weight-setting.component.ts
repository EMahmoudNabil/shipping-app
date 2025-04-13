import { Component, OnInit } from '@angular/core';
import { WeightSetting } from '../../../models/WeightSetting.interface';
import { UnitOfWorkServices } from '../../../core/services/unitOfWork.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-weight-setting',
  templateUrl: './weight-setting.component.html',
  styleUrls: ['./weight-setting.component.css'],
  imports: [FormsModule, CommonModule],
})
export class WeightSettingComponent implements OnInit {
  weightSettings: WeightSetting[] = [];
  selectedWeightSetting: WeightSetting = this.emptyWeightSetting();
  showModal = false;
  isEditMode = false;

  // Pagination properties
  PageNumber: number = 1;
  pageSize: number = 10;
  pages: number[] = [];
  totalItems: number = 0;
  totalPages: number = 1;

  constructor(
    private unitOfWork: UnitOfWorkServices,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadWeightSettings();
  }

  loadWeightSettings(): void {
    this.unitOfWork.WeightSetting.getAllWithPagination(this.PageNumber, this.pageSize).subscribe({
      next: (data) => {
        this.weightSettings = data;
        this.calculateTotalPages();
        this.updatePageNumbers();
      },
      error: (err) => {
        this.toastr.error('Failed to load weight settings', 'Error');
        console.error(err);
      },
    });
  }

  // Pagination methods
  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }

  updatePageNumbers(): void {
    this.pages = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, this.PageNumber - Math.floor(maxVisiblePages / 2));
    let end = start + maxVisiblePages - 1;

    start = Math.max(1, start);
    for (let i = start; i <= end; i++) {
      this.pages.push(i);
    }
  }

  nextPage(): void {
    this.PageNumber++;
    this.loadWeightSettings();
  }

  prevPage(): void {
    this.PageNumber = Math.max(1, this.PageNumber - 1);
    this.loadWeightSettings();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.PageNumber = 1;
    this.loadWeightSettings();
  }

  // Modal methods
  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedWeightSetting = this.emptyWeightSetting();
    this.showModal = true;
  }

  openEditModal(weightSetting: WeightSetting): void {
    this.isEditMode = true;
    this.selectedWeightSetting = { ...weightSetting };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  handleSubmit(): void {
    if (this.isEditMode) {
      this.unitOfWork.WeightSetting.update(this.selectedWeightSetting.id, this.selectedWeightSetting).subscribe({
        next: () => {
          this.toastr.success('Weight setting updated successfully', 'Success');
          this.loadWeightSettings();
          this.closeModal();
        },
        error: (err) => {
          this.toastr.error('Failed to update weight setting', 'Error');
          console.error(err);
        },
      });
    } else {
      this.unitOfWork.WeightSetting.create(this.selectedWeightSetting).subscribe({
        next: () => {
          this.toastr.success('Weight setting added successfully', 'Success');
          this.loadWeightSettings();
          this.closeModal();
        },
        error: (err) => {
          this.toastr.error('Failed to add weight setting', 'Error');
          console.error(err);
        },
      });
    }
  }

  deleteWeightSetting(id: number): void {
    if (confirm('Are you sure you want to delete this weight setting?')) {
      this.unitOfWork.WeightSetting.delete(id).subscribe({
        next: () => {
          this.toastr.success('Weight setting deleted successfully', 'Success');
          this.loadWeightSettings();
        },
        error: (err) => {
          this.toastr.error('Failed to delete weight setting', 'Error');
          console.error(err);
        },
      });
    }
  }

  private emptyWeightSetting(): WeightSetting {
    return {
      id: 0,
      minWeight: 0,
      maxWeight: 0,
      costPerKg: 0,
      createdAt: new Date().toISOString(),
    };
  }
}