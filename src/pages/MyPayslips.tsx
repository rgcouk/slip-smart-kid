
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Edit, Trash, Download, Plus, Filter } from 'lucide-react';
import { PayslipActions } from '@/components/payslips/PayslipActions';
import { BulkActions } from '@/components/payslips/BulkActions';

interface Payslip {
  id: string;
  employee_name: string;
  company_name: string;
  pay_period_start: string;
  pay_period_end: string;
  gross_salary: number;
  net_salary: number;
  deductions: Array<{ id: string; name: string; amount: number }>;
  created_at: string;
  updated_at: string;
}

const MyPayslips = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [filteredPayslips, setFilteredPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Payslip>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedPayslips, setSelectedPayslips] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<'all' | 'this_month' | 'last_month' | 'this_year'>('all');

  useEffect(() => {
    if (user) {
      fetchPayslips();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortPayslips();
  }, [payslips, searchTerm, sortField, sortDirection, dateFilter]);

  const fetchPayslips = async () => {
    try {
      const { data, error } = await supabase
        .from('payslips')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayslips(data || []);
    } catch (error) {
      console.error('Error fetching payslips:', error);
      toast({
        title: "Error",
        description: "Failed to load payslips",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPayslips = () => {
    let filtered = [...payslips];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payslip =>
        payslip.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payslip.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(payslip => {
        const payslipDate = new Date(payslip.created_at);
        
        switch (dateFilter) {
          case 'this_month':
            return payslipDate.getMonth() === now.getMonth() && 
                   payslipDate.getFullYear() === now.getFullYear();
          case 'last_month':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
            return payslipDate.getMonth() === lastMonth.getMonth() && 
                   payslipDate.getFullYear() === lastMonth.getFullYear();
          case 'this_year':
            return payslipDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredPayslips(filtered);
  };

  const handleSort = (field: keyof Payslip) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectPayslip = (payslipId: string) => {
    setSelectedPayslips(prev =>
      prev.includes(payslipId)
        ? prev.filter(id => id !== payslipId)
        : [...prev, payslipId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayslips.length === filteredPayslips.length) {
      setSelectedPayslips([]);
    } else {
      setSelectedPayslips(filteredPayslips.map(p => p.id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-600">Loading payslips...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">My Payslips</h1>
              <p className="text-blue-600">Manage and view all your saved payslips</p>
            </div>
            <Button asChild>
              <a href="/app" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Payslip
              </a>
            </Button>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by employee or company name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="this_month">This Month</SelectItem>
                      <SelectItem value="last_month">Last Month</SelectItem>
                      <SelectItem value="this_year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={`${sortField}_${sortDirection}`} onValueChange={(value) => {
                    const [field, direction] = value.split('_');
                    setSortField(field as keyof Payslip);
                    setSortDirection(direction as 'asc' | 'desc');
                  }}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at_desc">Newest First</SelectItem>
                      <SelectItem value="created_at_asc">Oldest First</SelectItem>
                      <SelectItem value="employee_name_asc">Employee A-Z</SelectItem>
                      <SelectItem value="employee_name_desc">Employee Z-A</SelectItem>
                      <SelectItem value="company_name_asc">Company A-Z</SelectItem>
                      <SelectItem value="company_name_desc">Company Z-A</SelectItem>
                      <SelectItem value="gross_salary_desc">Highest Salary</SelectItem>
                      <SelectItem value="gross_salary_asc">Lowest Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedPayslips.length > 0 && (
            <BulkActions
              selectedCount={selectedPayslips.length}
              selectedPayslips={selectedPayslips}
              onClearSelection={() => setSelectedPayslips([])}
              onRefresh={fetchPayslips}
            />
          )}
        </div>

        {/* Payslips Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payslips ({filteredPayslips.length})</span>
              {filteredPayslips.length > 0 && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedPayslips.length === filteredPayslips.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-gray-600">Select All</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredPayslips.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payslips found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || dateFilter !== 'all' 
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first payslip"
                  }
                </p>
                <Button asChild>
                  <a href="/app">Create Your First Payslip</a>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedPayslips.length === filteredPayslips.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('employee_name')}
                      >
                        Employee
                        {sortField === 'employee_name' && (
                          <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('company_name')}
                      >
                        Company
                        {sortField === 'company_name' && (
                          <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </TableHead>
                      <TableHead>Pay Period</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('gross_salary')}
                      >
                        Gross Salary
                        {sortField === 'gross_salary' && (
                          <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('created_at')}
                      >
                        Created
                        {sortField === 'created_at' && (
                          <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayslips.map((payslip) => (
                      <TableRow key={payslip.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox
                            checked={selectedPayslips.includes(payslip.id)}
                            onCheckedChange={() => handleSelectPayslip(payslip.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {payslip.employee_name}
                        </TableCell>
                        <TableCell>{payslip.company_name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(payslip.pay_period_start)} - {formatDate(payslip.pay_period_end)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(payslip.gross_salary)}
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(payslip.net_salary)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            {formatDate(payslip.created_at)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <PayslipActions 
                            payslip={payslip}
                            onRefresh={fetchPayslips}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default MyPayslips;
