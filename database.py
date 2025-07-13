import sqlite3
from datetime import datetime

DB_FILE = "records.db"

def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT,
                start_time TEXT,
                end_time TEXT,
                duration_seconds INTEGER
            )
        ''')
        conn.commit()

def add_record(date, start_time, end_time):
    fmt = "%H:%M:%S"
    start_dt = datetime.strptime(start_time, fmt)
    end_dt = datetime.strptime(end_time, fmt)
    duration = int((end_dt - start_dt).total_seconds())

    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute('''
            INSERT INTO records (date, start_time, end_time, duration_seconds)
            VALUES (?, ?, ?, ?)
        ''', (date, start_time, end_time, duration))
        conn.commit()

def get_all_records():
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute('''
            SELECT * FROM records
            ORDER BY date DESC
        ''')
        return c.fetchall()

def delete_record(record_id):
    import sqlite3
    conn = sqlite3.connect("records.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM records WHERE id = ?", (record_id,))
    conn.commit()
    conn.close()
    
def update_record(record_id, date, start_time, end_time):
    fmt = "%H:%M:%S"
    start_dt = datetime.strptime(start_time, fmt)
    end_dt = datetime.strptime(end_time, fmt)
    duration = int((end_dt - start_dt).total_seconds())
    
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute('''
            UPDATE records
            SET date = ?, start_time = ?, end_time = ?, duration_seconds = ?
            WHERE id = ?
        ''', (date, start_time, end_time, duration, record_id))
        conn.commit()
