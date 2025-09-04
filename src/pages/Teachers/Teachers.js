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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid, GridToolbar, frFR } from '@mui/x-data-grid';
import { formatFCFA } from '../../utils/currency';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher, getSubjects } from '../../api/services/teachers';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });
  const [subjects, setSubjects] = useState([]);

  const [open, setOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    experience: '',
    rate: '',
  });

  // Load teachers and subjects from API
  useEffect(() => {
    loadTeachers();
    loadSubjects();
  }, []);

  const loadTeachers = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const data = await getTeachers(page, 10);
      setTeachers(data.teachers || []);
      setPagination({ page, total: data.total || 0 });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur de chargement des professeurs');
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data.subjects || []);
    } catch (err) {
      // Fallback to default subjects if API fails
      setSubjects([
        'Mathématiques', 'Physique', 'Chimie', 'Français', 'Anglais',
        'Histoire', 'Géographie', 'SVT', 'Philosophie', 'Économie'
      ]);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nom', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'subject', headerName: 'Matière', width: 150 },
    { 
      field: 'rate', 
      headerName: 'Tarif/h', 
      width: 140,
      renderCell: (params) => `${formatFCFA(params.value)} / h`,
    },
    { 
      field: 'studentsCount', 
      headerName: 'Nb Élèves', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.row.students.length} 
          color={params.row.students.length > 0 ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    { field: 'experience', headerName: 'Expérience', width: 120 },
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
    setEditingTeacher(null);
    setFormData({ name: '', email: '', phone: '', subject: '', experience: '', rate: '' });
    setOpen(true);
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.subject,
      experience: teacher.experience,
      rate: teacher.rate,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTeacher(null);
    setFormData({ name: '', email: '', phone: '', subject: '', experience: '', rate: '' });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.rate) {
      setError('Tous les champs sont requis');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const teacherData = {
        ...formData,
        rate: parseFloat(formData.rate)
      };
      
      if (editingTeacher) {
        // Modifier professeur existant
        const response = await updateTeacher(editingTeacher.id, teacherData);
        if (response.success) {
          await loadTeachers(pagination.page);
        }
      } else {
        // Ajouter nouveau professeur
        const response = await createTeacher(teacherData);
        if (response.success) {
          await loadTeachers(1);
        }
      }
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce professeur ?')) {
      try {
        setError('');
        const response = await deleteTeacher(teacherId);
        if (response.success) {
          await loadTeachers(pagination.page);
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

  const openTeacherDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setDetailOpen(true);
  };

  const closeTeacherDetails = () => {
    setDetailOpen(false);
    setSelectedTeacher(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des professeurs...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Professeurs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez les comptes professeurs et leurs élèves ({pagination.total} total)
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
          Ajouter un professeur
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
          rows={teachers}
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
          onRowClick={(params) => openTeacherDetails(params.row)}
        />
      </Box>

      {/* Dialog pour ajouter/modifier un professeur */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTeacher ? 'Modifier le professeur' : 'Ajouter un professeur'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom complet"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange('name')}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange('email')}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Téléphone"
            fullWidth
            variant="outlined"
            value={formData.phone}
            onChange={handleInputChange('phone')}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Matière</InputLabel>
            <Select
              value={formData.subject}
              label="Matière"
              onChange={handleInputChange('subject')}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject} value={subject}>
                  {subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Expérience"
            fullWidth
            variant="outlined"
            value={formData.experience}
            onChange={handleInputChange('experience')}
            placeholder="ex: 5 ans"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Tarif horaire (FCFA)"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.rate}
            onChange={handleInputChange('rate')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : (editingTeacher ? 'Modifier' : 'Ajouter')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Détails professeur */}
      <Dialog 
        open={detailOpen} 
        onClose={closeTeacherDetails} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          Détails professeur
        </DialogTitle>
        <DialogContent>
          {selectedTeacher && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {selectedTeacher.name} - {selectedTeacher.subject}
              </Typography>
              <Typography variant="body2">Email: {selectedTeacher.email}</Typography>
              <Typography variant="body2">Téléphone: {selectedTeacher.phone}</Typography>
              <Typography variant="body2">Expérience: {selectedTeacher.experience}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Tarif: {formatFCFA(selectedTeacher.rate)} / h</Typography>
              <Typography variant="subtitle2" gutterBottom>Élèves:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedTeacher.students && selectedTeacher.students.length > 0 ? (
                  selectedTeacher.students.map((student) => (
                    <Chip key={student.id} label={`${student.name} - ${student.level}`} variant="outlined" />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">Aucun élève</Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTeacherDetails}>Fermer</Button>
          {selectedTeacher && (
            <Button onClick={() => { closeTeacherDetails(); handleEdit(selectedTeacher); }} variant="contained">
              Modifier
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Teachers;
