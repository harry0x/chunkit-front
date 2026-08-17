import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import { Loader2, Edit2, X, Check } from 'lucide-react';

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersList() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit state
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { isActive: !currentStatus });
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };
  
  const startEditing = (user: AdminUser) => {
    setEditingUser(user);
    setEditFullName(user.fullName);
    setEditEmail(user.email);
  };
  
  const cancelEditing = () => {
    setEditingUser(null);
  };
  
  const saveUserEdit = async (id: string) => {
    setSavingEdit(true);
    try {
      await api.patch(`/admin/users/${id}`, { fullName: editFullName, email: editEmail });
      toast.success('User updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user');
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Users Management</h1>
        <p className="text-muted-foreground">View and manage all registered users.</p>
      </div>

      <Card className="glass-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-card-foreground">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-muted/50">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Joined</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.filter(u => u.role !== 'admin').map((user) => (
                    <TableRow key={user.id} className="border-border hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground">
                        {editingUser?.id === user.id ? (
                          <Input 
                            value={editFullName} 
                            onChange={(e) => setEditFullName(e.target.value)}
                            className="h-8 text-sm bg-background text-foreground"
                          />
                        ) : user.fullName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {editingUser?.id === user.id ? (
                          <Input 
                            value={editEmail} 
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="h-8 text-sm bg-background text-foreground"
                          />
                        ) : user.email}
                      </TableCell>
                      <TableCell>
                        <button 
                          onClick={() => toggleStatus(user.id, user.isActive)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            user.isActive 
                              ? 'bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/30' 
                              : 'bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {editingUser?.id === user.id ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-500/10 border-border"
                                onClick={() => saveUserEdit(user.id)}
                                disabled={savingEdit}
                              >
                                {savingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-border"
                                onClick={cancelEditing}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 border-border"
                                onClick={() => startEditing(user)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                className="h-8"
                                onClick={() => deleteUser(user.id)}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.filter(u => u.role !== 'admin').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
