import { createRouter, createWebHistory } from '@ionic/vue-router';
import { lStore } from '@/functions';

import WelcomePage from '@/views/WelcomePage.vue';
import SplashScreenView from '@/views/SplashScreenView/SplashScreenView.vue';
import LoginPage from '@/views/LoginView/LoginPage.vue';

import SupervisorTabs from '@/views/SupervisorView/SupervisorTabs.vue';
import SupervisorDashboard from '@/views/SupervisorView/Dashboard.vue';
import EmployeeSchedules from '@/views/SupervisorView/EmployeeSchedules.vue';
import EmployeeList from '@/views/SupervisorView/EmployeeList.vue';
import SupervisorProfile from '@/views/SupervisorView/Profile.vue';

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
      if (from.path === '/employee' || from.path === '/employee' || from.path === '/employee/dashboard') return false;
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
    path: '/supervisor',
    component: SupervisorTabs,
    beforeEnter: () => {
      if (!lStore.isset('user_token')) return '/login';
    },
    children: [
      {
        path: '/supervisor',
        redirect: '/supervisor/dashboard',
      },
      {
        path: '/supervisor/dashboard',
        component: SupervisorDashboard,
      },
      {
        path: '/supervisor/profile',
        component: SupervisorProfile,
      },
      {
        path: "/supervisor/employeeschedules",
        component: EmployeeSchedules
      },
      {
        path: "/supervisor/employeelist",
        component: EmployeeList
      },
    ]
  },
  {
    path: '/employee',
    component: EmployeeTabs,
    beforeEnter: () => {
      if (!lStore.isset('user_token')) return '/login';
    },
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
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;