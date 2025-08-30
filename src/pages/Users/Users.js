import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      phone: '0123456789',
      createdAt: '2024-01-15',
      teachers: [
        { id: 1, name: 'Marie Martin', subject: 'Mathématiques' },
        { id: 2, name: 'Pierre Durand', subject: 'Physique' },
      ],
    },
    {
      id: 2,
      name: 'Sophie Lambert',
      email: 'sophie.lambert@email.com',
      phone: '0987654321',
      createdAt: '2024-02-20',
      teachers: [
        { id: 3, name: 'Paul Moreau', subject: 'Français' },
      ],
    },
    {
      id: 3,
      name: 'Michel Bernard',
      email: 'michel.bernard@email.com',
      phone: '0147258369',
      createdAt: '2024-03-10',
      teachers: [],
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nom', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Téléphone', width: 150 },
    { 
      field: 'teachersCount', 
      headerName: 'Nb Professeurs', 
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.row.teachers.length} 
          color={params.row.teachers.length > 0 ? 'primary' : 'default'}
          size="small"
        />
      ),
    },
    { field: 'createdAt', headerName: 'Date création', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleOpen = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', phone: '' });
    setOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', phone: '' });
  };

  const handleSubmit = () => {
    if (editingUser) {
      // Modifier utilisateur existant
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
    } else {
      // Ajouter nouvel utilisateur
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        teachers: [],
      };
      setUsers([...users, newUser]);
    }
    handleClose();
  };

  const handleDelete = (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Utilisateurs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez les comptes utilisateurs et leurs professeurs associés
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 500,
          }}
        >
          Ajouter un utilisateur
        </Button>
      </Box>

      {/* Liste des utilisateurs avec leurs professeurs */}
      <Box sx={{ mb: 4 }}>
        {users.map((user) => (
          <Accordion 
            key={user.id} 
            sx={{ 
              mb: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px !important',
              '&.Mui-expanded': {
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                px: 3,
                py: 2,
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">({user.email})</Typography>
                <Chip 
                  label={`${user.teachers.length} prof(s)`}
                  size="small"
                  color={user.teachers.length > 0 ? 'primary' : 'default'}
                  sx={{ borderRadius: 1.5 }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pt: 0, pb: 3 }}>
              <Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                      Informations personnelles
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>📞 {user.phone}</Typography>
                    <Typography variant="body2">📅 Créé le {user.createdAt}</Typography>
                  </Box>
                  
                  {user.teachers.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                        Professeurs associés
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {user.teachers.map((teacher) => (
                          <Chip
                            key={teacher.id}
                            label={`${teacher.name} - ${teacher.subject}`}
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: 1.5 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(user)}
                    sx={{ borderRadius: 2 }}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(user.id)}
                    sx={{ borderRadius: 2 }}
                  >
                    Supprimer
                  </Button>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Tableau de données */}
      <Box sx={{ 
        height: 400, 
        width: '100%',
        '& .MuiDataGrid-root': {
          border: '1px solid #e2e8f0',
          borderRadius: 3,
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
        },
        '& .MuiDataGrid-cell': {
          borderBottom: '1px solid #f1f5f9',
        },
      }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </Box>

      {/* Dialog pour ajouter/modifier un utilisateur */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nom complet"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange('name')}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange('email')}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            label="Téléphone"
            fullWidth
            variant="outlined"
            value={formData.phone}
            onChange={handleInputChange('phone')}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose}
            sx={{ borderRadius: 2 }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ borderRadius: 2, px: 3 }}
          >
            {editingUser ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Users;
