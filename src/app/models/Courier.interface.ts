export interface Courier {
  id?: number;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  branchId: number;
  deductionType: number;
  deductionCompanyFromOrder: number;
  specialCourierRegions: {
    regionId: number;
  }[];
}