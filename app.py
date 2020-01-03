# import necessary libraries
import os
import pandas as pd
import numpy as np
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
SQLALCHEMY_TRACK_MODIFICATEION = False
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///Project2.db"
db = SQLAlchemy(app)

Base = automap_base()
Base.prepare(db.engine, reflect=True)

Redfin_Divvy = Base.classes.merged_redfin_divvy

@app.route("/")
def home_page():
    return render_template("index.html")

@app.route("/pamela")
def pamela_page():
    return render_template("pamela.html")

@app.route("/api/redfin_divvy")
def DivvyInfo():
    results = pd.read_sql("SELECT * from merged_redfin_divvy", con=db.engine)
    csv_results = results.to_csv()

    jsonresults = results.to_json(orient='index')
    return jsonresults


if __name__ == "__main__":
    app.run(debug=True)
