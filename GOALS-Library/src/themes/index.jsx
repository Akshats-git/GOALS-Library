import { createTheme } from '@mui/material/styles'

// assets
import colors from 'assets/scss/_themes-vars.module.scss'

// project imports
import componentStyleOverrides from './compStyleOverride'
import themePalette from './palette'
import themeTypography from './typography'

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization) => {
  const color = colors
  const isDark = customization?.navType === 'dark'
  const resolvedColors = {
    ...color,
    primaryLight: isDark ? color.darkPrimaryLight : color.primaryLight,
    primaryMain: isDark ? color.darkPrimaryMain : color.primaryMain,
    primaryDark: isDark ? color.darkPrimaryDark : color.primaryDark,
    primary200: isDark ? color.darkPrimary200 : color.primary200,
    primary800: isDark ? color.darkPrimary800 : color.primary800,
    secondaryLight: isDark ? color.darkSecondaryLight : color.secondaryLight,
    secondaryMain: isDark ? color.darkSecondaryMain : color.secondaryMain,
    secondaryDark: isDark ? color.darkSecondaryDark : color.secondaryDark,
    secondary200: isDark ? color.darkSecondary200 : color.secondary200,
    secondary800: isDark ? color.darkSecondary800 : color.secondary800,
  }

  const themeOption = {
    colors: resolvedColors,
    heading: isDark ? color.darkTextTitle : color.grey900,
    paper: isDark ? color.darkPaper : color.paper,
    backgroundDefault: isDark ? color.darkBackground : color.paper,
    background: isDark ? color.darkBackground : color.primaryLight,
    darkTextPrimary: isDark ? color.darkTextPrimary : color.grey700,
    darkTextSecondary: isDark ? color.darkTextSecondary : color.grey500,
    textDark: isDark ? color.darkTextTitle : color.grey900,
    menuSelected: isDark ? color.secondary200 : color.secondaryDark,
    menuSelectedBack: isDark ? color.darkLevel1 : color.secondaryLight,
    divider: isDark ? color.darkLevel2 : color.grey200,
    customization,
  }

  const themeOptions = {
    direction: 'ltr',
    palette: themePalette(themeOption),
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px',
        },
      },
    },
    typography: themeTypography(themeOption),
  }

  const themes = createTheme(themeOptions)
  themes.components = componentStyleOverrides(themeOption)

  return themes
}

export default theme
