import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid, GridToolbar, frFR } from '@mui/x-data-grid';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/services/users';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Load users from API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const data = await getUsers(page, 10);
      // API returns { students: [...], total }
      setUsers(data.students || []);
      setPagination({ page, total: data.total || 0 });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur de chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Tous les champs sont requis');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      if (editingUser) {
        // Modifier élève existant
        const response = await updateUser(editingUser.id, formData);
        if (response.success) {
          await loadUsers(pagination.page); // Reload current page
        }
      } else {
        // Ajouter nouvel élève
        const response = await createUser(formData);
        if (response.success) {
          await loadUsers(1); // Go to first page to see new user
        }
      }
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      try {
        setError('');
        const response = await deleteUser(userId);
        if (response.success) {
          await loadUsers(pagination.page);
        }
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  // Détails élève via clic sur le tableau
  const openUserDetails = (user) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  const closeUserDetails = () => {
    setDetailOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des élèves...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Élèves
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez les comptes élèves et leurs professeurs associés ({pagination.total} total)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ 
            px: 3,
            py: 1.5,
            fontWeight: 500,
          }}
        >
          Ajouter un élève
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Section cartes dépliables retirée - les détails sont accessibles via clic sur le tableau */}

      {/* Tableau de données */}
      <Box sx={{ 
        height: 400, 
        width: '100%',
        '& .MuiDataGrid-toolbarContainer': {
          p: 1,
          gap: 1,
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
        },
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
        '& .MuiDataGrid-row:hover': {
          cursor: 'pointer',
          backgroundColor: '#F9FAFB',
        },
      }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 300, placeholder: 'Rechercher…' },
            },
          }}
          sortingOrder={["asc", "desc"]}
          onRowClick={(params) => openUserDetails(params.row)}
        />
      </Box>

      {/* Dialog pour ajouter/modifier un élève */}
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
            {editingUser ? 'Modifier l\'élève' : 'Ajouter un élève'}
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
            disabled={submitting}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {submitting ? <CircularProgress size={20} /> : (editingUser ? 'Modifier' : 'Ajouter')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Détails élève */}
      <Dialog 
        open={detailOpen} 
        onClose={closeUserDetails} 
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
            Détails élève
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedUser && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                {selectedUser.name} ({selectedUser.email})
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>📞 {selectedUser.phone}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>📅 Créé le {selectedUser.createdAt}</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                Professeurs associés
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedUser.teachers && selectedUser.teachers.length > 0 ? (
                  selectedUser.teachers.map((teacher) => (
                    <Chip
                      key={teacher.id}
                      label={`${teacher.name} - ${teacher.subject}`}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 1.5 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">Aucun professeur associé</Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeUserDetails} sx={{ borderRadius: 2 }}>
            Fermer
          </Button>
          {selectedUser && (
            <Button onClick={() => { closeUserDetails(); handleEdit(selectedUser); }} variant="contained" sx={{ borderRadius: 2, px: 3 }}>
              Modifier
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Users;
