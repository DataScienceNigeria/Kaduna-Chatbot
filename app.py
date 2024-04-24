from flask import Flask, send_file
import pandas as pd

app = Flask(__name__)

data_csv = pd.read_csv('apiWorkBook.csv', low_memory=False)
data_csv['LGA'] = data_csv['LGA'].str.replace("/", "").str.replace("'", "")
data_csv['Ward'] = data_csv['Ward'].str.replace("/", "").str.replace("'", "")
data_csv['Health Facility'] = data_csv['Health Facility'].str.replace("/", "").str.replace("'", "")
data_csv['Settlement Name'] = data_csv['Settlement Name'].str.replace("/", "").str.replace("'", "")

@app.route('/lgas')
def lgas():
    unique_lgas = data_csv['LGA'].dropna().unique().tolist()
    unique_lgas = [lga.capitalize() for lga in unique_lgas]
    unique_lgas.append('Go back')
    return unique_lgas

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
    settlements = data_csv[data_csv['Health Facility'].str.capitalize() == hospital]['Settlement Name'].dropna().unique().tolist()
    settlements.append('go back')
    for i in range(len(settlements)):
        settlements[i] = settlements[i].capitalize()
    return settlements

@app.route('/lga/ward/hospital/<hospital>/humanResources')
def human_resources(hospital):
    hospital = hospital.capitalize()
    specific_clinic_rows = data_csv[data_csv['Health Facility'].str.capitalize() == hospital]
    columns = ['Name of RI vaccinator', 'Phone number 0', 'Name of ANC Provider', 'Phone number 1', 'Name of Labor and Delivery Provider', 
               'Phone number 2', 'Name of the leading community mobilizer', 'Organization of the community mobilizer']
    
    data = ""
    x = 0
    
    for column in columns:
        value = str(specific_clinic_rows.iloc[0][column])
        if value.lower() in ['nan', 'nan']:
            data += f"{column}: This information is currently not available<br><br>"
        elif 'phone number' in column.lower():
            data += f" Phone number: {value}<br><br>"
        # elif columns.index(column) in [0, 6]:
        #     data += f"{column}: {value}\t\t"
        else:
            data += f"{column}: {value}<br><br>"

    return data

@app.route('/lga/ward/hospital/<hospital>/map')
def show_map(hospital):
    hospital = hospital.capitalize()
    map_url = data_csv[data_csv['Health Facility'].str.capitalize() == hospital]['Map url'].iloc[0]
    return send_file(map_url)
    #return f"<img src={map_url} alt= 'Map' >"

@app.route('/lga/ward/hospital/<hospital>/cmap/')
def show_c_map(hospital):
    hospital = hospital.capitalize()
    map_url = data_csv[data_csv['Health Facility'].str.capitalize() == hospital]['Map url'].iloc[0]
    map_url = [map_url]
    map_url.append('Go back')
    return map_url

if __name__ == '__main__':
    app.run(debug=True)