import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function SimpleBackdrop(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const label = props.label;
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setTimeout(() => {
            setOpen(false);
          }, 3000);
        }}
      >
        {label}
      </button>
      <Backdrop
        className={classes.backdrop}
        open={open}
        onClick={() => {
          setOpen(false);
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

// const handleButtonClick = () => {
//   if (!loading) {
//     setSuccess(false);
//     setLoading(true);
//     timer.current = setTimeout(() => {
//       setSuccess(true);
//       setLoading(false);
//     }, 2000);
//   }
//   setLoading(false);
// };
