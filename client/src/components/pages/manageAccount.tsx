import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  SnackbarCloseReason,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import { Account, Profile } from '../../model/account';
import { useAccount } from '../context/accountContext';
import NotLoggedIn from '../login/notLoggedIn';

const ManageAccount = () => {
  const { account, setAccount } = useAccount();
  const [editedAccount, setEditedAccount] = useState<Account>(account);
  const [saveSnackOpen, setSaveSnackOpen] = useState<boolean>(false);
  const [addProfileDialogOpen, setAddProfileDialogOpen] = useState<boolean>(false);
  const [discardChangesDialogOpen, setDiscardChangesDialogOpen] = useState<boolean>(false);

  const handleSaveSnackClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSaveSnackOpen(false);
  };

  const handleSaveButton = () => {
    //make save API call
    setAccount(editedAccount);
    setSaveSnackOpen(true);
  };

  const handleAddProfileButton = () => {
    setAddProfileDialogOpen(true);
  };

  const handleCloseAddProfileDialog = () => {
    setAddProfileDialogOpen(false);
  };

  const handleDiscardButton = () => {
    setDiscardChangesDialogOpen(true);
  };

  const handleCloseDiscardDialog = () => {
    setDiscardChangesDialogOpen(false);
  };

  const handleConfirmDiscard = () => {
    setDiscardChangesDialogOpen(false);
    setEditedAccount(account);
  };

  const handleAdProfile = (profileName: string) => {
    if (editedAccount) {
      const updatedProfiles: Profile[] = [...editedAccount.profiles, { name: profileName }];
      const updatedAccount: Account = {
        ...editedAccount,
        profiles: updatedProfiles,
      };
      setEditedAccount(updatedAccount);
    }
  };

  return (
    <>
      {!editedAccount ? (
        <NotLoggedIn />
      ) : (
        <>
          <Grid container spacing={2} alignItems="center">
            <Box
              component="img"
              src={editedAccount.image}
              alt={editedAccount.name}
              sx={{
                borderRadius: 2,
              }}
            />

            <Typography variant="h2" gutterBottom>
              {editedAccount.name}
            </Typography>
          </Grid>

          <Box sx={{ p: 2 }}>
            <Typography variant="h4">Profiles</Typography>
            <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap sx={{ flexWrap: 'wrap', p: 2 }}>
              {editedAccount.profiles.map((profile) => (
                <Chip id={profile.id} key={profile.id} label={profile.name} variant="filled" color="primary" />
              ))}
              <Chip
                id="addProfile"
                key="addProfile"
                label="Add"
                icon={<AddIcon />}
                variant="outlined"
                color="primary"
                onClick={handleAddProfileButton}
              />
            </Stack>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 1,
              m: 1,
            }}
          >
            <Button variant="contained" onClick={handleSaveButton}>
              Save
            </Button>
            <Button onClick={handleDiscardButton}>Discard</Button>
          </Box>
        </>
      )}
      <Snackbar
        open={saveSnackOpen}
        autoHideDuration={5000}
        onClose={handleSaveSnackClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSaveSnackClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          Settings saved successfully.
        </Alert>
      </Snackbar>
      <Dialog
        open={addProfileDialogOpen}
        onClose={handleCloseAddProfileDialog}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const profileName = formJson.profileName;
            handleAdProfile(profileName);
            handleCloseAddProfileDialog();
          },
        }}
      >
        <DialogTitle>Add Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="profileName"
            name="profileName"
            label="Profile"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddProfileDialog}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={discardChangesDialogOpen}
        onClose={handleCloseDiscardDialog}
        aria-labelledby="discard-dialog-title"
        aria-describedby="discard-dialog-description"
      >
        <DialogTitle id="discard-dialog-title">Confirm Discard</DialogTitle>
        <DialogContent>
          <DialogContentText id="discard-dialog-description">
            Are you sure you want to discard your changes? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDiscardDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDiscard} color="error" autoFocus>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageAccount;