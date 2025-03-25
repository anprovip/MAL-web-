# Backend Setup and Running Instructions

## Prerequisites

- Python 3.8+
- Docker
- Docker Compose


1. **Run Docker Compose to start the PostgreSQL and pgAdmin services:**
   ```sh
   docker compose up -d
   ```
2. **Create a virtual environment**
   ```sh
   python3 -m venv .venv
   ```
   *Activate a virtual environment*
   ```sh
   # In cmd.exe
   venv\Scripts\activate.bat
   # In PowerShell
   venv\Scripts\Activate.ps1
   ```
3. **Run the FastAPI application:**
   ```sh
   pip install -r requirements.txt
   ```
5. **Run the FastAPI application:**
   ```sh
   uvicorn app.main:app --reload
   ```

   The backend should now be running at `http://127.0.0.1:8000`.

## Additional Information

- Access pgAdmin at `http://127.0.0.1:5050` with the credentials:
  - Email: `admin@example.com`
  - Password: `admin`
- The PostgreSQL database will be available at `localhost:5433`.

## Endpoints

- The root endpoint: `GET /`
- Authentication endpoint: `POST /login`
- User-related endpoints: `/users`
- Post-related endpoints: `/posts`


# Hướng dẫn nhập dữ liệu vào cơ sở dữ liệu Docker PostgreSQL

## Giới thiệu
Tài liệu này hướng dẫn quy trình nhập dữ liệu từ file CSV vào cơ sở dữ liệu PostgreSQL trong container Docker của dự án MAL-web.

## Các bước thực hiện

### 1. Sao chép file CSV vào container Docker

```bash
docker cp /đường/dẫn/đến/file.csv tên_container:/tmp/file.csv
```

Ví dụ:
```bash
docker cp /home/an/Documents/MAL-web-/backend/scripts/users.csv mal_web_db:/tmp/users.csv
```

### 2. Cấp quyền và đặt chủ sở hữu cho file

```bash
docker exec -it tên_container bash -c "chmod 644 /tmp/file.csv && chown postgres:postgres /tmp/file.csv"
```

Ví dụ:
```bash
docker exec -it mal_web_db bash -c "chmod 644 /tmp/users.csv && chown postgres:postgres /tmp/users.csv"
```

### 3. Kiểm tra nội dung file (tùy chọn)

```bash
docker exec -it tên_container bash -c "head -n 5 /tmp/file.csv"
```

Ví dụ:
```bash
docker exec -it mal_web_db bash -c "head -n 5 /tmp/users.csv"
```

### 4. Truy cập vào PostgreSQL và nhập dữ liệu

```bash
docker exec -it tên_container psql -U postgres -d tên_database
```

Ví dụ:
```bash
docker exec -it mal_web_db psql -U postgres -d mal_web
```

### 5. Nhập dữ liệu bằng lệnh COPY

```sql
COPY tên_bảng(cột1, cột2, ...) 
FROM '/tmp/file.csv' 
DELIMITER ',' 
CSV HEADER;
```

Ví dụ:
```sql
COPY users(user_id, username, email, password) 
FROM '/tmp/users.csv' 
DELIMITER ',' 
CSV HEADER;
```

## Lưu ý quan trọng

- **Trigger**: Lệnh COPY sẽ kích hoạt các trigger INSERT trên bảng. Nếu có nhiều dữ liệu, có thể làm chậm quá trình nhập.
- **Tắt trigger tạm thời** (nếu cần thiết):
  ```sql
  ALTER TABLE RATINGS DISABLE TRIGGER ALL;
  -- Thực hiện COPY
  ALTER TABLE RATINGS ENABLE TRIGGER ALL;
  ```

- **Định dạng CSV**: Đảm bảo file CSV có định dạng đúng (dấu phân cách, định dạng dữ liệu) phù hợp với cấu trúc bảng.
- **Quyền truy cập**: Người dùng PostgreSQL cần có quyền đủ để đọc file và thực hiện lệnh COPY.
- **Chạy file backend/scripts/update_data_after_inset.sql trong pgAdmin**
## Xử lý lỗi

1. **Lỗi định dạng dữ liệu**: Kiểm tra loại dữ liệu trong file CSV khớp với cấu trúc bảng.
2. **Lỗi quyền truy cập**: Đảm bảo file đã được cấp quyền đọc đúng.
3. **Lỗi ràng buộc**: Kiểm tra dữ liệu không vi phạm các ràng buộc của bảng (unique, foreign key).

## Kiểm tra sau khi nhập

```sql
SELECT COUNT(*) FROM tên_bảng;
SELECT * FROM tên_bảng LIMIT 10;
```

Ví dụ:
```sql
SELECT COUNT(*) FROM users;
SELECT * FROM users LIMIT 10;
```

Tạo index:
```sql
CREATE INDEX idx_ratings_user_id ON ratings (user_id);
```


