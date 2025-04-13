export interface Courier {
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  password: string;
  branchId: number;
  deductionType: string;
  deductionCompanyFromOrder: any;
  specialCourierRegions: { regionId: number; regionName: string }[];
}