import { Injectable } from "@angular/core";
import { CityService } from "./city.service";
import { RegionService } from "./region.service";

@Injectable({
    providedIn: 'root',
  })

  
export class UnitOfWorkServices{
    constructor(
        
        public City: CityService,
         public Region: RegionService,
        
    ) {
        
    }
}