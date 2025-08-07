import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from 'components/ProtectedRoute';
import AddAdmin from './AddAdmin';
import AlllAdmins from './AlllAdmins';
import AddDriverSafety from './AddDriverSafety';
import { AddBusiness } from '@mui/icons-material';
import Business from './AddBuisness';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const AllDrivers = Loadable(lazy(() => import('../routes/AllDrivers')));
const DetailDriver = Loadable(lazy(() => import('../routes/DriverDetail')));
const DriverRequest = Loadable(lazy(() => import('../routes/DriverRequests')));
const DriversCaution = Loadable(lazy(() => import('../routes/DriversCaution')));
const DriverMapDashboard = Loadable(lazy(() => import('../routes/components/DriverMapDashboard')));
// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'AllDrivers',
      element: (
        <ProtectedRoute requiredPermission="DriverManage">
          <AllDrivers />
        </ProtectedRoute>
      )
    },
    {
      path: 'DriverRequest',
      element: (
        <ProtectedRoute requiredPermission="DriverRequest">
          <DriverRequest />
        </ProtectedRoute>
      )
    },
    {
      path: 'driver/detail/:id',
      element: (
        <ProtectedRoute requiredPermission="DriverManage">
          <DetailDriver />
        </ProtectedRoute>
      )
    },
    {
      path: '/add/admin',
      element: (
        <ProtectedRoute requiredPermission="AdminCreate">
          <AddAdmin />
        </ProtectedRoute>
      )
    },
    {
      path: '/all/admin',
      element: (
        <ProtectedRoute requiredPermission="AllAdmins">
          <AlllAdmins />
        </ProtectedRoute>
      )
    },
    {
      path: '/driver/safety',
      element: (
        <ProtectedRoute requiredPermission="DriverSafety">
          <DriversCaution />
        </ProtectedRoute>
      )
    },
    {
      path: '/add/safety',
      element: (
        <ProtectedRoute requiredPermission="DriverSafety">
          <AddDriverSafety />
        </ProtectedRoute>
      )
    },
    {
      path: '/add/business',
      element: (
        <ProtectedRoute requiredPermission="BusinessManage">
          <Business />
        </ProtectedRoute>
      )
    },
    {
      path: '/driver/map',
      element: (
        <ProtectedRoute requiredPermission="DriverMaps">
          <DriverMapDashboard />
        </ProtectedRoute>
      )
    }
    // {
    //   path: 'typography',
    //   element: <UtilsTypography />
    // },
    // {
    //   path: 'color',
    //   element: <UtilsColor />
    // },
    // {
    //   path: 'shadow',
    //   element: <UtilsShadow />
    // },
    // {
    //   path: '/sample-page',
    //   element: <SamplePage />
    // }
  ]
};

export default MainRoutes;
