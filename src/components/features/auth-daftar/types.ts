export interface SaaSFormData {
  school_name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  admin_name: string;
  admin_password: string;
}

export interface StepVisual {
  step: number;
  path: string;
  title: string;
  desc: string;
  svgPathMobile: string;
  svgPathDesktop: string;
  solidColor: string;
}
