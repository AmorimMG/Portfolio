export function exportCSV(data, fileName = 'export.csv') {
    let csvContent = "data:text/csv;charset=utf-8,";
  
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      csvContent += headers.join(",") + "\r\n";
    }
  
    data.forEach(row => {
      const values = Object.values(row).map(value => String(value).replace(/,/g, ''));
      csvContent += values.join(",") + "\r\n";
    });
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
  
    link.click();
    document.body.removeChild(link);
  }