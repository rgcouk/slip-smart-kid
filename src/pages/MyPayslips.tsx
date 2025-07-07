import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { PayslipActions } from '@/components/payslips/PayslipActions';
import { BulkActions } from '@/components/payslips/BulkActions';
import { Search, Plus } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';
type PayslipRow = Database['public']['Tables']['payslips']['Row'];
interface Payslip {
  id: string;
  employee_name: string;
  company_name: string;
  gross_salary: number;
  net_salary: number;
  pay_period_start: string;
  pay_period_end: string;
  created_at: string;
  deductions: Array<{
    id: string;
    name: string;
    amount: number;
  }>;
  child_id: string | null;
  user_id: string;
  updated_at: string;
}
const MyPayslips = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [filteredPayslips, setFilteredPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayslips, setSelectedPayslips] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'employee' | 'company' | 'salary'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const fetchPayslips = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from('payslips').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      });
      if (error) throw error;

      // Transform the data to ensure deductions is properly typed
      const transformedData: Payslip[] = (data || []).map((payslip: PayslipRow) => ({
        ...payslip,
        deductions: Array.isArray(payslip.deductions) ? (payslip.deductions as any[]).filter(d => d && typeof d === 'object' && 'id' in d && 'name' in d && 'amount' in d) : []
      }));
      setPayslips(transformedData);
      setFilteredPayslips(transformedData);
    } catch (error) {
      console.error('Error fetching payslips:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payslips",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPayslips();
  }, [user]);
  useEffect(() => {
    let filtered = payslips.filter(payslip => payslip.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) || payslip.company_name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Sort payslips
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'employee':
          comparison = a.employee_name.localeCompare(b.employee_name);
          break;
        case 'company':
          comparison = a.company_name.localeCompare(b.company_name);
          break;
        case 'salary':
          comparison = a.gross_salary - b.gross_salary;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    setFilteredPayslips(filtered);
  }, [payslips, searchTerm, sortBy, sortOrder]);
  const handleSelectPayslip = (payslipId: string, checked: boolean) => {
    setSelectedPayslips(prev => checked ? [...prev, payslipId] : prev.filter(id => id !== payslipId));
  };
  const handleSelectAll = (checked: boolean) => {
    setSelectedPayslips(checked ? filteredPayslips.map(p => p.id) : []);
  };
  const clearSelection = () => {
    setSelectedPayslips([]);
  };
  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-blue-600">Please sign in to view your payslips.</p>
        </div>
        <Footer />
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-zinc-900">My Payslips</h1>
            <Button onClick={() => window.location.href = '/app'}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Payslip
            </Button>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input placeholder="Search by employee or company..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            
            <select value={`${sortBy}-${sortOrder}`} onChange={e => {
            const [field, order] = e.target.value.split('-');
            setSortBy(field as any);
            setSortOrder(order as any);
          }} className="px-3 py-2 border border-gray-300 rounded-md">
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="employee-asc">Employee A-Z</option>
              <option value="employee-desc">Employee Z-A</option>
              <option value="company-asc">Company A-Z</option>
              <option value="company-desc">Company Z-A</option>
              <option value="salary-desc">Highest Salary</option>
              <option value="salary-asc">Lowest Salary</option>
            </select>
          </div>
        </div>

        {selectedPayslips.length > 0 && <BulkActions selectedCount={selectedPayslips.length} selectedPayslips={selectedPayslips} onClearSelection={clearSelection} onRefresh={fetchPayslips} />}

        <Card>
          <CardContent className="p-0">
            {loading ? <div className="p-8 text-center">
                <p className="text-gray-500">Loading payslips...</p>
              </div> : filteredPayslips.length === 0 ? <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'No payslips found matching your search.' : 'No payslips created yet.'}
                </p>
                {!searchTerm && <Button onClick={() => window.location.href = '/app'}>
                    Create Your First Payslip
                  </Button>}
              </div> : <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox checked={selectedPayslips.length === filteredPayslips.length} onCheckedChange={handleSelectAll} />
                    </TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Pay Period</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayslips.map(payslip => <TableRow key={payslip.id}>
                      <TableCell>
                        <Checkbox checked={selectedPayslips.includes(payslip.id)} onCheckedChange={checked => handleSelectPayslip(payslip.id, checked as boolean)} />
                      </TableCell>
                      <TableCell className="font-medium">{payslip.employee_name}</TableCell>
                      <TableCell>{payslip.company_name}</TableCell>
                      <TableCell>
                        {new Date(payslip.pay_period_start).toLocaleDateString()} - {new Date(payslip.pay_period_end).toLocaleDateString()}
                      </TableCell>
                      <TableCell>£{payslip.gross_salary.toFixed(2)}</TableCell>
                      <TableCell>£{payslip.net_salary.toFixed(2)}</TableCell>
                      <TableCell>{new Date(payslip.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <PayslipActions payslip={payslip} onRefresh={fetchPayslips} />
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>;
};
export default MyPayslips;