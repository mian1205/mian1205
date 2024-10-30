import pandas as pd
import json

# 读取CSV数据
file_path = 'merge_data.csv'  # 替换为你的CSV文件路径
df = pd.read_csv(file_path)

# 确保我们有正确的列
df.columns = df.columns.str.strip()  # 清理列名中的空格

# 确保数据中包含所需的列
required_columns = ['Year', 'Genre', 'Film', 'Domestic Gross']
df_cleaned = df[required_columns].dropna()

# 将Domestic Gross转换为数值，去除不必要的符号
df_cleaned['Domestic Gross'] = pd.to_numeric(df_cleaned['Domestic Gross'].replace({'[$m,]': ''}, regex=True))

# 创建层次结构数据
hierarchical_data = {
    "name": "Movies",
    "children": []
}

# 按年份和电影类型分组
years = df_cleaned.groupby('Year')

for year, year_group in years:
    year_node = {
        "name": str(year),
        "children": []
    }
    
    genres = year_group.groupby('Genre')
    
    for genre, genre_group in genres:
        genre_node = {
            "name": genre,
            "children": []
        }
        
        for _, row in genre_group.iterrows():
            film_node = {
                "name": row['Film'],
                "value": row['Domestic Gross']
            }
            genre_node['children'].append(film_node)
        
        year_node['children'].append(genre_node)
    
    hierarchical_data['children'].append(year_node)

# 保存为JSON文件
output_file = 'hierarchical_movie_data.json'
with open(output_file, 'w') as json_file:
    json.dump(hierarchical_data, json_file, indent=4)

print(f"JSON数据已生成并保存为 {output_file}")
