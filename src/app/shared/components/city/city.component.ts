import { Component, OnInit } from '@angular/core';
import { City } from '../../../models/City.interface';
import { Region } from '../../../models/Region.Interface ';
import { UnitOfWorkServices } from '../../../core/services/unitOfWork.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css'],
  imports: [FormsModule, CommonModule],
})
export class CityComponent implements OnInit {
  cities: City[] = [];
  selectedCity: Partial<City> = this.emptyCity();
  regions: Region[] = [];
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
    this.loadCities();
    this.loadRegions();
  }

  // Load all cities
  loadCities(): void {
    this.unitOfWork.City.getAllWithPagination(this.PageNumber, this.pageSize).subscribe({
      next: (data) => {
        this.cities = data;
        this.calculateTotalPages();
        this.updatePageNumbers();
      },
      error: (err) => {
        this.toastr.error('Failed to load cities', 'Error');
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

  // Open the modal for creating a new city
  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedCity = this.emptyCity();
    this.showModal = true;
  }

  // Open the modal for editing an existing city
  openEditModal(city: City): void {
    this.isEditMode = true;
    this.selectedCity = { ...city };
    this.showModal = true;
  }

  // Close the modal
  closeModal(): void {
    this.showModal = false;
  }

  // Handle form submission
  handleSubmit(): void {
    if (this.isEditMode) {
      this.unitOfWork.City.update(this.selectedCity.id!, this.selectedCity).subscribe({
        next: () => {
          this.toastr.success('City updated successfully', 'Success');
          this.loadCities();
          this.closeModal();
        },
        error: (err) => {
          this.toastr.error('Failed to update city', 'Error');
          console.error(err);
        },
      });
    } else {
      this.unitOfWork.City.create(this.selectedCity).subscribe({
        next: () => {
          this.toastr.success('City added successfully', 'Success');
          this.loadCities();
          this.closeModal();
        },
        error: (err) => {
          this.toastr.error('Failed to add city', 'Error');
          console.error(err);
        },
      });
    }
  }

  // Delete a city
  deleteCity(id: number): void {
    if (confirm('Are you sure you want to delete this city?')) {
      this.unitOfWork.City.delete(id).subscribe({
        next: () => {
          this.toastr.success('City deleted successfully', 'Success');
          this.loadCities();
        },
        error: (err) => {
          this.toastr.error('Failed to delete city', 'Error');
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
    this.loadCities();
  }

  prevPage(): void {
    this.PageNumber = Math.max(1, this.PageNumber - 1);
    this.loadCities();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.PageNumber = 1;
    this.loadCities();
  }

  // Initialize an empty city
  private emptyCity(): Partial<City> {
    return {
      id: 0,
      name: '',
      standardShippingCost: 0,
      pickupShippingCost: 0,
      createdAt: new Date().toISOString(),
      regionId: undefined,
      regionName: '',
    };
  }
}