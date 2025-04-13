import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BranchService } from '../../../../core/services/branch.service';
import { RegionService } from '../../../../core/services/region.service';
import { CourierService } from '../../../../core/services/Courier.Service';
import { Branch } from '../../../../models/Branch.Interface';
import { Region } from '../../../../models/Region.Interface ';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-courier',
  templateUrl: './add-courier.component.html',
  styleUrls: ['./add-courier.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
})
export class AddCourierComponent implements OnInit {
  courierForm: FormGroup;
  isSubmitting = false;
  branches: Branch[] = []; // Branch list
  regions: Region[] = []; // Region list

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private regionService: RegionService,
    private courierService: CourierService,
    private toastr: ToastrService
  ) {
    this.courierForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', Validators.required],
      branchId: [null, Validators.required],
      regionId: [null, Validators.required], // Added regionId
      deductionType: ['Fixed', Validators.required],
      deductionCompanyFromOrder: [0, Validators.required],
      specialCourierRegions: this.fb.array([]), // Optional regions
    });
  }

  ngOnInit(): void {
    this.loadBranches(); // Fetch branches
    this.loadRegions(); // Fetch regions
  }

  loadBranches(): void {
    this.branchService.getAll().subscribe({
      next: (branches) => {
        this.branches = branches; // Bind branches to the dropdown
      },
      error: (error) => {
        this.toastr.error('Failed to load branches.');
        console.error(error);
      },
    });
  }

  loadRegions(): void {
    this.regionService.getAll().subscribe({
      next: (regions) => {
        this.regions = regions; // Bind regions to the dropdown
      },
      error: (error) => {
        this.toastr.error('Failed to load regions.');
        console.error(error);
      },
    });
  }

  onSubmit(): void {
    if (this.courierForm.invalid) {
      this.toastr.error('Please fill out all required fields.');
      return;
    }
  
    this.isSubmitting = true;
  
    const courier = {
      email: this.courierForm.value.email,
      fullName: this.courierForm.value.fullName,
      phoneNumber: this.courierForm.value.phoneNumber,
      address: this.courierForm.value.address,
      password: this.courierForm.value.password,
      branchId: this.courierForm.value.branchId,
      regionId: this.courierForm.value.regionId, // Ensure regionId is included
      deductionType: this.courierForm.value.deductionType,
      deductionCompanyFromOrder: this.courierForm.value.deductionCompanyFromOrder,
      specialCourierRegions: this.courierForm.value.specialCourierRegions || [],
    };
  
    // Pass the courier object directly
    this.courierService.addCourier(courier).subscribe({
      next: (response: string) => {
        this.toastr.success(response);
        this.courierForm.reset();
        this.isSubmitting = false;
      },
      error: (error: any) => {
        console.error('Backend Validation Errors:', error.error); // Log the backend validation errors
        this.toastr.error('Failed to add courier. Please check the input fields.');
        this.isSubmitting = false;
      },
    });
  }
}