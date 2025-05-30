
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: number;
  titulo: string;
  texto: string;
}

const API_BASE_URL = 'https://dev-web-09-crud.onrender.com/api/notes';

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ titulo: '', texto: '' });
  const [newNote, setNewNote] = useState({ titulo: '', texto: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar as notas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new note
  const createNote = async () => {
    if (!newNote.titulo.trim() || !newNote.texto.trim()) {
      toast({
        title: "Erro",
        description: "Título e texto são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) throw new Error('Failed to create note');

      toast({
        title: "Sucesso",
        description: "Nota criada com sucesso!",
      });

      setNewNote({ titulo: '', texto: '' });
      setShowCreateForm(false);
      fetchNotes();
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar a nota",
        variant: "destructive",
      });
    }
  };

  // Update note
  const updateNote = async (id: number) => {
    if (!editForm.titulo.trim() || !editForm.texto.trim()) {
      toast({
        title: "Erro",
        description: "Título e texto são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error('Failed to update note');

      toast({
        title: "Sucesso",
        description: "Nota atualizada com sucesso!",
      });

      setEditingId(null);
      setEditForm({ titulo: '', texto: '' });
      fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar a nota",
        variant: "destructive",
      });
    }
  };

  // Delete note
  const deleteNote = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta nota?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');

      toast({
        title: "Sucesso",
        description: "Nota deletada com sucesso!",
      });

      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Erro",
        description: "Falha ao deletar a nota",
        variant: "destructive",
      });
    }
  };

  // Start editing a note
  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditForm({ titulo: note.titulo, texto: note.texto });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ titulo: '', texto: '' });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando notas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Minhas Notas</h1>
          <p className="text-gray-600">Gerencie suas notas de forma simples e eficiente</p>
        </div>

        {/* Create Note Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg"
          >
            <Plus size={20} />
            {showCreateForm ? 'Cancelar' : 'Nova Nota'}
          </Button>
        </div>

        {/* Create Note Form */}
        {showCreateForm && (
          <Card className="mb-8 shadow-lg border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800">Criar Nova Nota</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Input
                  placeholder="Título da nota"
                  value={newNote.titulo}
                  onChange={(e) => setNewNote({ ...newNote, titulo: e.target.value })}
                  className="border-blue-200 focus:border-blue-400"
                />
                <Textarea
                  placeholder="Conteúdo da nota"
                  value={newNote.texto}
                  onChange={(e) => setNewNote({ ...newNote, texto: e.target.value })}
                  rows={4}
                  className="border-blue-200 focus:border-blue-400"
                />
                <div className="flex gap-2">
                  <Button onClick={createNote} className="bg-green-600 hover:bg-green-700">
                    <Save size={16} className="mr-2" />
                    Salvar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewNote({ titulo: '', texto: '' });
                    }}
                  >
                    <X size={16} className="mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma nota encontrada</h3>
            <p className="text-gray-500">Clique em "Nova Nota" para criar sua primeira nota</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  {editingId === note.id ? (
                    <Input
                      value={editForm.titulo}
                      onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                      className="font-semibold text-lg border-blue-200 focus:border-blue-400"
                    />
                  ) : (
                    <CardTitle className="text-lg text-gray-800 line-clamp-2">{note.titulo}</CardTitle>
                  )}
                </CardHeader>
                <CardContent>
                  {editingId === note.id ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editForm.texto}
                        onChange={(e) => setEditForm({ ...editForm, texto: e.target.value })}
                        rows={4}
                        className="border-blue-200 focus:border-blue-400"
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateNote(note.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save size={14} className="mr-1" />
                          Salvar
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X size={14} className="mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-600 line-clamp-4">{note.texto}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => startEdit(note)}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit3 size={14} className="mr-1" />
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => deleteNote(note.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Deletar
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
