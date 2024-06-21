from mysql.connector import pooling


db_config = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "12345678",
    "database": "taipei_day_trip_website",
}

# 创建连接池
connection_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=10,
    **db_config
)


# # 从连接池获取连接
# def get_connection():
#     return connection_pool.get_connection()

# # 使用连接进行数据库操作
# def execute_query(query, params=None):
#     conn = get_connection()
#     cursor = conn.cursor()
#     cursor.execute(query, params)
#     result = cursor.fetchall()
#     cursor.close()
#     conn.close()
#     return result

# # 示例查询
# query = "SELECT * FROM your_table"
# result = execute_query(query)
# print(result)
