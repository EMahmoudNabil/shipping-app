export interface Merchant {
    id?: number;
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    branchId: number;
    regionId: number;
    cityId: number;
    storeName: string;
    specialCityCosts: {
      price: number;
      citySettingId: number;
    }[];
  }