from flask import Flask, send_file
from flask import jsonify
import pandas as pd
import re
import math
import json

app = Flask(__name__)
app.json.sort_keys = False

data_csv = pd.read_csv('apiWorkBook.csv', low_memory=False)
data_csv['LGA'] = data_csv['LGA'].str.replace("/", "").str.replace("'", "")
data_csv['Ward'] = data_csv['Ward'].str.replace("/", "").str.replace("'", "")
data_csv['Health Facility'] = data_csv['Health Facility'].str.replace("/", "").str.replace("'", "")
data_csv['Settlement'] = data_csv['Settlement'].str.replace("/", "").str.replace("'", "")

def format_phone_number(phone_number):
    if isinstance(phone_number, float) and math.isnan(phone_number):
        return ""  
    phone_str = str(int(phone_number)) if isinstance(phone_number, float) else str(phone_number)
    cleaned_number = re.sub(r'(\d{3})(\d{2})(\d{5})', r'0\1\2\3', phone_str)

    return cleaned_number

def format_count(count):
    if isinstance(count, float) and math.isnan(count):
        return ""  
    count_str = str(int(count)) if isinstance(count, float) else str(count)
    rounded_count = re.sub(r'\.0*$', '', count_str)

    return rounded_count

def rounded_number(number):
    if isinstance(number, float) and math.isnan(number):
        return ""  
    number_str = str(int(number)) if isinstance(number, float) else str(number)
    round_number = math.ceil(float(number_str))
    
    return round_number

@app.route('/lgas')
def lgas():
    unique_lgas = data_csv['LGA'].dropna().unique().tolist()
    unique_lgas = [lga.capitalize() for lga in unique_lgas]
    unique_lgas.append('Go back')
    return unique_lgas

@app.route('/lga/index/<lga_index>')
def wardname(lga_index):
    lga_index = int(lga_index)
    if lga_index < 0 or lga_index >= len(data_csv):
        return "Invalid index"
    
    lga = data_csv.iloc[lga_index]['LGA'].capitalize()
    associatedwards = data_csv[data_csv['LGA'].str.lower() == lga.lower()]['Ward'].dropna().unique().tolist()
    associatedwards = [ward.capitalize() for ward in associatedwards]
    associatedwards.append('Go back')
    return associatedwards

@app.route('/lga/<lga>')
def ward(lga):
    lga = lga.capitalize()
    associated_wards = data_csv[data_csv['LGA'].str.lower() == lga.lower()]['Ward'].dropna().unique().tolist()
    associated_wards = [ward.capitalize() for ward in associated_wards]
    associated_wards.append('Go back')
    return associated_wards

@app.route('/lga/ward/<ward>')
def hospitals(ward):
    ward = ward.capitalize()
    associated_hospitals = data_csv[data_csv['Ward'].str.capitalize() == ward]['Health Facility'].dropna().unique().tolist()
    associated_hospitals = [hospital.capitalize() for hospital in associated_hospitals]
    associated_hospitals.append('Go back')
    return associated_hospitals

@app.route('/lga/ward/hospital/<hospital>/settlements')
def settlements(hospital):
    hospital = hospital.capitalize()
    settlements = data_csv[data_csv['Health Facility'].str.capitalize() == hospital]['Settlement'].dropna().unique().tolist()
    settlements.append('go back')
    for i in range(len(settlements)):
        settlements[i] = settlements[i].capitalize()
    return settlements

@app.route('/lga/ward/hospital/<hospital>/status')    
def hospital_status(hospital):
    hospital = hospital.capitalize()
    specific_clinic_rows = data_csv[data_csv['Health Facility'].str.capitalize() == hospital]
    columns = ['Ownership', 'Facility Type']
    
    data = {}

    for column in columns:
        value = specific_clinic_rows.iloc[0][column]
        if pd.notna(value):
            data[column] = value

    return jsonify(data)
    

@app.route('/lga/ward/hospital/<hospital>/humanResources')
def human_resources(hospital):
    hospital = hospital.capitalize()
    specific_clinic_rows = data_csv[data_csv['Health Facility'].str.capitalize() == hospital]
    columns = ['OFFICER IN CHARGE', 'Phone number 0', 'Permanent Technical Staff', 'Adhoc Technical Staff (BHCPF, LGA, etc)', 'Volunteer Technical Staff',
               'Permanent Non-Technical Staff', 'Name of Ward CE Focal Persion', 'Phone Number 3']
    
    data = {}
    
    for column in columns:
        value = specific_clinic_rows.iloc[0][column]
        if value in ['nan', 'nan']:
            data[column] = 'This information is currently not available \n\n'
        elif 'phone number' in column.lower():
            formatted_number = format_phone_number(value)
            data[column] = formatted_number
        else:
            formatted_count = format_count(value)
            data[column] = formatted_count

    return jsonify(data)

@app.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/population')
def settlement_population(hospital, settlement):
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    settlement_info = data_csv[(data_csv['Health Facility'].str.capitalize() == hospital) &
                               (data_csv['Settlement'].str.capitalize() == settlement)].loc[:,'Total Population of the Settlement':'Mentally Challenged']
    data = {}
    
    for column in settlement_info.columns:
        value = settlement_info[column].iloc[0]
        if pd.notna(value):
        #     data += f"{column}: {rounded_number(value)}"
        # else:
        #     data += f"{column}: This information is currently not available"
            data[column] = rounded_number(value)
        else:
            data[column] = "This information is currently not available"
    return jsonify(data)

@app.route('/lga/ward/hospital/<hospital>/map')
def show_map(hospital):
    hospital = hospital.capitalize()
    map_url = data_csv[data_csv['Health Facility'].str.capitalize() == hospital]['Catchment Url'].iloc[0]
    return jsonify(map_url)
    
@app.route('/lga/ward/hospital/<hospital>/cmap/')
def show_c_map(hospital):
    hospital = hospital.capitalize()
    map_url = data_csv[data_csv['Health Facility'].str.capitalize() == hospital]['Catchment Url'].iloc[0]
    map_url = [map_url]
    map_url.append('Go back')
    return map_url

@app.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/profile')
def settlement_profile(hospital, settlement):
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    settlement_info = data_csv[(data_csv['Health Facility'].str.capitalize() == hospital) & 
                               (data_csv['Settlement'].str.capitalize() == settlement)]
    columns = ['HTR (Yes/No)', 'Security compromised (Yes/No)', 'Name of Mai Unguwa',
               'Phone Number 1', 'Name of Primary school/Quranic & Ismamic School',
               'Church/Mosque', 'Market/Play ground', 'Name of Community Volunteer',
               'Phone Number 2', 'Distance to Health Facility (Km)']
    data = {}
    
    for _, row in settlement_info.iterrows():
        for column in columns:
            value = row[column]
            if pd.notna(value):
                if 'phone number' in column.lower():
                    data[column] = format_phone_number(value)
                else:
                    data[column] = value
            else:
                data[column] = 'This information is currently not available'
        #data += "<br>"  # Add a separator between rows
    
    if data:
        return jsonify(data)
    else:
        return "Settlement information not found within this phc."

if __name__ == '__main__':
    app.run(debug=True)