import React, { useState, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMeasurementHistory, useImportMeasurements } from '@/hooks/use-api';
import { format } from 'date-fns';
import { Search, History, Loader2, FileSpreadsheet, Upload, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
export default function MeasurementsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: history, isLoading } = useMeasurementHistory();
  const importMutation = useImportMeasurements();
  const filteredHistory = history?.filter(h =>
    h.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  const handleDownloadTemplate = () => {
    const headers = ['Client Name', 'Phone', 'Neck', 'Chest', 'Waist', 'Hips', 'Shoulder', 'Sleeve', 'Inseam', 'Length', 'Date', 'Notes'];
    const csvContent = headers.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leafrique-import-template.csv`);
    link.click();
    toast.success('Import template downloaded');
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const [headerLine, ...lines] = text.split('\n').filter(l => l.trim() !== '');
      const headers = headerLine.split(',').map(h => h.trim());
      const jsonData = lines.map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          const keyMap: Record<string, string> = {
            'Client Name': 'customerName',
            'Phone': 'phone',
            'Neck': 'neck',
            'Chest': 'chest',
            'Waist': 'waist',
            'Hips': 'hips',
            'Shoulder': 'shoulder',
            'Sleeve': 'sleeve',
            'Inseam': 'inseam',
            'Length': 'length',
            'Date': 'date',
            'Notes': 'notes'
          };
          obj[keyMap[header] || header] = values[index];
        });
        return obj;
      });
      try {
        const result = await importMutation.mutateAsync(jsonData);
        toast.success(`Import complete: ${result.success} records added.`);
      } catch (err) {
        toast.error('Failed to process CSV file');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };
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
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leafrique-measurements-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.click();
    toast.success('Atelier data archive exported');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-brand-brown tracking-tight italic">Measurement Archives</h1>
            <p className="text-brand-brown/60 font-medium">Historical record of all client fittings</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-brown/30" />
              <Input
                placeholder="Search by client name..."
                className="pl-9 h-10 rounded-xl bg-white/50 border-brand-brown/10 focus-visible:ring-brand-brown"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            <Button
              variant="outline"
              className="rounded-xl font-bold gap-2 h-10 border-brand-brown/10 text-brand-brown hover:bg-brand-brown/5"
              onClick={() => fileInputRef.current?.click()}
              disabled={importMutation.isPending}
            >
              {importMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Import CSV
            </Button>
            <Button
              variant="outline"
              className="rounded-xl font-bold gap-2 h-10 border-brand-green/20 text-brand-green hover:bg-brand-green/5"
              onClick={handleExportCSV}
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 border-none shadow-soft h-fit bg-white/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-brand-brown">
                <History className="h-5 w-5 text-brand-brown/40" />
                Recent Fitting Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand-brown" /></div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {filteredHistory.map((record) => (
                      <div key={record.id} className="relative pl-6 border-l-2 border-brand-brown/10 pb-1">
                        <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-brand-brown" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-brand-brown/40 uppercase tracking-wider">
                            {format(record.createdAt, 'MMM dd, yyyy')}
                          </p>
                          <h4 className="font-bold text-brand-brown">{record.customerName}</h4>
                          <p className="text-xs text-brand-brown/60 italic">
                            {record.notes || 'Routine fitting session'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 border-none shadow-soft bg-white/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-brand-brown">
                <FileSpreadsheet className="h-5 w-5 text-brand-brown/40" />
                Artisan Data Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-brand-brown/5 text-brand-brown/40 font-bold uppercase tracking-widest text-[10px]">
                    <tr>
                      <th className="px-6 py-4 text-left">Client</th>
                      <th className="px-2 py-4">Neck</th>
                      <th className="px-2 py-4">Chest</th>
                      <th className="px-2 py-4">Waist</th>
                      <th className="px-2 py-4">Shoulder</th>
                      <th className="px-2 py-4 text-right pr-6">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-brown/5">
                    {filteredHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-brand-brown/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-brand-brown/10 flex items-center justify-center font-bold text-brand-brown text-xs">
                              {record.customerName?.[0]}
                            </div>
                            <span className="font-bold text-brand-brown group-hover:underline decoration-brand-brown/20 transition-all">
                              {record.customerName}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-4 text-center font-mono text-brand-brown/80">{record.values.neck || '-'}</td>
                        <td className="px-2 py-4 text-center font-mono text-brand-brown/80">{record.values.chest || '-'}</td>
                        <td className="px-2 py-4 text-center font-mono text-brand-brown/80">{record.values.waist || '-'}</td>
                        <td className="px-2 py-4 text-center font-mono text-brand-brown/80">{record.values.shoulder || '-'}</td>
                        <td className="px-2 py-4 text-right pr-6 text-brand-brown/40 font-bold uppercase text-[10px]">
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