import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, Theme, Button } from '@mui/material';
//import Controls from "./controls/Controls";
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import { makeStyles } from "@mui/styles";
import { globalService } from '../../services/GlobalService';
import { ROLES } from '../../utility/Config';
import { AuthContext } from '../../utility/context/AuthContext';

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

export default function ConfirmDialog(props: any) {
    const { auth } = React.useContext(AuthContext);
    const { confirmDialog, setConfirmDialog } = props;
    const classes = useStyles();

    return (
        <Dialog open={confirmDialog.isOpen} classes={{ paper: classes.dialog }}>
            <DialogTitle className={classes.dialogTitle}>
                {/* <IconButton size="small"  disableRipple className={classes.titleIcon}>
                    <NotListedLocationIcon />
                </IconButton> */}
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="h6">
                    {confirmDialog.title}
                </Typography>
                <Typography variant="subtitle2">
                    {confirmDialog.subTitle}
                </Typography>
            </DialogContent>
            <DialogActions className={classes.dialogAction}>
                <Button variant="contained" color='error'
                    onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} >No</Button>
                <Button variant="contained" color='primary' className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}
                    onClick={confirmDialog.onConfirm} >Yes</Button>
            </DialogActions>
        </Dialog>
    )
}
