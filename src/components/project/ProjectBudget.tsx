import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";
import {
  DollarSign,
  Plus,
  Receipt,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Tag,
  Edit2,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  receipt?: string;
  notes?: string;
  addedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface ProjectBudget {
  totalBudget: number;
  spent: number;
  remaining: number;
  expenses: Expense[];
  categories: {
    name: string;
    budget: number;
    spent: number;
  }[];
}

interface ProjectBudgetProps {
  budget: ProjectBudget;
  isClient: boolean;
  onAddExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  onUpdateExpense: (expenseId: string, expense: Partial<Expense>) => Promise<void>;
  onDeleteExpense: (expenseId: string) => Promise<void>;
  onUpdateBudget: (newBudget: number) => Promise<void>;
}

const ProjectBudget: React.FC<ProjectBudgetProps> = ({
  budget,
  isClient,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onUpdateBudget
}) => {
  const { toast } = useToast();
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    notes: '',
    receipt: ''
  });
  const [newBudget, setNewBudget] = useState(budget.totalBudget.toString());

  const handleAddExpense = async () => {
    if (!newExpense.description.trim() || !newExpense.amount || !newExpense.category || !newExpense.date) return;

    try {
      await onAddExpense({
        description: newExpense.description.trim(),
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
        status: 'pending',
        notes: newExpense.notes.trim() || undefined,
        receipt: newExpense.receipt.trim() || undefined,
        addedBy: {
          id: 'current-user-id', // This should come from your auth context
          name: 'Current User' // This should come from your auth context
        }
      });
      setNewExpense({
        description: '',
        amount: '',
        category: '',
        date: '',
        notes: '',
        receipt: ''
      });
      setIsAddingExpense(false);
      toast({
        title: "Success",
        description: "Expense added successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateExpense = async (expenseId: string, updates: Partial<Expense>) => {
    try {
      await onUpdateExpense(expenseId, updates);
      setEditingExpense(null);
      toast({
        title: "Success",
        description: "Expense updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update expense. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await onDeleteExpense(expenseId);
      toast({
        title: "Success",
        description: "Expense deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateBudget = async () => {
    const newBudgetAmount = parseFloat(newBudget);
    if (isNaN(newBudgetAmount) || newBudgetAmount <= 0) return;

    try {
      await onUpdateBudget(newBudgetAmount);
      setIsEditingBudget(false);
      toast({
        title: "Success",
        description: "Budget updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update budget. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: Expense['status']) => {
    const statusConfig: Record<Expense['status'], { color: string; icon: React.ReactNode }> = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-4 w-4" />
      },
      approved: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle2 className="h-4 w-4" />
      },
      rejected: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <X className="h-4 w-4" />
      }
    };

    const { color, icon } = statusConfig[status];
    return (
      <Badge variant="outline" className={color}>
        {icon}
        <span className="ml-1">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </Badge>
    );
  };

  const getBudgetStatus = (spent: number, total: number) => {
    const percentage = (spent / total) * 100;
    if (percentage >= 90) {
      return 'text-red-600';
    } else if (percentage >= 75) {
      return 'text-yellow-600';
    }
    return 'text-green-600';
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle>Project Budget</CardTitle>
          {isClient && (
            <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter expense description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Enter category"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={newExpense.notes}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add any additional notes"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receipt">Receipt URL (Optional)</Label>
                    <Input
                      id="receipt"
                      value={newExpense.receipt}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, receipt: e.target.value }))}
                      placeholder="Enter receipt URL"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingExpense(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddExpense}
                      disabled={!newExpense.description.trim() || !newExpense.amount || !newExpense.category || !newExpense.date}
                    >
                      Add Expense
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Budget Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Budget Overview</h3>
            {isClient && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingBudget(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Budget
              </Button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-gray-500">
                <DollarSign className="h-4 w-4" />
                <span>Total Budget</span>
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {formatCurrency(budget.totalBudget)}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-gray-500">
                <TrendingDown className="h-4 w-4" />
                <span>Spent</span>
              </div>
              <div className={`mt-2 text-2xl font-semibold ${getBudgetStatus(budget.spent, budget.totalBudget)}`}>
                {formatCurrency(budget.spent)}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-gray-500">
                <TrendingUp className="h-4 w-4" />
                <span>Remaining</span>
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {formatCurrency(budget.remaining)}
              </div>
            </div>
          </div>
          <Progress
            value={(budget.spent / budget.totalBudget) * 100}
            className="h-2"
          />
        </div>

        {/* Budget Categories */}
        <div className="space-y-4">
          <h3 className="font-medium">Budget Categories</h3>
          <div className="space-y-4">
            {budget.categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span>{category.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {formatCurrency(category.spent)} of {formatCurrency(category.budget)}
                    </span>
                    <span className={`text-sm ${getBudgetStatus(category.spent, category.budget)}`}>
                      {Math.round((category.spent / category.budget) * 100)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={(category.spent / category.budget) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="space-y-4">
          <h3 className="font-medium">Recent Expenses</h3>
          {budget.expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No expenses have been recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {budget.expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{expense.description}</span>
                      {getStatusBadge(expense.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatCurrency(expense.amount)}</span>
                      <span>•</span>
                      <span>{expense.category}</span>
                      <span>•</span>
                      <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  {isClient && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingExpense(expense.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectBudget; 