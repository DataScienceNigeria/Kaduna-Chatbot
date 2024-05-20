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

@app.route('/wa/lga/<lga_index>')
def wardname(lga_index):
    lga_index = int(lga_index)
    if lga_index < 0 or lga_index >= len(data_csv):
        return "Invalid index"
    
    unique_lga = data_csv['LGA'].unique()
    lga = unique_lga[lga_index].capitalize()
    associatedwards = data_csv[data_csv['LGA'].str.lower() == lga.lower()]['Ward'].dropna().unique().tolist()
    associatedwards = [ward.capitalize() for ward in associatedwards]
    associatedwards.append('Go back')
    # return associatedwards
    return associatedwards

@app.route('/lga/<lga>')
def ward(lga):
    lga = lga.capitalize()
    associated_wards = data_csv[data_csv['LGA'].str.lower() == lga.lower()]['Ward'].dropna().unique().tolist()
    associated_wards = [ward.capitalize() for ward in associated_wards]
    associated_wards.append('Go back')
    return associated_wards

@app.route('/wa/lga/<lga_index>/ward/<ward_index>')
def hfname(lga_index, ward_index):
    lga_index = int(lga_index)
    ward_index = int(ward_index)
    
    if lga_index < 0 or lga_index >= len(data_csv):
        return "Invalid LGA index"
    
    unique_lga = data_csv['LGA'].unique()
    lga = unique_lga[lga_index].capitalize()
    
    associatedwards = data_csv[data_csv['LGA'].str.lower() == lga.lower()]['Ward'].dropna().unique().tolist()
    associatedwards = [ward.capitalize() for ward in associatedwards]
    
    if ward_index < 0 or ward_index >= len(associatedwards):
        return "Invalid Ward index"
    
    #unique_ward = associatedwards['Ward'].unique()
    ward = associatedwards[ward_index]
    health_facilities = data_csv[(data_csv['LGA'].str.lower() == lga.lower()) & (data_csv['Ward'].str.lower() == ward.lower())]['Health Facility'].dropna().unique().tolist()
    
    return health_facilities

@app.route('/lga/ward/<ward>')
def hospitals(ward):
    ward = ward.capitalize()
    associated_hospitals = data_csv[data_csv['Ward'].str.capitalize() == ward]['Health Facility'].dropna().unique().tolist()
    associated_hospitals = [hospital.capitalize() for hospital in associated_hospitals]
    associated_hospitals.append('Go back')
    return associated_hospitals

@app.route('/wa/lga/ward/hospital/<hf_index>/settlements')
def settlementnames(hf_index):
    hf_index = int(hf_index)
    if hf_index < 0 or hf_index >= len(data_csv):
        return "input a value within the range"

    unique_ward = data_csv['Health Facility'].unique()
    hospital = unique_ward[hf_index].capitalize()
    associatedsettlement = data_csv[data_csv['Health Facility'].str.capitalize() == hospital]['Settlement'].dropna().unique().tolist()
    associatedsettlement = [settlement.capitalize() for settlement in associatedsettlement]
    associatedsettlement.append('Go back')
    # return associatedsettlement
    return associatedsettlement

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
    
@app.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/family')    
def settlement_familyplanning(hospital, settlement):
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    settlement_info = data_csv[(data_csv['Health Facility'].str.capitalize() == hospital) &
                               (data_csv['Settlement'].str.capitalize() == settlement)].loc[:,'MINI PILLS':'NORTISTERAT INJ']
    data = {}
    
    for _, row in settlement_info.iterrows():
        for column in settlement_info.columns.tolist():
            value = settlement_info[column].tolist()[0]
            if pd.notna(value):
                if 'phone number' in column.lower():
                        data[column] = format_phone_number(value)
                else:
                        data[column] = format_count(value)
            else:
                    data += f'{column}: This information is currently not available'
    
    if data:
        return jsonify(data)

@app.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/immunization')
def settlement_immunization(hospital, settlement):
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    settlement_info = data_csv[(data_csv['Health Facility'].str.capitalize() == hospital) &
                               (data_csv['Settlement'].str.capitalize() == settlement)].loc[:,'BCG':'Safety boxes']
    data = {}

    for _, row in settlement_info.iterrows():
        for column in settlement_info.columns.tolist():
            value = settlement_info[column].tolist()[0]
            if pd.notna(value):
                if 'phone number' in column.lower():
                        data[column] = format_phone_number(value)
                else:
                        data[column] = format_count(value)
            else:
                    data += f'{column}: This information is currently not available'
    
    if data:
        return jsonify(data)

