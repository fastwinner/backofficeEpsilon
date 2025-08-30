import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Undo as UndoIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatFCFA } from '../../utils/currency';

function Transactions() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      amount: 75.00,
      date: '2024-08-20T14:30:00',
      status: 'completed',
      student: { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com' },
      teacher: { id: 1, name: 'Marie Martin', subject: 'Mathématiques' },
      session: { duration: '2h', subject: 'Mathématiques', level: 'Terminale' },
      paymentValidated: true,
      canRefund: true,
    },
    {
      id: 2,
      amount: 60.00,
      date: '2024-08-19T16:00:00',
      status: 'pending',
      student: { id: 2, name: 'Sophie Lambert', email: 'sophie.lambert@email.com' },
      teacher: { id: 3, name: 'Paul Moreau', subject: 'Français' },
      session: { duration: '2h', subject: 'Français', level: '2nde' },
      paymentValidated: false,
      canRefund: true,
    },
    {
      id: 3,
      amount: 90.00,
      date: '2024-08-18T10:15:00',
      status: 'completed',
      student: { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com' },
      teacher: { id: 2, name: 'Pierre Durand', subject: 'Physique' },
      session: { duration: '3h', subject: 'Physique', level: 'Terminale' },
      paymentValidated: true,
      canRefund: false,
    },
    {
      id: 4,
      amount: 50.00,
      date: '2024-08-17T13:45:00',
      status: 'refunded',
      student: { id: 4, name: 'Alice Petit', email: 'alice.petit@email.com' },
      teacher: { id: 1, name: 'Marie Martin', subject: 'Mathématiques' },
      session: { duration: '2h', subject: 'Mathématiques', level: '1ère' },
      paymentValidated: false,
      canRefund: false,
    },
  ]);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: null });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'refunded': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'pending': return 'En attente';
      case 'refunded': return 'Remboursée';
      default: return status;
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 150,
      renderCell: (params) => format(new Date(params.value), 'dd/MM/yyyy HH:mm', { locale: fr }),
    },
    { 
      field: 'amount', 
      headerName: 'Montant', 
      width: 140,
      renderCell: (params) => formatFCFA(params.value),
    },
    {
      field: 'student',
      headerName: 'Élève',
      width: 200,
      renderCell: (params) => params.value.name,
    },
    {
      field: 'teacher',
      headerName: 'Professeur',
      width: 200,
      renderCell: (params) => `${params.value.name} (${params.value.subject})`,
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={getStatusLabel(params.value)}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'paymentValidated',
      headerName: 'Paiement validé',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Oui' : 'Non'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            size="small"
            onClick={() => handleViewDetails(params.row)}
            sx={{ mr: 1 }}
          >
            Détails
          </Button>
        </Box>
      ),
    },
  ];

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseDetails = () => {
    setSelectedTransaction(null);
  };

  const handleRefund = (transaction) => {
    setActionDialog({ open: true, type: 'refund' });
  };

  const handleValidatePayment = (transaction) => {
    setActionDialog({ open: true, type: 'validate' });
  };

  const handleConfirmAction = () => {
    if (actionDialog.type === 'refund') {
      // Effectuer le remboursement
      setTransactions(transactions.map(t => 
        t.id === selectedTransaction.id 
          ? { ...t, status: 'refunded', canRefund: false }
          : t
      ));
    } else if (actionDialog.type === 'validate') {
      // Valider le paiement
      setTransactions(transactions.map(t => 
        t.id === selectedTransaction.id 
          ? { ...t, paymentValidated: true }
          : t
      ));
    }
    setActionDialog({ open: false, type: null });
  };

  const handleCancelAction = () => {
    setActionDialog({ open: false, type: null });
  };

  const totalAmount = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const refundedAmount = transactions
    .filter(t => t.status === 'refunded')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Historique des Transactions
      </Typography>

      {/* Statistiques des transactions */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total des transactions
              </Typography>
              <Typography variant="h5" color="success.main">
                {formatFCFA(totalAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                En attente
              </Typography>
              <Typography variant="h5" color="warning.main">
                {formatFCFA(pendingAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Remboursements
              </Typography>
              <Typography variant="h5" color="error.main">
                {formatFCFA(refundedAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Nombre total
              </Typography>
              <Typography variant="h5">
                {transactions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tableau des transactions */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={transactions}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
        />
      </Box>

      {/* Dialog des détails de transaction */}
      <Dialog 
        open={!!selectedTransaction} 
        onClose={handleCloseDetails} 
        maxWidth="md" 
        fullWidth
      >
        {selectedTransaction && (
          <>
            <DialogTitle>
              Détails de la Transaction #{selectedTransaction.id}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Informations générales */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Informations de paiement
                      </Typography>
                      <Typography><strong>Montant:</strong> {formatFCFA(selectedTransaction.amount)}</Typography>
                      <Typography><strong>Date:</strong> {format(new Date(selectedTransaction.date), 'dd/MM/yyyy à HH:mm', { locale: fr })}</Typography>
                      <Typography>
                        <strong>Statut:</strong> 
                        <Chip
                          label={getStatusLabel(selectedTransaction.status)}
                          color={getStatusColor(selectedTransaction.status)}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                      <Typography>
                        <strong>Paiement validé:</strong> 
                        <Chip
                          label={selectedTransaction.paymentValidated ? 'Oui' : 'Non'}
                          color={selectedTransaction.paymentValidated ? 'success' : 'default'}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Informations de la séance */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Détails de la séance
                      </Typography>
                      <Typography><strong>Matière:</strong> {selectedTransaction.session.subject}</Typography>
                      <Typography><strong>Niveau:</strong> {selectedTransaction.session.level}</Typography>
                      <Typography><strong>Durée:</strong> {selectedTransaction.session.duration}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Informations élève */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Élève
                      </Typography>
                      <Typography><strong>Nom:</strong> {selectedTransaction.student.name}</Typography>
                      <Typography><strong>Email:</strong> {selectedTransaction.student.email}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Informations professeur */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Professeur
                      </Typography>
                      <Typography><strong>Nom:</strong> {selectedTransaction.teacher.name}</Typography>
                      <Typography><strong>Matière:</strong> {selectedTransaction.teacher.subject}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Actions disponibles */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                {selectedTransaction.canRefund && selectedTransaction.status !== 'refunded' && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<UndoIcon />}
                    onClick={() => handleRefund(selectedTransaction)}
                  >
                    Rembourser le client
                  </Button>
                )}
                
                {!selectedTransaction.paymentValidated && selectedTransaction.status !== 'refunded' && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleValidatePayment(selectedTransaction)}
                  >
                    Valider le paiement prof
                  </Button>
                )}
              </Box>

              {selectedTransaction.status === 'refunded' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Cette transaction a été remboursée et ne peut plus être modifiée.
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Fermer</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog de confirmation d'action */}
      <Dialog open={actionDialog.open} onClose={handleCancelAction}>
        <DialogTitle>
          {actionDialog.type === 'refund' ? 'Confirmer le remboursement' : 'Confirmer la validation'}
        </DialogTitle>
        <DialogContent>
          {actionDialog.type === 'refund' ? (
            <Typography>
              Êtes-vous sûr de vouloir rembourser cette transaction ? 
              Le montant de {formatFCFA(selectedTransaction?.amount)} sera retourné au client.
            </Typography>
          ) : (
            <Typography>
              Êtes-vous sûr de vouloir valider le paiement du professeur ? 
              Le montant de {formatFCFA(selectedTransaction?.amount)} sera versé au professeur.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAction}>Annuler</Button>
          <Button 
            onClick={handleConfirmAction} 
            variant="contained"
            color={actionDialog.type === 'refund' ? 'error' : 'success'}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Transactions;
