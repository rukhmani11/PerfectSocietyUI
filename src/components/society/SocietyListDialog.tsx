import React from 'react'
import { makeStyles } from "@mui/styles";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, Theme, Button } from '@mui/material';

const useStyles = makeStyles((theme: Theme) => ({
    dialog: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(1)
    },
    dialogTitle: {
        textAlign: 'center'
    },
    dialogContent: {
        textAlign: 'center'
    },
    dialogAction: {
        justifyContent: 'center'
    },
    titleIcon: {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.main,
        '&:hover': {
            backgroundColor: theme.palette.secondary.light,
            cursor: 'default'
        },
        '& .MuiSvgIcon-root': {
            fontSize: '8rem',
        }
    }
}))

const SocietyListDialog = (props :any) => {
    const { societyDialog, setSocietyDialog } = props;
    const classes = useStyles();
    return (
        <>
         <Dialog open={societyDialog.isOpen} classes={{ paper: classes.dialog }}>
            <DialogTitle className={classes.dialogTitle}>
                {/* <IconButton size="small"  disableRipple className={classes.titleIcon}>
                    <NotListedLocationIcon />
                </IconButton> */}
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="h6">
                    {societyDialog.title}
                </Typography>
                <Typography variant="subtitle2">
                    {societyDialog.subTitle}
                </Typography>
            </DialogContent>
            <DialogActions className={classes.dialogAction}>
                <Button variant="contained" color='error'
                    onClick={() => setSocietyDialog({ ...societyDialog, isOpen: false })} >No</Button>
                <Button variant="contained" color='primary'
                    onClick={societyDialog.onConfirm} >Yes</Button>
            </DialogActions>
        </Dialog></>
    )
}

export default SocietyListDialog