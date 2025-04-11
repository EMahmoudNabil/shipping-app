import { Injectable } from "@angular/core";
import { CityService } from "./city.service";

@Injectable({
    providedIn: 'root',
  })

  
export class UnitOfWorkServices{
    constructor(
        
        public City: CityService,
        
    ) {
        
    }
}