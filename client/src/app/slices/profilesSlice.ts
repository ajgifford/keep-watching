import { Profile } from '../model/profile';
import { RootState } from '../store';
import { createAppAsyncThunk } from '../withTypes';
import { logout } from './authSlice';
import { EntityState, createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface ProfileStatus extends EntityState<Profile, string> {
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

// Create an entity adapter for Profile
const profilesAdapter = createEntityAdapter<Profile>({
  sortComparer: (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
});

// Define the initial state using the adapter
const initialState: ProfileStatus = profilesAdapter.getInitialState({
  status: 'idle',
  error: null,
});

// Async thunks
export const fetchProfiles = createAppAsyncThunk(
  'posts/fetchPosts',
  async (accountId: string, { rejectWithValue }) => {
    const response = await axios.get(`/api/account/${accountId}/profiles`);
    return response.data;
  },
  {
    condition(arg, thunkApi) {
      const profileStatus = selectProfilesStatus(thunkApi.getState());
      if (profileStatus !== 'idle') {
        return false;
      }
    },
  },
);

export const addProfile = createAsyncThunk(
  'profiles/addProfile',
  async ({ accountId, newProfileName }: { accountId: string; newProfileName: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/account/${accountId}/profiles`, { name: newProfileName });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteProfile = createAsyncThunk(
  'profiles/deleteProfile',
  async ({ accountId, profileId }: { accountId: string; profileId: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/account/${accountId}/profiles/${profileId}`);
      return profileId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const editProfile = createAsyncThunk(
  'profiles/editProfile',
  async ({ accountId, id, name }: { accountId: string; id: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/account/${accountId}/profiles/${id}`, { name });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Create the slice
const profileSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        return initialState;
      })
      .addCase(addProfile.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(addProfile.fulfilled, (state, action) => {
        profilesAdapter.addOne(state, action.payload);
        state.status = 'succeeded';
      })
      .addCase(addProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteProfile.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        profilesAdapter.removeOne(state, action.payload);
        state.status = 'succeeded';
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(editProfile.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        profilesAdapter.upsertOne(state, action.payload);
        state.status = 'succeeded';
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchProfiles.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        profilesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown Error';
      });
  },
});

// Export the entity adapter selectors
export const {
  selectAll: selectAllProfiles,
  selectById: selectProfileById,
  selectIds: selectProfileIds,
} = profilesAdapter.getSelectors((state: any) => state.profiles);
export const selectProfilesStatus = (state: RootState) => state.profiles.status;
export const selectProfilesError = (state: RootState) => state.profiles.error;

// Export the reducer
export default profileSlice.reducer;