@app.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/malaria')
def settlement_malaria(hospital, settlement):
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    settlement_info = data_csv[(data_csv['Health Facility'].str.capitalize() == hospital) &
                               (data_csv['Settlement'].str.capitalize() == settlement)].loc[:,'RDT FOR MALARIA':'Vit-A']
    data = {}
    
    for _, row in settlement_info.iterrows():
        for column in settlement_info.columns.tolist():
            value = settlement_info[column].tolist()[0]
            if pd.notna(value):
                if 'phone number' in column.lower():
                        data[column] = format_phone_number(value)
                else:
                        data[column] = format_count(value)
            else:
                    data += f'{column}: This information is currently not available'
    
    if data:
        return jsonify(data)

@app.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/consumables')
def settlement_consumables(hospital, settlement):
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    settlement_info = data_csv[(data_csv['Health Facility'].str.capitalize() == hospital) &
                               (data_csv['Settlement'].str.capitalize() == settlement)].loc[:,'COTTON WOOL 100G (1 per HF)':'TABLE NAPKIN (ROLL)']
    data = {}

    for _, row in settlement_info.iterrows():
        for column in settlement_info.columns.tolist():
            value = settlement_info[column].tolist()[0]
            if pd.notna(value):
                if 'phone number' in column.lower():
                        data[column] = format_phone_number(value)
                else:
                        data[column] = format_count(value)
            else:
                    data += f'{column}: This information is currently not available'
    
    if data:
        return jsonify(data)

@app.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/hftools')
def settlement_hftools(hospital, settlement):
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    settlement_info = data_csv[(data_csv['Health Facility'].str.capitalize() == hospital) &
                               (data_csv['Settlement'].str.capitalize() == settlement)].loc[:,'OPD REGISTER (1 per HF)':'Envelopes']
    data = {}

    for _, row in settlement_info.iterrows():
        for column in settlement_info.columns.tolist():
            value = settlement_info[column].tolist()[0]
            if pd.notna(value):
                if 'phone number' in column.lower():
                        data[column] = format_phone_number(value)
                else:
                        data[column] = format_count(value)
            else:
                    data += f'{column}: This information is currently not available'
    
    if data:
        return jsonify(data)


#----computed values
@app.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/totalpop/<total_pop>')
def settlement_pop_compute(hospital, settlement, total_pop):
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    total_pop = int(total_pop)
    
    under_1 = format_count(total_pop * 0.04)
    under_5 = format_count(total_pop * 0.20)
    six_to_59_months = format_count(total_pop * 0.18)
    pregnant_women = format_count(total_pop * 0.05)
    wra = format_count(total_pop * 0.22)
    young_adolescents = format_count(total_pop * 0.11)
    older_adolescents = format_count(total_pop * 0.11)
    
    data = {
        "Under 1": under_1,
        "Under 5": under_5,
        "(6 to 59 months)": six_to_59_months,
        "Pregnant Women": pregnant_women,
        "Women of Reproductive Age (WRA)": wra,
        "Young Adolescents (10 to 14 years)":  young_adolescents,
        "Older Adolescents (15 to 19 years)": older_adolescents
    }
    
    return (data)

