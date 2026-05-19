import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'welcome',
        component: () => import('pages/WelcomePage.vue'),
      },
      {
        path: 'quiz',
        name: 'quiz',
        component: () => import('pages/QuizPage.vue'),
      },
      {
        path: 'result',
        name: 'result',
        component: () => import('pages/ResultPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
