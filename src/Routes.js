import Vue from 'vue';
import VueRouter from 'vue-router';

import Layout from '@/components/Layout/Layout';

// Pages
import Error from "@/pages/Error/Error";
import Login from "@/pages/Login/Login";
import Home from "@/pages/Home/Home";
import Projets from "@/pages/Projets/Projets";
import Ressources from "@/pages/Ressources/Ressources";
import Test from "@/pages/test";
import Notifications from '@/pages/Notifications/Notifications'

Vue.use(VueRouter);

const routes = [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
    path: '/',
    redirect: 'login',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
      },
      {
        path: 'projets/:return ',
        name: 'Projets',
        component: Projets,
      },
      {
        path: 'projets',
        name: 'Projets',
        component: Projets,
      },
      {
        path: 'vocabulaire',
        name: 'Vocabulaire',
        component: Ressources,
      },
      {
        path: 'test',
        name: 'Test',
        component: Test,
      },
      {
        path: 'Notifications',
        name: 'Notifications',
        component: Notifications,
      },
    ],
  },
    {
      path: '*',
      name: 'Error',
      component: Error
    }
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
  
export default router
  
