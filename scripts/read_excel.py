import pandas as pd
import json
import sys

# Set UTF-8 encoding for output
sys.stdout.reconfigure(encoding='utf-8')

# Read the Excel file
file_path = r'C:\Users\BARTOO\Downloads\Devin_ALL_Product_Photos_and_Descriptions.xlsx'

try:
    df = pd.read_excel(file_path)
    
    print(f"Total products: {len(df)}")
    print(f"\nColumns: {df.columns.tolist()}")
    print(f"\nFirst product:")
    print(df.iloc[0].to_dict())
    
    # Convert to JSON, replacing NaN with None
    data = df.where(pd.notnull(df), None).to_dict(orient='records')
    
    # Save to JSON file
    with open('products-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\nData saved to products-data.json")
    print(f"\nFirst 20 products:")
    for i, product in enumerate(data[:20]):
        desc = product.get('Caption / Description', 'No description')
        print(f"{i + 1}: {desc}")
        
except Exception as e:
    print(f"Error reading Excel file: {e}")
