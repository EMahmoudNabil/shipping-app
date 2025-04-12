import { Branch } from './../../models/Branch.Interface';
import { Injectable } from "@angular/core";
import { CityService } from "./city.service";
import { RegionService } from "./region.service";
import { BranchService} from './branch.service';


@Injectable({
    providedIn: 'root',
  })

  
export class UnitOfWorkServices{
    constructor(
        
        public City: CityService,
         public Region: RegionService,
         public Branch: BranchService,
        
    ) {
        
    }
}