import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMeasurementHistory } from '@/hooks/use-api';
import { format } from 'date-fns';
import { Search, History, ChevronRight, Loader2, FileSpreadsheet } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
export default function MeasurementsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: history, isLoading } = useMeasurementHistory();
  const filteredHistory = history?.filter(h =>
    h.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  const handleExportCSV = () => {
    if (!history || history.length === 0) {
      toast.error('No measurement records available to export');
      return;
    }
    const headers = ['Client Name', 'Neck', 'Chest', 'Waist', 'Hips', 'Shoulder', 'Sleeve', 'Inseam', 'Length', 'Date', 'Notes'];
    const rows = history.map(record => [
      record.customerName || 'Unknown',
      record.values.neck || '',
      record.values.chest || '',
      record.values.waist || '',
      record.values.hips || '',
      record.values.shoulder || '',
      record.values.sleeve || '',
      record.values.inseam || '',
      record.values.length || '',
      format(record.createdAt, 'yyyy-MM-dd HH:mm'),
      (record.notes || '').replace(/,/g, ';')
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leafrique-measurements-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Atelier data archive exported successfully');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Measurement Archives</h1>
            <p className="text-slate-500">LEAfrique's historical record of all client fittings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by client name..."
                className="pl-9 h-10 rounded-xl bg-white border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className="rounded-xl font-bold gap-2 h-10 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              onClick={handleExportCSV}
            >
              <FileSpreadsheet className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 border-none shadow-soft h-fit">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-600" />
                Recent Records
              </CardTitle>
              <CardDescription>Latest updates from LEAfrique benches</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-600" /></div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {filteredHistory.map((record) => (
                      <div key={record.id} className="relative pl-6 border-l-2 border-slate-100 pb-1">
                        <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-indigo-600" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                            {format(record.createdAt, 'MMM dd, yyyy')}
                          </p>
                          <h4 className="font-bold text-slate-900">{record.customerName}</h4>
                          <p className="text-xs text-slate-500 italic">
                            {record.notes || 'Routine fitting session'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {filteredHistory.length === 0 && (
                      <p className="text-center text-slate-400 py-10 italic">No records found</p>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
                  Full Data Matrix
                </CardTitle>
                <CardDescription>Detailed metrics for bespoke production</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] border-y border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-left">Client</th>
                      <th className="px-2 py-4">Neck</th>
                      <th className="px-2 py-4">Chest</th>
                      <th className="px-2 py-4">Waist</th>
                      <th className="px-2 py-4">Shoulder</th>
                      <th className="px-2 py-4">Sleeve</th>
                      <th className="px-2 py-4 text-right pr-6">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                              {record.customerName?.[0]}
                            </div>
                            <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {record.customerName}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-4 text-center font-mono">{record.values.neck || '-'}</td>
                        <td className="px-2 py-4 text-center font-mono">{record.values.chest || '-'}</td>
                        <td className="px-2 py-4 text-center font-mono">{record.values.waist || '-'}</td>
                        <td className="px-2 py-4 text-center font-mono">{record.values.shoulder || '-'}</td>
                        <td className="px-2 py-4 text-center font-mono">{record.values.sleeve || '-'}</td>
                        <td className="px-2 py-4 text-right pr-6 text-slate-400 font-medium">
                          {format(record.createdAt, 'MMM d')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}