export interface SchoolProfile {
  id: string;
  basicInfo: BasicSchoolInfo;
  location: LocationInfo;
  contact: ContactInfo;
  management: ManagementInfo;
  affiliation: AffiliationInfo;
  facilities: FacilitiesInfo;
  infrastructure: InfrastructureInfo;
  academic: AcademicInfo;
  feeStructure: FeeStructureInfo;
  policies: PoliciesInfo;
  timings: TimingsInfo;
  healthSafety: HealthSafetyInfo;
  createdAt: string;
  updatedAt: string;
}

export interface BasicSchoolInfo {
  name: string;
  establishedYear: number;
  schoolType: 'public' | 'private' | 'international';
  motto: string;
  logo?: string;
  website?: string;
}

export interface LocationInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ContactInfo {
  primaryPhone: string;
  alternatePhone?: string;
  primaryEmail: string;
  alternateEmail?: string;
  emergencyContact: string;
}

export interface ManagementInfo {
  principalName: string;
  principalEmail: string;
  boardMembers: {
    name: string;
    position: string;
    email: string;
  }[];
  trustInfo?: string;
}

export interface AffiliationInfo {
  boardType: string;
  affiliationNumber: string;
  accreditations: {
    name: string;
    validUntil: string;
    certificateUrl?: string;
  }[];
}

export interface FacilitiesInfo {
  classrooms: number;
  laboratories: {
    type: string;
    count: number;
    description?: string;
  }[];
  library: {
    capacity: number;
    totalBooks: number;
    hasDigitalSection: boolean;
  };
  sportsAmenities: string[];
  otherFacilities: string[];
}

export interface InfrastructureInfo {
  totalArea: number;
  buildingCount: number;
  playgroundArea: number;
  hasAuditorium: boolean;
  hasCafeteria: boolean;
  hasTransportFacility: boolean;
  specialFacilities: string[];
}

export interface AcademicInfo {
  grades: {
    from: string;
    to: string;
  };
  streams: string[];
  subjects: {
    grade: string;
    subjects: string[];
  }[];
  languages: string[];
  extracurricular: string[];
}

export interface FeeStructureInfo {
  academicYear: string;
  grades: {
    grade: string;
    tuitionFee: number;
    otherFees: {
      type: string;
      amount: number;
      frequency: 'monthly' | 'quarterly' | 'annually';
    }[];
  }[];
  scholarships: {
    name: string;
    description: string;
    criteria: string;
  }[];
}

export interface PoliciesInfo {
  admissionPolicy: string;
  uniformPolicy: string;
  attendancePolicy: string;
  disciplinaryPolicy: string;
  otherPolicies: {
    name: string;
    description: string;
  }[];
  documents: {
    type: string;
    url: string;
  }[];
}

export interface TimingsInfo {
  regularHours: {
    start: string;
    end: string;
  };
  breakTimes: {
    type: string;
    start: string;
    end: string;
  }[];
  academicYear: {
    start: string;
    end: string;
  };
  holidays: {
    date: string;
    description: string;
  }[];
}

export interface HealthSafetyInfo {
  medicalFacilities: {
    type: string;
    availability: string;
  }[];
  safetyMeasures: string[];
  emergencyProcedures: string[];
  certifications: {
    type: string;
    validUntil: string;
    certificateUrl?: string;
  }[];
} 