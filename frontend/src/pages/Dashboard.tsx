import { useEffect, useState } from 'react';
import { api } from '../api';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, Stack
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';

type Product = { id: number; name: string; price: number; stock: number };

// Shape we may receive from the API (handles alt keys / cases)
type ApiProduct = {
  id?: number | string; ID?: number | string;
  name?: string; NAME?: string;
  price?: number | string; PRICE?: number | string; amount?: number | string;
  stock?: number | string; STOCK?: number | string;
};

export default function Dashboard() {
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // v6 object selection model
  const [selection, setSelection] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set<GridRowId>(),
  });

  const selectedCount =
    Array.isArray(selection) ? selection.length : (selection.ids?.size ?? 0);

  const selectedId = (() => {
    if (Array.isArray(selection)) return selection.length ? Number(selection[0] as GridRowId) : undefined;
    const ids = Array.from(selection.ids ?? []);
    return ids.length ? Number(ids[0] as GridRowId) : undefined;
  })();

  const [formValues, setFormValues] = useState({ name: '', price: '', stock: '' });

  // ---- FETCH with normalization (no `any`)
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<ApiProduct[]>('/products');

      const norm = (r: ApiProduct): Product => ({
        id: Number(r.id ?? r.ID),
        name: String(r.name ?? r.NAME ?? ''),
        price: Number(r.price ?? r.PRICE ?? r.amount ?? 0),
        stock: Number(r.stock ?? r.STOCK ?? 0),
      });

      const rowsNorm: Product[] = Array.isArray(data) ? data.map(norm) : [];
      setRows(rowsNorm);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, []);

  // ---- Columns (render price explicitly)
  const columns: GridColDef<Product>[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'price',
      headerName: 'Price',
      width: 140,
      renderCell: (params) => {
        const n = Number((params.row as Product).price ?? 0);
        return Number.isFinite(n) ? `₹${n.toFixed(2)}` : '₹0.00';
      },
      sortComparator: (v1, v2) => Number(v1) - Number(v2),
    },
    { field: 'stock', headerName: 'Stock', width: 100, type: 'number' },
  ];

  const onAdd = () => {
    setEditing(null);
    setFormValues({ name: '', price: '', stock: '' });
    setOpen(true);
  };

  const onEdit = () => {
    if (selectedId == null) return;
    const item = rows.find((r) => r.id === selectedId);
    if (item) {
      setEditing(item);
      setFormValues({
        name: item.name,
        price: String(item.price ?? ''),
        stock: String(item.stock ?? ''),
      });
      setOpen(true);
    }
  };

  const onDelete = async () => {
    if (selectedId == null) return;
    await api.delete(`/products/${selectedId}`);
    await fetchData();
  };

  const onSave = async () => {
    const { name, price, stock } = formValues;
    if (!name.trim()) return alert('Name is required');

    const nPrice = Number(price);
    const nStock = Number(stock);
    if (!Number.isFinite(nPrice) || nPrice < 0) return alert('Price must be a valid number ≥ 0');
    if (!Number.isFinite(nStock) || nStock < 0) return alert('Stock must be a valid number ≥ 0');

    const payload = { name: name.trim(), price: nPrice, stock: nStock };

    try {
      setSaving(true);
      if (editing?.id) {
        await api.put(`/products/${editing.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      await fetchData();
      setOpen(false);
      setEditing(null);
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      alert(status ? `Failed (HTTP ${status})` : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectionChange = (model: GridRowSelectionModel) => setSelection(model);

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1976D2' }}>
      <Paper elevation={4} sx={{ p: 4, width: '90%', maxWidth: 1000, borderRadius: 2, backgroundColor: '#fff' }}>
        <Stack gap={2}>
          <Typography variant="h5" textAlign="center">Dashboard</Typography>

          <Stack direction="row" gap={1} mb={1} justifyContent="center">
            <Button variant="contained" onClick={onAdd}>Add</Button>
            <Button variant="outlined" onClick={onEdit} disabled={selectedCount === 0}>Edit</Button>
            <Button variant="outlined" color="error" onClick={onDelete} disabled={selectedCount === 0}>Delete</Button>
          </Stack>

          <div style={{ height: 420 }}>
            <DataGrid
              aria-label="Products table"
              rows={rows}
              columns={columns}
              loading={loading}
              rowSelectionModel={selection}
              onRowSelectionModelChange={handleSelectionChange}
              disableRowSelectionOnClick={false}
              getRowId={(row) => row.id}
              onRowDoubleClick={() => onEdit()}
            />
          </div>
        </Stack>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth aria-labelledby="product-dialog-title">
        <DialogTitle id="product-dialog-title">{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <Box component="div">
          <DialogContent sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Name"
              value={formValues.name}
              onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
              required
              autoFocus
            />
            <TextField
              label="Price"
              type="number"
              inputProps={{ step: 'any' }}
              value={formValues.price}
              onChange={(e) => setFormValues((prev) => ({ ...prev, price: e.target.value }))}
              required
            />
            <TextField
              label="Stock"
              type="number"
              value={formValues.stock}
              onChange={(e) => setFormValues((prev) => ({ ...prev, stock: e.target.value }))}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button variant="contained" onClick={onSave} disabled={saving} aria-busy={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
