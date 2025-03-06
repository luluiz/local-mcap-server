# 📂 File Browser Server

A simple **Express.js** server that provides a **file browsing interface**, allows navigating folders, and serves files via HTTP. It also supports **CORS**, **range requests**.

---

## 📦 Installation

### 1️⃣ **Clone the repository**

```bash
git clone https://github.com/your-repo/file-browser-server.git
cd file-browser-server
```

### 2️⃣ **Install dependencies**

```bash
npm install
```

### 3️⃣ **Create a `.env` file**

Create a `.env` file in the project root and configure it as needed:

```
BASE_FOLDER=/Users/your-user/Documents/Files/  # Change to your folder path
PORT=8081
HOST=localhost
```

### 4️⃣ **Run the server**

```bash
npm run start
```

---

## 🌐 Usage

### **Access the file browser**

Open in your browser:

```
http://localhost:8081/browse/
```

### **View and download files**

- Click on **folders** 📁 to navigate.
- Click on **files** 📄 to download/view.
- Use the **⬅️ Back button** to return to the previous directory.

### **Serve files directly**

To download a file directly:

```
http://localhost:8081/files/yourfile.mcap
```

---

## 🛠 API Endpoints

| Method | Endpoint           | Description                   |
| ------ | ------------------ | ----------------------------- |
| `GET`  | `/browse/`         | List files in the root folder |
| `GET`  | `/browse/:folder`  | List files in a subfolder     |
| `GET`  | `/files/:filename` | Serve a file for download     |

---

## 📝 Logs

The server logs each request in the console with:

```
[YYYY-MM-DDTHH:MM:SS] <IP_ADDRESS> - <METHOD> <URL>
```

Example:

```
[2024-03-06T15:45:23] 192.168.1.100 - GET /browse/
```

---
