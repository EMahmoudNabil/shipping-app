import { Component, OnInit } from '@angular/core';
import { RegionService } from '../../../core/services/region.service';
import { Region } from '../../../models/Region.Interface ';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from "../navbar/navbar.component";
import { SideNavComponent } from "../side-nav/side-nav.component";
import { UnitOfWorkServices } from '../../../core/services/unitOfWork.service';



@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css'],
  imports: [FormsModule, CommonModule],
})
export class RegionComponent implements OnInit {
  regions: Region[] = [];
  selectedRegion: Region = this.emptyRegion();
  showModal = false;
  isEditMode = false;
  deletingId: number | null = null;

  constructor(
    private toastr: ToastrService,
    private _UnitOfWorkServices: UnitOfWorkServices,
    
  ) {}

  ngOnInit(): void {
    this.loadRegions();
  }

  private loadRegions(): void {
    this._UnitOfWorkServices.Region.getAll().subscribe({
      next: (data) => this.regions = data,
      error: (err) => console.error('Error loading regions:', err)
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedRegion = this.emptyRegion();
    this.showModal = true;
  }

  openEditModal(region: Region): void {
    this.isEditMode = true;
    this.selectedRegion = { ...region };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  handleSubmit(): void {
    if (this.isEditMode) {
      this._UnitOfWorkServices.Region.update(this.selectedRegion.id, this.selectedRegion)
        .subscribe(() => {
          this.loadRegions();
          this.closeModal();
        });
    } else {
      this._UnitOfWorkServices.Region.create(this.selectedRegion)
        .subscribe(() => {
          this.loadRegions();
          this.closeModal();
        });
    }
  }

  // confirmDelete(region: Region): void {
  //   if (confirm(`هل أنت متأكد من حذف محافظة ${region.governorate}؟`)) {
  //     this.regionService.delete(region.id)
  //       .subscribe(() => this.loadRegions());
  //   }
  // }

  private emptyRegion(): Region {
    return {
      id: 0,
      governorate: '',
      isDeleted: false,
      createdAt: new Date().toISOString()
    };
  }


  async confirmDelete(region: Region) {
    const confirmed = await this.showDeleteConfirmation();
    
    if (!confirmed) return;
  
    try {
      this.deletingId = region.id;
      
      await this._UnitOfWorkServices.Region.delete(region.id).toPromise();
      
      this.toastr.success('تم الحذف بنجاح', 'عملية ناجحة', {
        positionClass: 'toast-top-left',
        timeOut: 3000,
        progressBar: true,
    
      });
      
      // Refresh your data
      this.loadRegions();
      
    } catch (error) {
      this.toastr.error('فشل في عملية الحذف', 'خطأ', {
        positionClass: 'toast-top-left',
        timeOut: 5000,
        progressBar: true,
        
      });
    } finally {
      this.deletingId = null;
    }
  }
  
  private showDeleteConfirmation(): Promise<boolean> {
    return new Promise((resolve) => {
      const result = confirm('هل أنت متأكد من رغبتك في حذف هذه المحافظة؟');
      resolve(result);
    });
  }

  updateRegionStatus(region: Region) {
    const originalStatus = region.isDeleted;
    
    // Toggle the status immediately for better UX
    region.isDeleted = !region.isDeleted;
  
    this._UnitOfWorkServices.Region.update(region.id, region).subscribe({
      error: (err:any) => {
        // Revert on error
        region.isDeleted = originalStatus;
        console.error('Failed to update status:', err);
        this.toastr.error('فشل في تحديث الحالة', 'خطأ');
      }
    });
  }

}