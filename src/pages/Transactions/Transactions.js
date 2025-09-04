import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Undo as UndoIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { DataGrid, GridToolbar, frFR } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatFCFA } from '../../utils/currency';
import { getTransactions, refundTransaction, validatePayment } from '../../api/services/transactions';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });
  const [page, setPage] = useState(0); // DataGrid uses 0-based page index
  const [pageSize, setPageSize] = useState(25);
  const [summary, setSummary] = useState({ totalAmount: 0, pendingAmount: 0, refundedAmount: 0 });

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: null });

  // Load transactions from API
  useEffect(() => {
    loadTransactions(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const loadTransactions = async (pageZeroBased = 0, size = pageSize) => {
    try {
      setLoading(true);
      setError('');
      const apiPage = pageZeroBased + 1; // backend expects 1-based page
      const data = await getTransactions(apiPage, size);
      setTransactions(data.transactions || []);
      setPagination({ page: apiPage, total: data.total || 0 });
      setSummary(data.summary || { totalAmount: 0, pendingAmount: 0, refundedAmount: 0 });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur de chargement des transactions');
    } finally {
      setLoading(false);
    }
  };

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

  const handleConfirmAction = async () => {
    if (!selectedTransaction) return;

    try {
      setSubmitting(true);
      setError('');
      
      if (actionDialog.type === 'refund') {
        const response = await refundTransaction(selectedTransaction.id);
        if (response.success) {
          await loadTransactions(pagination.page);
        }
      } else if (actionDialog.type === 'validate') {
        const response = await validatePayment(selectedTransaction.id);
        if (response.success) {
          await loadTransactions(pagination.page);
        }
      }
      setActionDialog({ open: false, type: null });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur lors de l\'action');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelAction = () => {
    setActionDialog({ open: false, type: null });
  };

  // Use summary from API instead of calculating locally
  const completedCount = transactions.filter(t => t.status === 'completed').length;
  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const refundedCount = transactions.filter(t => t.status === 'refunded').length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des transactions...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Transactions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez les transactions et paiements ({pagination.total} total)
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistiques des séances */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Séances terminées
              </Typography>
              <Typography variant="h5" color="success.main">
                {completedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatFCFA(summary.totalAmount)}
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
                {pendingCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatFCFA(summary.pendingAmount)}
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
                {refundedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatFCFA(summary.refundedAmount)}
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
                {pagination.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tableau des séances */}
      <Box sx={{ 
        height: 600, 
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
          rows={transactions}
          columns={columns}
          paginationMode="server"
          rowCount={pagination.total}
          page={page}
          onPageChange={(newPage) => {
            setPage(newPage);
            loadTransactions(newPage, pageSize);
          }}
          pageSize={pageSize}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
            loadTransactions(0, newSize);
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
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
          onRowClick={(params) => handleViewDetails(params.row)}
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
              Détails de la Séance #{selectedTransaction.id}
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
                  Cette séance a été remboursée et ne peut plus être modifiée.
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
              Êtes-vous sûr de vouloir rembourser cette séance ? 
              Le montant de {formatFCFA(selectedTransaction?.amount)} sera retourné au client.
            </Typography>
          ) : (
            <Typography>
              Êtes-vous sûr de vouloir valider le paiement du professeur pour cette séance ? 
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
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} /> : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Transactions;
