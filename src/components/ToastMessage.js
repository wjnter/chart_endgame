import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';


export default function SimpleDialog({ open }) {

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle>Set backup account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Incorrect email or password, please try again!!
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
