import { useRef, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Profile } from '../../app/model/profile';
import { selectCurrentAccount, updateAccountImage } from '../../app/slices/authSlice';
import { addProfile, deleteProfile, editProfile } from '../../app/slices/profilesSlice';
import { ProfilesStack } from '../common/profilesStack';

const ManageAccount = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(selectCurrentAccount)!;

  const [addProfileDialogOpen, setAddProfileDialogOpen] = useState<boolean>(false);
  const [deleteProfileDialogOpen, setDeleteProfileDialogOpen] = useState<boolean>(false);
  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState<boolean>(false);
  const [managedProfile, setManagedProfile] = useState<Profile | null>();
  const [managedProfileName, setManagedProfileName] = useState<string>('');

  const handleAddProfileButton = () => {
    setAddProfileDialogOpen(true);
  };

  const handleCloseAddProfileDialog = () => {
    setAddProfileDialogOpen(false);
  };

  const handleDeleteProfileButton = (profile: Profile) => {
    setManagedProfile(profile);
    setDeleteProfileDialogOpen(true);
  };

  const handleCloseDeleteProfileDialog = () => {
    setDeleteProfileDialogOpen(false);
  };

  const handleEditProfileButton = (profile: Profile) => {
    setManagedProfile(profile);
    setManagedProfileName(profile.name);
    setEditProfileDialogOpen(true);
  };

  const handleCloseEditProfileDialog = () => {
    setEditProfileDialogOpen(false);
  };

  async function handleAddProfile(profileName: string) {
    await dispatch(addProfile({ accountId: account.id, newProfileName: profileName }));
  }

  async function handleConfirmDeleteProfile() {
    if (managedProfile) {
      setDeleteProfileDialogOpen(false);
      await dispatch(deleteProfile({ accountId: account.id, profileId: managedProfile.id }));
      setManagedProfile(null);
    }
  }

  async function handleEditProfile(profileName: string) {
    if (managedProfile && managedProfileName) {
      setEditProfileDialogOpen(false);
      await dispatch(editProfile({ accountId: account.id, id: managedProfile.id, name: profileName }));
      setManagedProfile(null);
      setManagedProfileName('');
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      return;
    }
    const file = files[0];
    dispatch(updateAccountImage({ accountId: account.id, file }));
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid>
          <Box
            sx={{
              position: 'relative',
              display: 'inline-block',
              width: 455,
              height: 256,
              borderRadius: 2,
              cursor: 'pointer',
              overflow: 'hidden',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleImageClick}
          >
            <Box
              crossOrigin="anonymous"
              component="img"
              src={account.image}
              alt={account.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 2,
              }}
            />
            {isHovered && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                  borderRadius: 2,
                }}
              >
                Upload Image
              </Box>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </Box>
        </Grid>

        <Grid>
          <Typography variant="h2" gutterBottom>
            {account.name}
          </Typography>
          {/* <img crossOrigin='anonymous'></img> */}
        </Grid>
      </Grid>

      <Box sx={{ p: 2 }}>
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap sx={{ flexWrap: 'wrap', p: 1 }}>
          <Typography variant="h4">Profiles</Typography>
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
        <ProfilesStack editable={true} handleEdit={handleEditProfileButton} handleDelete={handleDeleteProfileButton} />
      </Box>
      {/* Add Profile Dialog */}
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
            handleAddProfile(profileName);
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
            inputRef={(input) => input && input.focus()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddProfileDialog} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Profile Dialog */}
      <Dialog
        open={editProfileDialogOpen}
        onClose={handleCloseEditProfileDialog}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const profileName = formJson.profileName;
            handleEditProfile(profileName);
            handleCloseEditProfileDialog();
          },
        }}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="profileName"
            name="profileName"
            label="Profile"
            value={managedProfileName}
            fullWidth
            variant="standard"
            onChange={(e) => setManagedProfileName(e.target.value)}
            inputRef={(input) => input && input.focus()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditProfileDialog} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirm Profile Delete Dialog */}
      <Dialog
        open={deleteProfileDialogOpen}
        onClose={handleCloseDeleteProfileDialog}
        aria-labelledby="delete-profile-dialog-title"
        aria-describedby="delete-profile-dialog-description"
      >
        <DialogTitle id="delete-profile-dialog-title">Confirm Profile Deletion - {managedProfile?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-profile-dialog-description">
            Deleting this profile will also delete all watch data for this profile. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteProfileDialog} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteProfile} variant="contained" color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageAccount;
