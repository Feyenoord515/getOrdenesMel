import { useState } from "react";
import PropTypes from "prop-types";
import { Button, TextField, Typography, Box } from "@mui/material";

const userCredentials = {
  admin: "a2?hw1^qU]0N",
  Mauricio: "M8&vQ3!rT5@z",
  Matias: "P4#xW7^kL2*e",
  Octavio: "O9!bR6&yN1@u",
  Guillermo: "G3^tZ8#pF4!m",
};

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
