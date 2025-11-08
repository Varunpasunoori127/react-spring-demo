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

  const fetchData = async () => {
    setLoading(true)
    const { data } = await api.get<Product[]>('/products')
    console.log('Fetched products:', data)
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
    setEditing({ id: 0, name: '', price: 0, stock: 0 })
    setOpen(true)
  }

  const onEdit = () => {
    if (selectedId == null) return
    const item = rows.find(r => r.id === selectedId)
    if (item) {
      setEditing(item)
      setOpen(true)
    }
  }

  const onDelete = async () => {
    if (selectedId == null) return
    await api.delete(`/products/${selectedId}`)
    fetchData()
  }

  const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)

    console.log('Form values:', {
      name: f.get('name'),
      price: f.get('price'),
      stock: f.get('stock'),
    })

    const payload: Omit<Product, 'id'> = {
      name: String(f.get('name') ?? ''),
      price: Number(f.get('price') ?? 0),
      stock: Number(f.get('stock') ?? 0),
    }

    console.log('Payload to save:', payload)

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
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8'
      }}
    >
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
        <DialogTitle>{editing && editing.id ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <Box component="form" onSubmit={onSave}>
          <DialogContent sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Name" name="name" defaultValue={editing?.name ?? ''} required />
            <TextField label="Price" name="price" type="number" inputProps={{step:"any"}} defaultValue={editing?.price ?? 100} required />
            <TextField label="Stock" name="stock" type="number" defaultValue={editing?.stock ?? 0} required />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}
