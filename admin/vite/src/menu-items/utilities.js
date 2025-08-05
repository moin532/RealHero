
// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons-react';
import { GiSteeringWheel } from 'react-icons/gi';
import { LuHandHelping } from 'react-icons/lu';
import { BsDatabaseCheck } from 'react-icons/bs';
import { FaHireAHelper } from 'react-icons/fa6';
import { BsPersonVcard } from 'react-icons/bs';
import { GiTowTruck } from 'react-icons/gi';
import { MdBusinessCenter } from 'react-icons/md'; // 👈 Added business icon
import { FaMapPin } from "react-icons/fa6";

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  GiSteeringWheel,
  LuHandHelping,
  BsDatabaseCheck,
  FaHireAHelper,
  BsPersonVcard,
  GiTowTruck,
  MdBusinessCenter,// 👈 Include in icon object
  FaMapPin

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
      id: 'util-requests',
      title: 'Requests',
      type: 'item',
      url: '/DriverRequest',
      icon: icons.FaHireAHelper,
      breadcrumbs: false
    },
    {
      id: 'util-requests',
      title: 'Driver Maps',
      type: 'item',
      url: '/driver/map',
      icon: icons.FaMapPin,
      breadcrumbs: false
    },
    {
      id: 'util-add-admin',
      title: 'Add Admin',
      type: 'item',
      url: '/add/admin',
      icon: icons.BsDatabaseCheck,
      breadcrumbs: false
    },
    {
      id: 'util-all-admins',
      title: 'All Admins',
      type: 'item',
      url: '/all/admin',
      icon: icons.BsPersonVcard,
      breadcrumbs: false
    },
    {
      id: 'util-driver-safety',
      title: 'Driver Safety Caution',
      type: 'item',
      url: '/driver/safety',
      icon: icons.GiTowTruck,
      breadcrumbs: false
    },
    {
      id: 'util-add-business',
      title: 'Add Business',
      type: 'item',
      url: '/add/business',
      icon: icons.MdBusinessCenter, // 👈 Business icon
      breadcrumbs: false
    }
  ]
};

export default utilities;