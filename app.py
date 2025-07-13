import sqlite3
from datetime import date as date_cls
from flask import render_template, redirect, request
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, add_record, get_all_records, delete_record, update_record

app = Flask(__name__)
CORS(app)

@app.route("/dashboard")
def dashboard():
	records = get_all_records()
# today's date
	today = date_cls.today().isoformat()
# today's records
	todays_records = [r for r in records if r[1] == today]
	print("TODAY:", today)
	print("RECORDS:", records)
	print("TODAY RECORDS:", todays_records)
# durations total
	total_duration = sum(r[4] for r in todays_records)
#	return render_template("dashboard.html", records=todays_records, total_duration=total_duration, today=today)
	return render_template("dashboard.html", records=records, total_duration=total_duration, today=today)
@app.route("/form")
def form():
	return render_template("form.html")

@app.route("/submit", methods=["POST"])
def submit():
    # String giriş kontrolü
    raw = request.form.get("raw_input", "")

    if raw:  # Eğer raw_input varsa, string yöntemiyle giriş yapılıyor
        # Input kontrolü (16 karakter ve sayılar)
        if len(raw) != 16 or not raw.isdigit():
            return "Invalid input format", 400

        # Tarih, başlama ve bitiş saatlerini ayırma
        date = raw[:8]  # 'DDMMYYYY' -> '12072025'
        start = raw[8:12]  # 'HHMM' -> '1058'
        end = raw[12:16]  # 'HHMM' -> '1108'

        # Tarihi 'YYYY-MM-DD HH:MM:SS' formatına çevirme
        formatted_date = f"{date[4:8]}-{date[2:4]}-{date[0:2]} {start[:2]}:{start[2:]}:00"
        start_time = f"{start[:2]}:{start[2:]}:00"  # 'HH:MM:00' formatında
        end_time = f"{end[:2]}:{end[2:]}:00"  # 'HH:MM:00' formatında

        # Veriyi veritabanına ekle
        add_record(formatted_date, start_time, end_time)

    else:  # Eğer raw_input yoksa, start ve end butonları ile giriş yapılıyor
        start_time = request.form.get("start_time")
        end_time = request.form.get("end_time")
        date = request.form.get("date")

        if not date or not start_time or not end_time:
            return "Eksik veri", 400

        # Veriyi veritabanına ekle
        add_record(formatted_date, start_time, end_time)

    return redirect("/dashboard")


@app.route("/")
def home():
	#return "Veri Kayıt API çalışıyor!"
	return render_template("welcome.html")

@app.route("/add", methods=["POST"])
def add():
	data = request.get_json()
	date = data.get("date")
	start = data.get("start_time")
	end = data.get("end_time")

	if not date or not start or not end:
		return jsonify({"error": "Eksik veri"}), 400

	add_record(date, start, end)
	return jsonify({"status": "ok"}), 200

@app.route("/records", methods=["GET"])
def get_records():
	records = get_all_records()
	return jsonify(records)
	
@app.route("/delete/<int:record_id>", methods=["POST"])
def delete(record_id):
	delete_record(record_id)
	return redirect("/dashboard")

@app.route("/edit/<int:record_id>", methods=["GET"])
def edit(record_id):
	conn = sqlite3.connect("records.db")
	cursor = conn.cursor()
	cursor.execute("SELECT * FROM records WHERE id = ?", (record_id,))
	record = cursor.fetchone()
	conn.close()
	
	if record:
		return render_template("edit_form.html", record=record)
	else:
		return "Record not found", 404

@app.route("/update/<int:record_id>", methods=["GET", "POST"])
def update(record_id):
	if request.method == "POST":
		date = request.form["date"]
		start_time = request.form["start_time"]
		end_time = request.form["end_time"]
		
		# update db
		update_record(record_id, date, start_time, end_time)
		
		# go to dashboard with updated data
		return redirect("/dashboard")
		
	# if GET then show data in a form
	record = get_record_by_id(record_id)
	return render_template("update_form.html", record=record)
	
def get_record_by_id(record_id):
	with sqlite3.connect("records.db") as conn:
		c = conn.cursor()
		c.execute("SELECT * FROM records WHERE id = ?", (record_id,))
		return c.fetchone()

@app.route("/save-timer", methods=["POST"])
def save_timer():
	data = request.get_json()
	duration = data.get('duration')
	start_time = data.get('start_time')
	end_time = data.get('end_time')

	if not duration or not start_time or not end_time:
		return jsonify({"error": "Invalid data"}), 400

	# save to DB
	with sqlite3.connect("records.db") as conn:
		c = conn.cursor()
		c.execute('''
		INSERT INTO records (date, start_time, end_time, duration_seconds)
		VALUES (?, ?, ?, ?)''',
		(date_cls.today().isoformat(), start_time, end_time, duration))
		conn.commit()
	return jsonify({"status": "success", "duration": duration}), 200

	
if __name__ == "__main__":
	init_db()
	app.run(host="0.0.0.0", port=5000)
