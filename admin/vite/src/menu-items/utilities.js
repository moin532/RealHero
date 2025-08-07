
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

// Helper function to check permissions
const hasPermission = (userPermissions, requiredPermission) => {
  if (!userPermissions) return false;
  return userPermissions[requiredPermission] === true;
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = (userPermissions = {}) => ({
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    // All Drivers - requires DriverManage permission
    ...(hasPermission(userPermissions, 'DriverManage') ? [{
      id: 'util-typography',
      title: 'AllDrivers',
      type: 'item',
      url: '/AllDrivers',
      icon: icons.GiSteeringWheel,
      breadcrumbs: false
    }] : []),
    
    // Requests - requires DriverRequest permission
    ...(hasPermission(userPermissions, 'DriverRequest') ? [{
      id: 'util-requests',
      title: 'Requests',
      type: 'item',
      url: '/DriverRequest',
      icon: icons.FaHireAHelper,
      breadcrumbs: false
    }] : []),
    
    // Driver Maps - requires DriverMaps permission
    ...(hasPermission(userPermissions, 'DriverMaps') ? [{
      id: 'util-driver-maps',
      title: 'Driver Maps',
      type: 'item',
      url: '/driver/map',
      icon: icons.FaMapPin,
      breadcrumbs: false
    }] : []),
    
    // Add Admin - requires AdminCreate permission
    ...(hasPermission(userPermissions, 'AdminCreate') ? [{
      id: 'util-add-admin',
      title: 'Add Admin',
      type: 'item',
      url: '/add/admin',
      icon: icons.BsDatabaseCheck,
      breadcrumbs: false
    }] : []),
    
    // All Admins - requires AllAdmins permission
    ...(hasPermission(userPermissions, 'AllAdmins') ? [{
      id: 'util-all-admins',
      title: 'All Admins',
      type: 'item',
      url: '/all/admin',
      icon: icons.BsPersonVcard,
      breadcrumbs: false
    }] : []),
    
    // Driver Safety - requires DriverSafety permission
    ...(hasPermission(userPermissions, 'DriverSafety') ? [{
      id: 'util-driver-safety',
      title: 'Driver Safety Caution',
      type: 'item',
      url: '/driver/safety',
      icon: icons.GiTowTruck,
      breadcrumbs: false
    }] : []),
    
    // Add Business - requires BusinessManage permission
    ...(hasPermission(userPermissions, 'BusinessManage') ? [{
      id: 'util-add-business',
      title: 'Add Business',
      type: 'item',
      url: '/add/business',
      icon: icons.MdBusinessCenter,
      breadcrumbs: false
    }] : [])
  ]
});

export default utilities;