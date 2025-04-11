import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild, viewChild } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnitOfWorkServices } from '../../../core/services/unitOfWork.service';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-city',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-city.component.html',
  styleUrl: './add-city.component.css'
})
export class AddCityComponent {
  cityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _unitOfWork: UnitOfWorkServices,
    private toastr : ToastrService
  ) {
this.cityForm = this.fb.group({
  name: ['', Validators.required],
  regionId: [0, Validators.required],
  standardShippingCost: [null, [Validators.required, Validators.min(0.01)]],
  pickupShippingCost: [null, [Validators.required, Validators.min(0.01)]],
});
  }

id:number=0;
@ViewChild('modal') modal! : ElementRef;
@Output() citiesChanged = new EventEmitter();


closeModal() {
  this.cityForm.reset();
  this.modal.nativeElement.style.datasplay = 'none';
}

addModal(governId: number) {
  this.cityForm.get('regionId')?.setValue(governId); // كان governID
  this.modal.nativeElement.style.display = 'block';
}


  editModal(cityId=0) {
    this.id = cityId;
    this._unitOfWork.City.getById(cityId).subscribe({
      next: (data) => {
        this.cityForm.patchValue(data);
        console.log(data);
      },
      error: (e) => {
        console.log(e);
      },
    });

  }


  onSubmit() {

    if (this.cityForm.valid) {
      if (this.id == 0) {
        this._unitOfWork.City.create(this.cityForm.value).subscribe({
          next: (response) => {
            this.toastr.success('تم الاضافة بنجاح');
            this.citiesChanged.emit();
            this.closeModal();
          },
          error: (e) => {
            console.log(e);
            this.toastr.error('حدث خطأ عند الاضافة');
          },
        });
      } else {
        this._unitOfWork.City.update(this.id, this.cityForm.value).subscribe({
          next: (response) => {
            this.toastr.success('تم التعديل بنجاح');
            this.citiesChanged.emit();
            this.closeModal();
          },
          error: (e) => {
            console.log(e);
            this.toastr.error('حدث خطأ عند التعديل');
          },
        });
      }
    } else {
      this.cityForm.markAllAsTouched();
    }
  }

}