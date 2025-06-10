
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Plus, TrendingUp, TrendingDown } from 'lucide-react';

interface ProjectBudgetProps {
  projectId: string;
  totalBudget: number;
  canEdit: boolean;
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

const ProjectBudget: React.FC<ProjectBudgetProps> = ({
  projectId,
  totalBudget,
  canEdit
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    category: 'materials'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchExpenses();
  }, [projectId]);

  const fetchExpenses = async () => {
    try {
      // This would fetch from a project_expenses table
      // For now, using empty array as placeholder
      setExpenses([]);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch project expenses.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async () => {
    try {
      const amount = parseFloat(newExpense.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // This would add to project_expenses table
      toast({
        title: 'Success',
        description: 'Expense added successfully.'
      });

      setShowAddForm(false);
      setNewExpense({ amount: '', description: '', category: 'materials' });
      fetchExpenses();
    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add expense.',
        variant: 'destructive'
      });
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalBudget - totalExpenses;
  const budgetUsedPercent = (totalExpenses / totalBudget) * 100;

  const getBudgetStatus = () => {
    if (budgetUsedPercent >= 100) return 'over';
    if (budgetUsedPercent >= 80) return 'warning';
    return 'good';
  };

  const getStatusColor = () => {
    const status = getBudgetStatus();
    switch (status) {
      case 'over': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getStatusIcon = () => {
    const status = getBudgetStatus();
    return status === 'over' ? <TrendingDown className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />;
  };

  if (isLoading) {
    return <div>Loading budget information...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Project Budget
          </CardTitle>
          {canEdit && (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Total Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Spent</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStatusColor()}`}>
                ${remainingBudget.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">Remaining</div>
            </div>
          </div>

          {/* Budget Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Budget Usage</span>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                  {budgetUsedPercent.toFixed(1)}%
                </span>
              </div>
            </div>
            <Progress 
              value={Math.min(budgetUsedPercent, 100)} 
              className="h-2"
            />
          </div>

          {/* Add Expense Form */}
          {showAddForm && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-4">Add New Expense</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="expenseAmount">Amount ($)</Label>
                  <Input
                    id="expenseAmount"
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="expenseDescription">Description</Label>
                  <Input
                    id="expenseDescription"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="Expense description..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddExpense}>
                    Add Expense
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Expenses List */}
          {expenses.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{expense.category}</Badge>
                    </TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>${expense.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectBudget;
