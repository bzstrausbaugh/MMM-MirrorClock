import { createTheme, Group, MantineProvider } from '@mantine/core';
import classes from './styles.module.css';
import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import Clock from './Clock';

const theme = createTheme({
  // Use gray or dark as the primary color
  primaryColor: 'gray',

  // Optionally customize the shades for a true black/white feel
  colors: {
    // Re-defining gray to be strictly monochromatic if needed
    gray: [
      '#f8f9fa',
      '#f1f3f5',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#868e96',
      '#495057',
      '#343a40',
      '#212529',
    ],
  },

  // Enable autoContrast for better readability on monochrome backgrounds
  autoContrast: true,
  defaultRadius: 'md',
});

const ClockWrapper = () => {
  return (
    <MantineProvider theme={theme} defaultColorScheme='dark'>
      <div className={classes.rootContainer}>
        <Clock showSeconds={true} hour12={false} />
      </div>
    </MantineProvider>
  );
};
export default ClockWrapper;
