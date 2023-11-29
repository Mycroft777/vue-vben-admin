import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const permission: AppRouteModule = {
  path: '/threejs',
  name: 'threejs',
  component: LAYOUT,
  meta: {
    orderNo: 1,
    icon: 'ion:build-outline',
    title: 'threejs',
  },
  children: [
    {
      path: 'carplay',
      name: 'Carplay',
      meta: {
        title: '车辆展示',
      },
      component: () => import('@/views/threejs/carplay/index.vue'),
    },
    // {
    //   path: 'example1',
    //   name: 'Example1',
    //   meta: {
    //     title: '示例',
    //   },
    //   component: () => import('@/views/form-design/examples/baseForm.vue'),
    // },
  ],
};

export default permission;
