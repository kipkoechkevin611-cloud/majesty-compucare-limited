const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'C:\\Users\\BARTOO\\Downloads\\Devin_ALL_Product_Photos_and_Descriptions.xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  console.log('Total products:', data.length);
  console.log('\nFirst product:');
  console.log(JSON.stringify(data[0], null, 2));
  
  console.log('\nAll products:');
  data.forEach((product: any, index: number) => {
    console.log(`${index + 1}`, product);
  });
  
  // Save to JSON for easier viewing
  fs.writeFileSync('products-data.json', JSON.stringify(data, null, 2));
  console.log('\nData saved to products-data.json');
} catch (error) {
  console.error('Error reading Excel file:', error);
}
