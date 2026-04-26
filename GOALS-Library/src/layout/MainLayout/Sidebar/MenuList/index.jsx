// material-ui
import { Typography } from '@mui/material'

// project imports
import menuItems from 'menu-items'
import NavGroup from './NavGroup'

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const userRole = localStorage.getItem('userRole')

  // Get menu items based on the user role
  const items = menuItems(userRole).items
  const navItems = items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        )
    }
  })

  return <>{navItems}</>
}

export default MenuList
