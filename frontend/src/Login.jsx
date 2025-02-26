import { useState } from "react";
import PropTypes from "prop-types";
import { Button, TextField, Typography, Box } from "@mui/material";

const userCredentials = {
  admin: import.meta.env.VITE_ADMIN,
  Mauricio: import.meta.env.VITE_MAURICIO,
  Matias: import.meta.env.VITE_MATIAS,
  Octavio: import.meta.env.VITE_OCTAVIO,
  Guillermo: import.meta.env.VITE_GUILLERMO,
}

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (userCredentials[username] === password) {
      onLogin(username);
    } else {
      setError("Credenciales incorrectas");
    }
  };
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f4f6f8"
      p={2}
    >
      <Typography variant="h4" color="primary" mb={3}>
        Iniciar Sesión
      </Typography>
      <Box mb={2}>
        <TextField
          label="Usuario"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contraseña"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
      </Box>
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        style={{ padding: "10px 20px" }}
      >
        Iniciar Sesión
      </Button>
    </Box>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};
