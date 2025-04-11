import { Component, OnInit } from '@angular/core';
import { RegionService } from '../../../core/services/region.service';
import { Region } from '../../../models/Region.Interface ';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-region',
  imports: [CommonModule],
  templateUrl: './region.component.html',
  styleUrl: './region.component.css'
})
export class RegionComponent implements OnInit {
  regions: Region[] = [];
  selectedRegion: Region | null = null;

  constructor(private regionService: RegionService) {}

  ngOnInit(): void {
    this.getAllRegions();
  }

  getAllRegions(): void {
    this.regionService.getAll().subscribe(data => {
      this.regions = data;
    });
  }

  getRegionById(id: number): void {
    this.regionService.getById(id).subscribe(data => {
      this.selectedRegion = data;
    });
  }

  createRegion(): void {
    const newRegion: Region = {
      id: 0, // backend غالبًا بيتجاهله
      governorate: 'New Governorate',
      isDeleted: false,
      createdAt: new Date().toISOString()
    };
    this.regionService.create(newRegion).subscribe(() => this.getAllRegions());
  }

  updateRegion(): void {
    if (!this.selectedRegion) return;
    const updated = { ...this.selectedRegion, governorate: 'Updated Gov' };
    this.regionService.update(updated.id, updated).subscribe(() => this.getAllRegions());
  }

  deleteRegion(id: number): void {
    this.regionService.delete(id).subscribe(() => this.getAllRegions());
  }}