@app.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/totalpop/<total_pop>/immunization_commodities')
def compute_settlement_immunization(hospital, settlement, total_pop):
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    total_pop = int(total_pop)

    data = {}

    BCG = ((total_pop * 0.04) * 0.9 * 1 * 3.33) + (((total_pop * 0.04) * 0.9 * 1 * 3.33) * 0.25)
    data['BCG'] = format_count(BCG)
    bOPV = ((total_pop * 0.04) * 0.9 * 1 * 1.33) + (((total_pop * 0.04) * 0.9 * 1 * 1.33) * 0.25)
    data['bOPV'] = format_count(bOPV)
    HepBo = ((total_pop * 0.04) * 0.9 * 1 * 1.43) + (((total_pop * 0.04) * 0.9 * 1 * 1.43) * 0.25)
    data['HepBo'] = format_count(HepBo)
    IPV = ((total_pop * 0.04) * 0.9 * 1 * 3.33) + (((total_pop * 0.04) * 0.9 * 1 * 3.33) * 0.25)
    data['IPV'] = format_count(IPV)
    Penta = ((total_pop * 0.04) * 0.9 * 3 * 1.43) + (((total_pop * 0.04) * 0.9 * 3 * 1.43) * 0.25)
    data['Penta'] = format_count(Penta)
    PCV = ((total_pop * 0.04) * 0.9 * 3 * 1.1) + (((total_pop * 0.04) * 0.9 * 3 * 1.1) * 0.25)
    data['PCV'] = format_count(PCV)
    Measles = ((total_pop * 0.04) * 0.9 * 2 * 1.43) + (((total_pop * 0.04) * 0.9 * 2 * 1.43) * 0.25)
    data['Measles'] = format_count(Measles)
    Td = ((total_pop * 0.05) * 0.9 * 5 * 1.33) + (((total_pop * 0.05) * 0.9 * 5 * 1.33) * 0.25)
    data['Td'] = format_count(Td)
    MenA = ((total_pop * 0.04) * 0.9 * 1 * 1.33) + (((total_pop * 0.04) * 0.9 * 1 * 1.33) * 0.25)
    data['MenA'] = format_count(MenA)
    Yellow_fever = ((total_pop * 0.04) * 0.9 * 1 * 1.43) + (((total_pop * 0.04) * 0.9 * 1 * 1.43) * 0.25)
    data['Yellow fever'] = format_count(Yellow_fever)
    Covid_19 = total_pop * 0.5
    data['Covid-19'] = format_count(Covid_19)
    AD_0_05ml = (total_pop * 0.04) * 0.9 * 1 * 1.1 * 1.25
    data['AD 0.05ml'] = format_count(AD_0_05ml)
    AD_0_5ml = (total_pop * 0.04) * 0.9 * 3 * 1.25
    data['AD 0.5ml'] = format_count(AD_0_5ml)
    Recon_2ml = BCG / 20
    data['Recon 2ml'] = format_count(Recon_2ml)
    Recon_5ml = (Measles + MenA + Yellow_fever) / 10
    data['Recon 5ml'] = format_count(Recon_5ml)
    BCG_diluent = BCG / 20
    data['BCG diluent'] = format_count(BCG_diluent)
    Measles_diluent = Measles / 10
    data['Measles diluent'] = format_count(Measles_diluent)
    Yellow_fever_diluent = Yellow_fever / 10
    data['Yellow fever diluent'] = format_count(Yellow_fever_diluent)
    Droppers = bOPV / 20
    data['Droppers'] = format_count(Droppers)
    Safety_boxes = (BCG + HepBo + IPV + Penta + PCV + Measles + Td + MenA + Yellow_fever) / 100
    data['Safety boxes'] = format_count(Safety_boxes)
    
    return jsonify(data)

@app.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/totalpop/<total_pop>/familyplanning_commodities')
def compute_settlement_familyplanning(hospital, settlement, total_pop):
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    total_pop = int(total_pop)
    
    data = {}
    
    mini_pills = format_count(7.3 * (total_pop * 0.22) * 1.1)
    combine_pills = format_count(7.3 * (total_pop * 0.22) * 1.1)
    male_condom = format_count(0.079 * (total_pop * 0.22) * 1.1)
    female_condom = format_count(0.004 * (total_pop * 0.22) * 1.1)
    iucd = format_count(0.035 * (total_pop * 0.22) * 1.1)
    impalanon_implant = format_count(0.424 * (total_pop * 0.22) * 1.1)
    jadel_implant = format_count(0.424 * (total_pop * 0.22) * 1.1)
    depo_provera_inj = format_count(0.346 * (total_pop * 0.22) * 1.1)
    nortisterat_inj = format_count(0.346 * (total_pop * 0.22) * 1.1)
    
    data['MINI PILLS'] = mini_pills
    data['COMBINE PILLS'] = combine_pills
    data['MALE CONDOM'] = male_condom
    data['FEMALE CONDOM'] = female_condom
    data['IUCD'] = iucd
    data['IMPALANON (IMPLANT)'] = impalanon_implant
    data['JADEL (IMPLANT)'] = jadel_implant
    data['DEPO-PROVERA INJ'] = depo_provera_inj
    data['NORTISTERAT INJ'] = nortisterat_inj
    
    return jsonify(data)

@app.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/totalpop/<total_pop>/malaria_commodities')
def compute_settlement_malaria(total_pop, hospital, settlement):
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    total_pop = int(total_pop)

    rdt_malaria = format_count(0.258 * (total_pop * 0.20) * 1.1)
    act = format_count(0.608 * (0.258 * (total_pop * 0.20) * 1.1) * 1.1)
    paracetamol_syrup = format_count((0.258 * (total_pop * 0.20) * 1.1) * 2)
    zinc_ors = format_count(0.457 * (total_pop * 0.20) * 1.1)
    disposable_amoxycillin = format_count(0.24 * (0.258 * (total_pop * 0.20) * 1.1) * 1.1)
    fesolate_tabs = format_count(0.80 * (total_pop * 0.05) * 30 * 1.1)
    folic_acid = format_count(0.80 * (total_pop * 0.05) * 30 * 1.1)
    determine = format_count(0.90 * (total_pop * 0.05) * 1.1)
    vit_a = format_count(0.80 * (0.18 * total_pop))

    data = {
        "RDT for Malaria": rdt_malaria,
        "ACT": act,
        "Paracetamol Syrup": paracetamol_syrup,
        "Zinc ORS": zinc_ors,
        "Disposable Amoxycillin DT": disposable_amoxycillin,
        "Fesolate Tabs": fesolate_tabs,
        "Folic Acid": folic_acid,
        "Determine": determine,
        "Vit-A": vit_a
    }

    return data

