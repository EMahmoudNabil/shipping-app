import { Injectable } from "@angular/core";
import { CityService } from "./city.service";
import { RegionService } from "./region.service";
import { WeightSettingService } from './WeightSetting.Service';
import { SpecialCourierRegionService } from "./SpecialCourierRegion .Service";
import { CourierService } from "./Courier.Service";

@Injectable({
    providedIn: 'root',
  })

  
export class UnitOfWorkServices{
    constructor(
        
        public City: CityService,
        public Region: RegionService,
        public WeightSetting: WeightSettingService,
        public SpecialCourierRegion: SpecialCourierRegionService,
        public Courier: CourierService,
    ) {}
}