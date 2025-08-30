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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { formatFCFA } from '../../utils/currency';

function Teachers() {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: 'Marie Martin',
      email: 'marie.martin@email.com',
      phone: '0123456789',
      subject: 'Mathématiques',
      experience: '5 ans',
      rate: 25,
      createdAt: '2024-01-10',
      students: [
        { id: 1, name: 'Jean Dupont', level: 'Terminale' },
        { id: 4, name: 'Alice Petit', level: '1ère' },
      ],
    },
    {
      id: 2,
      name: 'Pierre Durand',
      email: 'pierre.durand@email.com',
      phone: '0987654321',
      subject: 'Physique',
      experience: '8 ans',
      rate: 30,
      createdAt: '2024-01-15',
      students: [
        { id: 1, name: 'Jean Dupont', level: 'Terminale' },
      ],
    },
    {
      id: 3,
      name: 'Paul Moreau',
      email: 'paul.moreau@email.com',
      phone: '0147258369',
      subject: 'Français',
      experience: '3 ans',
      rate: 22,
      createdAt: '2024-02-01',
      students: [
        { id: 2, name: 'Sophie Lambert', level: '2nde' },
      ],
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    experience: '',
    rate: '',
  });

  const subjects = [
    'Mathématiques',
    'Physique',
    'Chimie',
    'Français',
    'Anglais',
    'Histoire',
    'Géographie',
    'SVT',
    'Philosophie',
    'Économie',
  ];

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

  const handleSubmit = () => {
    if (editingTeacher) {
      // Modifier professeur existant
      setTeachers(teachers.map(teacher => 
        teacher.id === editingTeacher.id 
          ? { ...teacher, ...formData, rate: parseFloat(formData.rate) }
          : teacher
      ));
    } else {
      // Ajouter nouveau professeur
      const newTeacher = {
        id: Math.max(...teachers.map(t => t.id)) + 1,
        ...formData,
        rate: parseFloat(formData.rate),
        createdAt: new Date().toISOString().split('T')[0],
        students: [],
      };
      setTeachers([...teachers, newTeacher]);
    }
    handleClose();
  };

  const handleDelete = (teacherId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce professeur ?')) {
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Gestion des Professeurs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Ajouter un professeur
        </Button>
      </Box>

      {/* Liste des professeurs avec leurs élèves */}
      <Box sx={{ mb: 3 }}>
        {teachers.map((teacher) => (
          <Accordion key={teacher.id} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography variant="h6">{teacher.name}</Typography>
                <Chip label={teacher.subject} size="small" color="primary" />
                <Typography color="textSecondary">({formatFCFA(teacher.rate)} / h)</Typography>
                <Chip 
                  label={`${teacher.students.length} élève(s)`}
                  size="small"
                  color={teacher.students.length > 0 ? 'success' : 'default'}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Informations professionnelles:
                </Typography>
                <Typography variant="body2">Email: {teacher.email}</Typography>
                <Typography variant="body2">Téléphone: {teacher.phone}</Typography>
                <Typography variant="body2">Expérience: {teacher.experience}</Typography>
                <Typography variant="body2">Date de création: {teacher.createdAt}</Typography>
                
                {teacher.students.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Élèves (utilisateurs):
                    </Typography>
                    {teacher.students.map((student) => (
                      <Chip
                        key={student.id}
                        label={`${student.name} - ${student.level}`}
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                )}
                
                <Box sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(teacher)}
                    sx={{ mr: 1 }}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(teacher.id)}
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
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={teachers}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
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
          <Button onClick={handleSubmit} variant="contained">
            {editingTeacher ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Teachers;
