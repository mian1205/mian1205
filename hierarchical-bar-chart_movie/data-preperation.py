import pandas as pd

# 读取上传的 CSV 文件
file_path = 'merge_data.csv'  # 替换为正确的文件路径
df = pd.read_csv(file_path)

# 查看初始数据的列名，确保列名正确
print("原始列名：")
print(df.columns)

# 去除列名中的多余空格
df.columns = df.columns.str.strip()

# 检查去除空格后的列名
print("去除空格后的列名：")
print(df.columns)

# 删除无效的行（如电影名称为空，或票房数据为空）
df_cleaned = df.dropna(subset=['Film', 'Domestic Gross'])  # 确保电影名称和票房不为空

# 处理 'Domestic Gross' 列中的数值，将其转换为字符串以去除符号，然后再转换为数值
df_cleaned['Domestic Gross'] = df_cleaned['Domestic Gross'].astype(str).str.replace('[$m,]', '', regex=True)
df_cleaned['Domestic Gross'] = pd.to_numeric(df_cleaned['Domestic Gross'], errors='coerce')

# 查看清洗后的数据
print("清洗后的数据：")
print(df_cleaned.head())

# 保存清洗后的数据为新的 CSV 文件
df_cleaned.to_csv('cleaned_movie_data.csv', index=False)

print("数据清洗完成，已保存为 'cleaned_movie_data.csv'")
