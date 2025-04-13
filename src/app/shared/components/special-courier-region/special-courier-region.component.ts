import { Component, OnInit } from '@angular/core';
import { SpecialCourierRegion } from '../../../models/SpecialCourierRegion.interface';
import { Courier } from '../../../models/Courier.interface';
import { Region } from '../../../models/Region.Interface ';
import { UnitOfWorkServices } from '../../../core/services/unitOfWork.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-special-courier-region',
  templateUrl: './special-courier-region.component.html',
  styleUrls: ['./special-courier-region.component.css'],
  imports: [FormsModule, CommonModule],
})
export class SpecialCourierRegionComponent implements OnInit {
  specialCourierRegions: SpecialCourierRegion[] = [];
  selectedSpecialCourierRegion: SpecialCourierRegion = this.emptySpecialCourierRegion();
  regions: Region[] = [];
  couriers: Courier[] = [];
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
    this.loadSpecialCourierRegions();
    this.loadRegions();
  }

  // Load all special courier regions
  loadSpecialCourierRegions(): void {
    this.unitOfWork.SpecialCourierRegion.getAllWithPagination(this.PageNumber, this.pageSize).subscribe({
      next: (data) => {
        this.specialCourierRegions = data;
        this.calculateTotalPages();
        this.updatePageNumbers();
      },
      error: (err) => {
        this.toastr.error('Failed to load special courier regions', 'Error');
        console.error(err);
      },
    });
  }

  // Load all regions
  loadRegions(): void {
    this.unitOfWork.Region.getAll().subscribe({
      next: (data) => {
        this.regions = data;
      },
      error: (err) => {
        this.toastr.error('Failed to load regions', 'Error');
        console.error(err);
      },
    });
  }

  // Load couriers for the selected region
  loadCouriersByRegion(regionId: number): void {
    this.unitOfWork.Courier.getCourierByRegion(regionId).subscribe({
      next: (data) => {
        this.couriers = data;
      },
      error: (err) => {
        this.toastr.error('Failed to load couriers for the selected region', 'Error');
        console.error(err);
      },
    });
  }

  // Handle region selection
  onRegionChange(regionId: number): void {
    this.selectedSpecialCourierRegion.courierId = ''; // Reset courier selection
    this.loadCouriersByRegion(regionId);
  }

  // Open the modal for creating a new special courier region
  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedSpecialCourierRegion = this.emptySpecialCourierRegion();
    this.showModal = true;
  }

  // Open the modal for editing an existing special courier region
  openEditModal(specialCourierRegion: SpecialCourierRegion): void {
    this.isEditMode = true;
    this.selectedSpecialCourierRegion = { ...specialCourierRegion };
    this.showModal = true;
  }

  // Close the modal
  closeModal(): void {
    this.showModal = false;
  }

  // Handle form submission
  handleSubmit(): void {
    if (this.isEditMode) {
      this.unitOfWork.SpecialCourierRegion.update(this.selectedSpecialCourierRegion.id, this.selectedSpecialCourierRegion).subscribe({
        next: () => {
          this.toastr.success('Special courier region updated successfully', 'Success');
          this.loadSpecialCourierRegions();
          this.closeModal();
        },
        error: (err) => {
          this.toastr.error('Failed to update special courier region', 'Error');
          console.error(err);
        },
      });
    } else {
      this.unitOfWork.SpecialCourierRegion.create(this.selectedSpecialCourierRegion).subscribe({
        next: () => {
          this.toastr.success('Special courier region added successfully', 'Success');
          this.loadSpecialCourierRegions();
          this.closeModal();
        },
        error: (err) => {
          this.toastr.error('Failed to add special courier region', 'Error');
          console.error(err);
        },
      });
    }
  }

  // Delete a special courier region
  deleteSpecialCourierRegion(id: number): void {
    if (confirm('Are you sure you want to delete this special courier region?')) {
      this.unitOfWork.SpecialCourierRegion.delete(id).subscribe({
        next: () => {
          this.toastr.success('Special courier region deleted successfully', 'Success');
          this.loadSpecialCourierRegions();
        },
        error: (err) => {
          this.toastr.error('Failed to delete special courier region', 'Error');
          console.error(err);
        },
      });
    }
  }

  // Pagination methods
  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }

  private updatePageNumbers(): void {
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
    this.loadSpecialCourierRegions();
  }

  prevPage(): void {
    this.PageNumber = Math.max(1, this.PageNumber - 1);
    this.loadSpecialCourierRegions();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.PageNumber = 1;
    this.loadSpecialCourierRegions();
  }

  // Initialize an empty special courier region
  private emptySpecialCourierRegion(): SpecialCourierRegion {
    return {
      id: 0,
      regionName: '',
      regionId: 0,
      courierId: '',
      courierName: '',
    };
  }
}