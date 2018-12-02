import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: '首頁',
    icon: 'nb-home',
    link: '/pages/home',
    home: true,
  }, {
    title: '公告',
    icon: 'nb-volume-high',
    link: '/pages/announcement',
  }, {
    title: '匯入',
    icon: 'nb-compose',
    link: '/pages/import',
  }, {
    title: '統計',
    icon: 'nb-bar-chart',
    link: '/pages/charts',
  }, {
    title: '課表',
    icon: 'nb-layout-two-column',
    link: '/pages/curriculum',
  },
];
