// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons-react';
import { GiSteeringWheel } from 'react-icons/gi';
import { LuHandHelping } from 'react-icons/lu';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  GiSteeringWheel,
  LuHandHelping
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'AllDrivers',
      type: 'item',
      url: '/AllDrivers',
      icon: icons.GiSteeringWheel,
      breadcrumbs: false
    },
    {
      id: 'util-typography',
      title: 'Requests',
      type: 'item',
      url: '/DriverRequest',
      icon: icons.LuHandHelping,
      breadcrumbs: false
    }
    // {
    //   id: 'util-color',
    //   title: 'Color',
    //   type: 'item',
    //   url: '/color',
    //   icon: icons.IconPalette,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'util-shadow',
    //   title: 'Shadow',
    //   type: 'item',
    //   url: '/shadow',
    //   icon: icons.IconShadow,
    //   breadcrumbs: false
    // }
  ]
};

export default utilities;
