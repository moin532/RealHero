import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';

// ==============================|| MENU ITEMS ||============================== //

// This will be called dynamically to get current permissions
const createMenuItems = (userPermissions = {}) => ({
  items: [dashboard, pages, utilities(userPermissions)]
});

export default createMenuItems;
