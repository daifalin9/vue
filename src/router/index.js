import Vue from 'vue'
import VueRouter from 'vue-router'
import Student from '../views/Student'
import Teacher from '../views/Teacher'
import Home from '../views/Home'
import Face from '../views/Face'
import Login from '../views/Login'
import PublicHome from '../views/public/Home'
import Welcome from '../views/public/Welcome'
import Books from '../views/public/Books'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden: true
  },
  {
    path: '/home',
    name: 'Face',
    component: Home,
    hidden: true
  },
  {
    path: '/face',
    name: 'Face',
    component: Home,
    hidden: true
  },
  {
    path: '/home',
    name: '导航一',
    component: Home,
    children:[
      {
        path: '/student',
        name: '管理学生',
        component: Student
      },
      {
        path: '/teacher',
        name: '教师学生',
        component: Teacher
      }
    ]
  },
  {
    path: '/public',
    name: '前端首页',
    component: PublicHome,
    children:[
      {
        path: 'welcome',
        name: '欢迎页面',
        component: Welcome
      },
      {
        path: 'books',
        name: '图书页面',
        component: Books
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
