import {
  Login,
  ForgotPassword,
  Register,
  EnterOtp,
  ConfirmPassword
} from 'ui';

export const IdentityRoutes = [
  { path: '/login', component: Login },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/register', component: Register },
  { path: '/enter-otp', component: EnterOtp },
  { path: '/confirm-password', component: ConfirmPassword }
];