@app.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/totalpop/<total_pop>/consumable_commodities')
def compute_settlement_consumables(total_pop, hospital, settlement):
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    total_pop = int(total_pop)

    data = {}

    cotton_wool_100g = 0
    plaster_elastoplast = 0
    plaster_big = 0
    xylocain_injection = 0
    methylated_spirit = 0
    jik = 0
    liquid_soap = 0
    tincture_of_iodine = 0
    pt_test_kit = format_count(0.9 * (total_pop * 0.05) * 1.1)
    urine_bottle = format_count(0.9 * (total_pop * 0.05) * 1.1)
    disposable_gloves = format_count(0.9 * (total_pop * 0.05) * 1.1)
    sterile_gloves = format_count(0.035 * (total_pop * 0.22) * 1.1)
    under_lid = format_count(0.035 * (total_pop * 0.22) * 1.1)
    table_napkin = format_count(0.035 * (total_pop * 0.22) * 1.1)

    # Populate the dictionary with constant and calculated values
    data['Cotton Wool 100g (1 per HF)'] = cotton_wool_100g
    data['Plaster Elastoplast (1 per HF)'] = plaster_elastoplast
    data['Plaster (Big)'] = plaster_big
    data['Xylocain Injection (20 ML) per HF'] = xylocain_injection
    data['Methylated Spirit (1 per HF)'] = methylated_spirit
    data['PT Test Kit (PKT 20)'] = pt_test_kit
    data['Urine Bottle'] = urine_bottle
    data['Jik (1 Litre) per HF'] = jik
    data['Disposable Gloves (PKT 100)'] = disposable_gloves
    data['Sterile Gloves (PKT 50)'] = sterile_gloves
    data['Liquid Soap (50 ML) per HF'] = liquid_soap
    data['Under-Lid'] = under_lid
    data['Tincture of Iodine (20 ML) prt HF'] = tincture_of_iodine
    data['Table Napkin (Roll)'] = table_napkin

    return data

@app.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/totalpop/<total_pop>/hftool_commodities')
def compute_settlement_hftools(total_pop, hospital, settlement):
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    total_pop = int(total_pop)

    data = {}

    opd_register = 0
    fp_register = 0
    immunization_register = 0
    anc_register = 0
    pmctct_hct_register = 0
    gmp_register = 0
    out_mobile_monthly_summary = 0
    health_facility_nhmis_monthly_summary = 0
    hiv_client_intake_form = 0
    hiv_request_result_form = 0
    referral_forms = 0
    imm_card = format_count(0.9 * (total_pop * 0.04) * 1.1)
    family_planning_card = format_count((total_pop * 0.22) * 0.9)
    anc_card = format_count((total_pop * 0.05) * 0.9)
    leaflets = format_count(0.8 * (total_pop * 0.22))
    envelopes = format_count((2 * (0.8 * (total_pop * 0.05) * 30 * 1.1)) * 1.1)

    # Populate the dictionary with constant and calculated values
    data['OPD Register (1 per HF)'] = opd_register
    data['FP Register (1 per HF)'] = fp_register
    data['Immunization Register (1 per HF)'] = immunization_register
    data['ANC Register (1 per HF)'] = anc_register
    data['PMCTCT - HCT Register (1 per HF)'] = pmctct_hct_register
    data['GMP Register (1 per HF)'] = gmp_register
    data['Out /Mobile Monthly Summary (1 per HF)'] = out_mobile_monthly_summary
    data['Health Facility NHMIS Monthly Summary (1 per HF)'] = health_facility_nhmis_monthly_summary
    data['HIV Client Intake Form (1 per HF)'] = hiv_client_intake_form
    data['HIV Request & Result Form (1 per HF)'] = hiv_request_result_form
    data['Referral Forms (1 per HF)'] = referral_forms
    data['Imm Card'] = imm_card
    data['Family Planning Card'] = family_planning_card
    data['ANC Card'] = anc_card
    data['Leaflets'] = leaflets
    data['Envelopes'] = envelopes

    return data


if __name__ == '__main__':
    app.run(debug=True)