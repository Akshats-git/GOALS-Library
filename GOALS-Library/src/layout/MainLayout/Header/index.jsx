import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

// material-ui
import { styled, useTheme } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'

// project imports
import LogoSection from '../LogoSection'
import SearchSection from './SearchSection'
import NotificationSection from './NotificationSection'
import ProfileSection from './ProfileSection'

// assets
import { IconMenu2 } from '@tabler/icons-react'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { SET_NAV_TYPE } from 'store/actions'

const ModeSwitch = styled(Switch)(({ theme }) => ({
  width: 38,
  height: 22,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 1,
    margin: 1,
    transitionDuration: '250ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2f3c6a' : '#ffd166',
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 18,
    height: 18,
    backgroundColor: '#1f2a52',
    boxShadow: 'none',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 10,
      height: 10,
      borderRadius: '50%',
      top: 4,
      left: 5,
      backgroundColor: '#f4f6fb',
      boxShadow: '-2px 0 0 1px #1f2a52',
    },
  },
  '& .MuiSwitch-track': {
    borderRadius: 999,
    backgroundColor: theme.palette.mode === 'dark' ? '#1b2442' : '#f6c453',
    opacity: 1,
  },
}))

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navType = useSelector((state) => state.customization.navType)
  const isDark = navType === 'dark'

  const handleThemeToggle = () => {
    dispatch({
      type: SET_NAV_TYPE,
      navType: isDark ? 'light' : 'dark',
    })
  }

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto',
          },
        }}>
        <Box
          component="span"
          sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light,
              },
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit">
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>

      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      {/* <NotificationSection /> */}
      <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
        <Box
          sx={{
            mr: 1.25,
            px: 1,
            py: 0.5,
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor:
              theme.palette.mode === 'dark' ? theme.palette.dark.main : '#fff8e1',
          }}>
          <Brightness7
            sx={{ color: !isDark ? '#f59f00' : theme.palette.text.secondary }}
            fontSize="small"
          />
          <ModeSwitch checked={isDark} onChange={handleThemeToggle} />
          <Brightness4
            sx={{ color: isDark ? '#9fb3ff' : theme.palette.text.secondary }}
            fontSize="small"
          />
        </Box>
      </Tooltip>
      <ProfileSection />
    </>
  )
}

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
}

export default Header
