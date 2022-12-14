import { createRouter, createWebHistory } from '@ionic/vue-router';
import { lStore } from '@/functions';

import WelcomePage from '@/views/WelcomePage.vue';
import SplashScreenView from '@/views/SplashScreenView/SplashScreenView.vue';
import LoginPage from '@/views/LoginView/LoginPage.vue';

import EmployeeTabs from '@/views/EmployeeView/EmployeeTabs.vue';
import DashboardView from '@/views/EmployeeView/Dashboard.vue';
import SchedulesView from '@/views/EmployeeView/Schedules.vue';
import TmesheetsView from '@/views/EmployeeView/Timesheets.vue';
import EmployeeProfile from '@/views/EmployeeView/Profile.vue';

const routes = [
  {
    path: '/',
    redirect: '/splash'
  },
  {
    path: '/splash',
    name: 'SplashScreenView',
    component: SplashScreenView,
    beforeEnter: (to, from) => {
      if (from.path === '/welcome' || from.path === '/employee' || from.path === '/employee/dashboard'){return false;}
    }
  },
  {
    path: '/welcome',
    name: 'WelcomePage',
    component: WelcomePage,
    beforeEnter: () => {
      if (lStore.isset('user_token')) return false;
    }
  },
  {path: '/login', name: 'LoginPage', component: LoginPage},
  {
    path: '/employee',
    component: EmployeeTabs,
    children: [
      {
        path: '/employee/dashboard',
        component: DashboardView,
      },
      {
        path: '/employee/schedules',
        component: SchedulesView,
      },
      {
        path: '/employee/timesheets',
        component: TmesheetsView,
      },
      {
        path: '/employee/profile',
        component: EmployeeProfile,
      },
    ],
    beforeEnter: () => {
      if (!lStore.isset('user_token')) return '/login';
      if (lStore.get('user_info').role != 'Employee') router.back();
    },
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;