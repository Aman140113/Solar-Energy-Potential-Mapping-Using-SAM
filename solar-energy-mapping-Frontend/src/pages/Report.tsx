import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { Download, Sun } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReportData {
  solar_energy_generation_potential: number;
  Total_area: number;
  PVOUT: {
    [key: string]: number;
  };
  Annual_energy_yeild: number;
  Result_index: number;
  DNI: number;
  GHI: number;
  DIF: number;
  GTI_opta: number;
  TEMP: number;
  OPTA: number;
  ELE: number;
}

export default function Report() {
  const location = useLocation();
  const reportRef = useRef<HTMLDivElement>(null);
  const { imageUrl, reportData } = location.state || {};

  console.log(reportData);
  // Sample data - replace with actual data from API
  const data: ReportData = {
    solar_energy_generation_potential: reportData?.potential,
    Total_area: reportData?.totalArea,
    PVOUT:reportData?.monthwise_output,
    // PVOUT: {
    //   Jan: 96.9,
    //   Feb: 115.7,
    //   Mar: 144.4,
    //   Apr: 141.4,
    //   May: 132,
    //   Jun: 114.1,
    //   Jul: 101.1,
    //   Aug: 110,
    //   Sep: 120.6,
    //   Oct: 127.4,
    //   Nov: 104.9,
    //   Dec: 101.3
    // },
    Annual_energy_yeild: reportData?.aey,
    Result_index: reportData?.result_index,
    DNI: reportData?.dni,
    GHI: reportData?.ghi,
    DIF: reportData?.dif,
    GTI_opta: reportData?.gti_opta,
    TEMP: reportData?.temp,
    OPTA: reportData?.opta,
    ELE: reportData?.ele
  };

  console.log(data);

  const COLORS = ['#f97316', '#93c5fd'];

  // Transform PVOUT data for the bar chart
  const monthlyPVOUTData = Object.entries(data.PVOUT).map(([month, value]) => ({
    month,
    value
  }));

  // Calculate area distribution for pie chart
  const utilizationFactor = 0.83;
  const usableArea = data.Total_area * utilizationFactor;
  const unusableArea = data.Total_area - usableArea;

  const newUsable = usableArea.toFixed(1)
  const newNonUsable = unusableArea.toFixed(1)


  const areaData = [
    { name: 'Usable Area', value: Number(newUsable) },
    { name: 'Unusable Area', value: Number(newNonUsable) }
  ];

  // Additional information table data
  const additionalInfo = [
    { label: 'Direct Normal Irradiance (DNI)', value: data.DNI, unit: 'kWh/m²' },
    { label: 'Global Horizontal Irradiance (GHI)', value: data.GHI, unit: 'kWh/m²' },
    { label: 'Diffuse Horizontal Irradiance (DIF)', value: data.DIF, unit: 'kWh/m²' },
    { label: 'Global Tilted Irradiance at Optimal Angle (GTI)', value: data.GTI_opta, unit: 'kWh/m²' },
    { label: 'Average Temperature', value: data.TEMP, unit: '°C' },
    { label: 'Optimal Panel Angle', value: data.OPTA, unit: '°' },
    { label: 'Elevation', value: data.ELE, unit: 'm' }
  ];

  const handleDownload = async () => {
    if (!reportRef.current) return;

    try {
      // Show loading state
      const button = document.querySelector('#downloadButton');
      if (button) {
        button.textContent = 'Generating PDF...';
        button.setAttribute('disabled', 'true');
      }

      // Temporarily modify the container for better PDF capture
      const container = reportRef.current;
      const originalStyle = container.style.cssText;
      container.style.width = '1200px';
      container.style.margin = '0';
      container.style.padding = '20px';
      container.style.backgroundColor = 'white';

      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(container, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const containers = clonedDoc.querySelectorAll('.recharts-responsive-container');
          containers.forEach(container => {
            (container as HTMLElement).style.width = '100%';
            (container as HTMLElement).style.height = '300px';
          });
        }
      });

      container.style.cssText = originalStyle;

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', [imgHeight + 20, imgWidth + 20]);
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        10,
        10,
        imgWidth,
        imgHeight
      );
      
      pdf.save('solar-potential-report.pdf');

      if (button) {
        button.textContent = 'Download PDF';
        button.removeAttribute('disabled');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12">
      <div className="max-w-7xl mx-auto px-4" ref={reportRef}>
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-6">
            <div className="flex items-center space-x-3">
              <Sun className="h-8 w-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">
                Solar Energy Report
              </h1>
            </div>
            <button
              id="downloadButton"
              onClick={handleDownload}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-orange-200"
            >
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-sm font-medium opacity-80 mb-2">Daily Generation Potential</h3>
              <div className="text-4xl font-bold">
                {data.solar_energy_generation_potential.toFixed(1)}
                <span className="text-lg ml-1">KWH</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-sm font-medium opacity-80 mb-2">Annual Energy Yield</h3>
              <div className="text-4xl font-bold">
                {data.Annual_energy_yeild.toFixed(1)}
                <span className="text-lg ml-1">KWH</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-red-500 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-sm font-medium opacity-80 mb-2">Total Area</h3>
              <div className="text-4xl font-bold">
                {data.Total_area.toFixed(1)}
                <span className="text-lg ml-1">m²</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Satellite Image */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Satellite View</h2>
                {imageUrl ? (
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={imageUrl}
                      alt="Satellite view"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-200">
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
              </div>

              {/* Monthly PVOUT */}
              <div className="bg-white rounded-xl p-6 border-2 border-orange-100 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Energy Production</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyPVOUTData} margin={{ top: 5, right: 30, left: 20, bottom: 35 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month">
                      <Label value="Months" position="bottom" offset={15} />
                    </XAxis>
                    <YAxis>
                      <Label value="PVOut (KWH)" angle={-90} position="left" offset={-5} />
                    </YAxis>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #f97316',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Energy Production</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyPVOUTData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'PVout (kWh)', angle: -90, position: 'insideLeft', offset: -10 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div> */}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Area Utilization */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Area Distribution</h2>
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={areaData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={false}
                      >
                        {areaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => `${Number(value)}m²`}
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-8 mt-4">
                    {areaData.map((entry, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-sm text-gray-600">
                          {entry.name}: {entry.value}m²
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Overall Result */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Installation Suitability</h2>
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="text-6xl font-bold text-[#FFA500]">
                      {data.Result_index}
                      <span className="text-3xl text-gray-400 ml-1">/10</span>
                    </div>
                  </div>
                  <div className={`text-lg font-medium px-6 py-3 rounded-full ${
                      data.Result_index < 5 
                        ? 'bg-red-100 text-red-700' 
                        : data.Result_index <= 7 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {data.Result_index < 5 
                        ? 'Not Suitable' 
                        : data.Result_index <= 7 
                        ? 'Moderately Suitable' 
                        : 'Highly Suitable'
                      } for Installation
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Table */}
          <div className="bg-white rounded-xl p-6 border-2 border-orange-100 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Detailed Solar Analysis</h2>
            <div className="overflow-x-auto rounded-lg border border-orange-100">
              <table className="min-w-full divide-y divide-orange-100">
                <thead>
                  <tr className="bg-orange-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-orange-100">Parameter</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-orange-100">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-orange-100">
                  {additionalInfo.map((info, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-orange-50'}>
                      <td className="px-6 py-4 text-sm text-gray-900 border-r border-orange-100">{info.label}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right">
                        {info.value.toFixed(1)} {info.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}