import { useEffect, useState } from 'react'
import { api } from '../api'
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, Stack
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'

type Product = { id: number; name: string; price: number; stock: number }

export default function Dashboard() {
  const [rows, setRows] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const [selection, setSelection] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  })
  const selectedId = selection.ids.size > 0 ? Array.from(selection.ids)[0] : undefined

  // Controlled form state
  const [formValues, setFormValues] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
  })

  const fetchData = async () => {
    setLoading(true)
    const { data } = await api.get<Product[]>('/products')
    setRows(data)
    setLoading(false)
  }
  useEffect(() => { fetchData() }, [])

  const columns: GridColDef<Product>[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      type: 'number',
      valueFormatter: (params: { value: number }) =>
        params.value != null ? `₹${params.value}` : '₹0'
    },
    { field: 'stock', headerName: 'Stock', width: 100, type: 'number' }
  ]

  const onAdd = () => {
    setEditing(null)
    setFormValues({ name: '', price: 0, stock: 0 })
    setOpen(true)
  }

  const onEdit = () => {
    if (selectedId == null) return
    const item = rows.find(r => r.id === selectedId)
    if (item) {
      setEditing(item)
      setFormValues({ name: item.name, price: item.price, stock: item.stock })
      setOpen(true)
    }
  }

  const onDelete = async () => {
    if (selectedId == null) return
    await api.delete(`/products/${selectedId}`)
    fetchData()
  }

  const onSave = async () => {
    const payload = { ...formValues }
    if (editing && editing.id) {
      await api.put(`/products/${editing.id}`, payload)
    } else {
      await api.post('/products', payload)
    }
    setOpen(false)
    setEditing(null)
    fetchData()
  }

  return (
    <Box sx={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(230, 4, 140, 0)'
    }}>
      <Paper elevation={4} sx={{ p: 4, width: '90%', maxWidth: 1000 }}>
        <Stack gap={2}>
          <Typography variant="h5" textAlign="center">Dashboard</Typography>
          <Stack direction="row" gap={1} mb={1} justifyContent="center">
            <Button variant="contained" onClick={onAdd}>Add</Button>
            <Button variant="outlined" onClick={onEdit} disabled={!selectedId}>Edit</Button>
            <Button variant="outlined" color="error" onClick={onDelete} disabled={!selectedId}>Delete</Button>
          </Stack>
          <div style={{ height: 420 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              rowSelectionModel={selection}
              onRowSelectionModelChange={(model) => setSelection(model)}
            />
          </div>
        </Stack>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <TextField
            label="Name"
            value={formValues.name}
            onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
            required
          />
          <TextField
            label="Price"
            type="number"
            inputProps={{ step: "any" }}
            value={formValues.price}
            onChange={(e) => setFormValues({ ...formValues, price: Number(e.target.value) })}
            required
          />
          <TextField
            label="Stock"
            type="number"
            value={formValues.stock}
            onChange={(e) => setFormValues({ ...formValues, stock: Number(e.target.value) })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={onSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
