import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  Plus, 
  Eye, 
  Calendar,
  DollarSign 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalPayslips: number;
  thisMonthPayslips: number;
  totalEmployees: number;
  totalValue: number;
}

interface RecentPayslip {
  id: string;
  employee_name: string;
  company_name: string;
  net_salary: number;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalPayslips: 0,
    thisMonthPayslips: 0,
    totalEmployees: 0,
    totalValue: 0
  });
  const [recentPayslips, setRecentPayslips] = useState<RecentPayslip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch payslips data
      const { data: payslips, error: payslipsError } = await supabase
        .from('payslips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (payslipsError) throw payslipsError;

      // Fetch employees data
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id);

      if (employeesError) throw employeesError;

      // Calculate stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthPayslips = payslips?.filter(p => {
        const payslipDate = new Date(p.created_at);
        return payslipDate.getMonth() === currentMonth && payslipDate.getFullYear() === currentYear;
      }).length || 0;

      const totalValue = payslips?.reduce((sum, p) => sum + Number(p.net_salary), 0) || 0;

      setStats({
        totalPayslips: payslips?.length || 0,
        thisMonthPayslips,
        totalEmployees: employees?.length || 0,
        totalValue
      });

      // Set recent payslips (last 5)
      setRecentPayslips(payslips?.slice(0, 5) || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Payslips",
      value: stats.totalPayslips.toString(),
      description: "All time payslips created",
      icon: FileText,
      trend: "+12% from last month"
    },
    {
      title: "This Month",
      value: stats.thisMonthPayslips.toString(),
      description: "Payslips created this month",
      icon: Calendar,
      trend: "+5% from last month"
    },
    {
      title: "Employees",
      value: stats.totalEmployees.toString(),
      description: "Total employees managed",
      icon: Users,
      trend: "+2 new this month"
    },
    {
      title: "Total Value",
      value: `£${stats.totalValue.toLocaleString()}`,
      description: "Total payroll processed",
      icon: DollarSign,
      trend: "+18% from last month"
    }
  ];

  const quickActions = [
    {
      title: "Create Payslip",
      description: "Generate a new payslip",
      icon: Plus,
      href: "/app",
      variant: "default" as const
    },
    {
      title: "View All Payslips",
      description: "Browse payslip history",
      icon: Eye,
      href: "/my-payslips",
      variant: "outline" as const
    },
    {
      title: "Manage Employees",
      description: "Add or edit employees",
      icon: Users,
      href: "/employees",
      variant: "outline" as const
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Please sign in to view your dashboard.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your payroll activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="border border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{loading ? "..." : stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <p className="text-xs text-primary mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    className="w-full justify-start h-auto p-4"
                    asChild
                  >
                    <a href={action.href}>
                      <action.icon className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </a>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Payslips */}
          <div className="lg:col-span-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Payslips
                </CardTitle>
                <CardDescription>
                  Your latest payslip activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading recent payslips...</p>
                  </div>
                ) : recentPayslips.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No payslips created yet.</p>
                    <Button asChild>
                      <a href="/app">Create Your First Payslip</a>
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentPayslips.map((payslip) => (
                        <TableRow key={payslip.id}>
                          <TableCell className="font-medium">{payslip.employee_name}</TableCell>
                          <TableCell>{payslip.company_name}</TableCell>
                          <TableCell>£{payslip.net_salary.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {new Date(payslip.created_at).toLocaleDateString()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;