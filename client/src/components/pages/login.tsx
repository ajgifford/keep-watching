import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { LockOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Container, CssBaseline, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useAppDispatch } from '../../app/hooks';
import { login } from '../../app/slices/authSlice';
import { NotificationType, showNotification } from '../../app/slices/notificationSlice';
import { validate } from 'email-validator';

const Login = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailHasError = useMemo(() => {
    if (email === '') return false;
    const emailValid = validate(email);
    return !emailValid;
  }, [email]);
  const passwordHasError = useMemo(() => {
    if (password === '') return false;
    return password.length < 8;
  }, [password]);

  const emailHelperText = useMemo(() => (emailHasError ? 'Invalid email format' : ''), [emailHasError]);

  const handleLogin = async () => {
    if (email && password) {
      try {
        await dispatch(login({ email, password })).unwrap();
      } catch (error) {
        console.error(error);
      }
    } else {
      dispatch(showNotification({ message: 'Please provide an email and password', type: NotificationType.Error }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.light' }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Login</Typography>
          <Box sx={{ mt: 1 }} onKeyDown={handleKeyDown}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="loginEmailText"
              label="Email"
              name="email"
              type="email"
              autoFocus
              value={email}
              autoComplete="true"
              onChange={(e) => setEmail(e.target.value)}
              helperText={emailHelperText}
              error={emailHasError}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="logisPasswordText"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              helperText="Password must be at least 8 characters"
              error={passwordHasError}
            />

            <Button id="loginButton" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogin}>
              Login
            </Button>
            <Grid container justifyContent={'flex-end'}>
              <Grid>
                <Link to="/register">Don't have an account? Register</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
