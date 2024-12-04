from dotenv import load_dotenv
from sqlalchemy import text
from flask import Blueprint, jsonify, current_app
import pandas as pd
from flask_cors import CORS
import re
import os
import math
import json

microplan_bp_ = Blueprint("microplan", __name__, template_folder="templates")
CORS(microplan_bp_)

load_dotenv()

def initialize_db(db):
    def _init():
        query = "SELECT * FROM master_microplan"

        results = {} 
        with db.engine.connect() as connection:
            db_df = pd.read_sql_query(query, connection)
            results = db_df
        return results
    return _init

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

@microplan_bp_.route('/lgas')
def lgas():
    df = current_app.extensions['microplan_df']
    unique_lgas = df['lga'].dropna().unique().tolist()
    unique_lgas = [lga.capitalize() for lga in unique_lgas]
    unique_lgas.append('Go back')
    return unique_lgas

@microplan_bp_.route('/wa/lga/<lga_index>')
def wardname(lga_index):
    df = current_app.extensions['microplan_df']
    lga_index = int(lga_index)
    if lga_index < 0 or lga_index >= len(df):
        return "Invalid index"
    
    unique_lga = df['lga'].unique()
    lga = unique_lga[lga_index].capitalize()
    associatedwards = df[df['lga'].str.lower() == lga.lower()]['ward'].dropna().unique().tolist()
    associatedwards = [ward.capitalize() for ward in associatedwards]
    associatedwards.append('Go back')
    return associatedwards

@microplan_bp_.route('/lga/<lga>')
def ward(lga):
    df = current_app.extensions['microplan_df']
    lga = lga.capitalize()
    associated_wards = df[df['lga'].str.lower() == lga.lower()]['ward'].dropna().unique().tolist()
    associated_wards = [ward.capitalize() for ward in associated_wards]
    associated_wards.append('Go back')
    return associated_wards

@microplan_bp_.route('/wa/lga/<lga_index>/ward/<ward_index>')
def hfname(lga_index, ward_index):
    df = current_app.extensions['microplan_df']
    lga_index = int(lga_index)
    ward_index = int(ward_index)
    
    if lga_index < 0 or lga_index >= len(df):
        return "Invalid lga index"
    
    unique_lga = df['lga'].unique()
    lga = unique_lga[lga_index].capitalize()
    
    associatedwards = df[df['lga'].str.lower() == lga.lower()]['ward'].dropna().unique().tolist()
    associatedwards = [ward.capitalize() for ward in associatedwards]
    
    if ward_index < 0 or ward_index >= len(associatedwards):
        return "Invalid Ward index"
    
    #unique_ward = associatedwards['Ward'].unique()
    ward = associatedwards[ward_index]
    health_facilities = df[(df['lga'].str.lower() == lga.lower()) & (df['ward'].str.lower() == ward.lower())]['health_facility'].dropna().unique().tolist()
    
    return health_facilities

@microplan_bp_.route('/coordinate/<lga>/<ward>')
def get_coordinate(lga, ward):
    df = current_app.extensions['microplan_df']
    lga = lga.capitalize()
    ward = ward.capitalize()
    coordinate = df[(df['lga'].str.capitalize() == lga) &
                      (df['ward'].str.capitalize() == ward)]['Coordinates'].unique()[0]
    coordinate = str(coordinate)
    return jsonify(coordinate)

@microplan_bp_.route('/lga/ward/<ward>')
def hospitals(ward):
    df = current_app.extensions['microplan_df']
    ward = ward.capitalize()
    associated_hospitals = df[df['ward'].str.capitalize() == ward]['health_facility'].dropna().unique().tolist()
    associated_hospitals = [hospital.capitalize() for hospital in associated_hospitals]
    associated_hospitals.append('Go back')
    return associated_hospitals

@microplan_bp_.route('/wa/lga/ward/hospital/<hf_index>/settlements')
def settlementnames(hf_index):
    df = current_app.extensions['microplan_df']
    hf_index = int(hf_index)
    if hf_index < 0 or hf_index >= len(df):
        return "input a value within the range"

    unique_ward = df['health_facility'].unique()
    hospital = unique_ward[hf_index].capitalize()
    associatedsettlement = df[df['health_facility'].str.capitalize() == hospital]['settlement'].dropna().unique().tolist()
    associatedsettlement = [settlement.capitalize() for settlement in associatedsettlement]
    associatedsettlement.append('Go back')
    return associatedsettlement

@microplan_bp_.route('/lga/ward/hospital/<hospital>/settlements')
def settlements(hospital):
    df = current_app.extensions['microplan_df']
    hospital = hospital.capitalize()
    settlements = df[df['health_facility'].str.capitalize() == hospital]['settlement'].dropna().unique().tolist()
    settlements.append('go back')
    for i in range(len(settlements)):
        settlements[i] = settlements[i].capitalize()
    return settlements

@microplan_bp_.route('/lga/ward/hospital/<hospital>/status')    
def hospital_status(hospital):
    df = current_app.extensions['microplan_df']
    hospital = hospital.capitalize()
    specific_clinic_rows = df[df['health_facility'].str.capitalize() == hospital]
    columns = ['ownership_type', 'facility_type']
    
    data = {}

    for column in columns:
        value = specific_clinic_rows.iloc[0][column]
        if pd.notna(value):
            data[column] = value

    return jsonify(data)
    

@microplan_bp_.route('/lga/ward/hospital/<hospital>/humanResources')
def human_resources(hospital):
    df = current_app.extensions['microplan_df']
    hospital = hospital.capitalize()
    specific_clinic_rows = df[df['health_facility'].str.capitalize() == hospital]
    columns = ['officer_in_charge', 'phone_number', 'permanent_technical_staff', 'adhoc_technical_staff', 'volunteer_technical_staff',
               'permanent_non_technical_staff', 'name_of_ward_ce_focal_person', 'phone_number_1']
    
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

@microplan_bp_.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/population')
def settlement_population(hospital, settlement):
    df = current_app.extensions['microplan_df']
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    settlement_info = df[(df['health_facility'].str.capitalize() == hospital) &
                               (df['settlement'].str.capitalize() == settlement)].loc[:,'total_population':'mental_illness']
    data = {}
    
    for column in settlement_info.columns:
        value = settlement_info[column].iloc[0]
        if pd.notna(value):
            data[column] = rounded_number(value)
        else:
            data[column] = "This information is currently not available"
    return jsonify(data)

@microplan_bp_.route('/lga/ward/hospital/<hospital>/map')
def show_map(hospital):
    df = current_app.extensions['microplan_df']
    hospital = hospital.capitalize()
    map_url = df[df['health_facility'].str.capitalize() == hospital]['Catchment Url'].iloc[0]
    return jsonify(map_url)
    
@microplan_bp_.route('/lga/ward/hospital/<hospital>/cmap/')
def show_c_map(hospital):
    df = current_app.extensions['microplan_df']
    hospital = hospital.capitalize()
    map_url = df[df['health_facility'].str.capitalize() == hospital]['Catchment Url'].iloc[0]
    map_url = [map_url]
    map_url.append('Go back')
    return map_url

@microplan_bp_.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/profile')
def settlement_profile(hospital, settlement):
    df = current_app.extensions['microplan_df']
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    settlement_info = df[(df['health_facility'].str.capitalize() == hospital) & 
                               (df['settlement'].str.capitalize() == settlement)]
    columns = ["distance_to_health_facility","htr","security_compromised", "name_of_mai_unguwa",
               "phone_number_two", "name_of_community_volunteer","phone_number_o", 
               "name_of_primary_school_quranic_school","church_mosque",
               "market_play_ground"]
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
        
    if data:
        return jsonify(data)
    else:
        return "settlement information not found within this phc."
    
@microplan_bp_.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/family')    
def settlement_familyplanning(hospital, settlement):
    df = current_app.extensions['microplan_df']
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    settlement_info = df[(df['health_facility'].str.capitalize() == hospital) &
                               (df['settlement'].str.capitalize() == settlement)].loc[:,'mini_pills':'nortisterat_inj']
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

@microplan_bp_.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/immunization')
def settlement_immunization(hospital, settlement):
    df = current_app.extensions['microplan_df']
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    settlement_info = df[(df['health_facility'].str.capitalize() == hospital) &
                               (df['settlement'].str.capitalize() == settlement)]
    total_population = settlement_info['total_population'].unique()[0]
    
    under1 = (0.04 * total_population)
    npw = (0.05 * total_population)   #.loc[:,'BCG':'Safety boxes']

    columns = ["covid_19", "ad_0_5ml", "bcg_diluent", "measles_diluent", "yellow_fever_diluent", "droppers", "safety_boxes"]

    data = {}

    calculations = {
        'bcg': under1 * 0.90 * 1 * 3.33,
        'bopv': under1 * 90 * 1 * 1.33,
        'hepbo': under1 * 90 * 1 * 1.43,
        'ipv': under1 * 90 * 1 * 1.33,
        'penta': under1 * 90 * 3 * 1.43,
        'pcv': under1 * 90 * 3 * 1.1,
        'measles': under1 * 90 * 2 * 1.43,
        'td': npw * 90 * 5 * 1.33,
        'mena': under1 * 90 * 1 * 1.33,
        'yellow_fever': under1 * 90 * 1 * 1.43,
        'ad0_05': under1 * 90 * 1 * 1.1,
        'recon2ml': (under1 * 90 * 1 * 1.33 + under1 * 90 * 2 * 1.43 + under1 * 90 * 1 * 1.43)
    }

    for key, value in calculations.items():
        data[key] = format_count((value * 0.25) + value)

    for _, row in settlement_info.iterrows():
        for column in columns:
            value = row[column]
            if pd.notna(value):
                data[column] = format_count(value)
            else:
                data[column] = 'This information is currently not available'
    
    return (data)

@microplan_bp_.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/malaria')
def settlement_malaria(hospital, settlement):
    df = current_app.extensions['microplan_df']
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    settlement_info = df[(df['health_facility'].str.capitalize() == hospital) &
                               (df['settlement'].str.capitalize() == settlement)].loc[:,'rdt_for_malaria':'vit_a']
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

@microplan_bp_.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/consumables')
def settlement_consumables(hospital, settlement):
    df = current_app.extensions['microplan_df']
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    settlement_info = df[(df['health_facility'].str.capitalize() == hospital) &
                               (df['settlement'].str.capitalize() == settlement)].loc[:,'cotton_wool':'table_napkin']
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

@microplan_bp_.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/hftools')
def settlement_hftools(hospital, settlement):
    df = current_app.extensions['microplan_df']
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    settlement_info = df[(df['health_facility'].str.capitalize() == hospital) &
                               (df['settlement'].str.capitalize() == settlement)].loc[:,'opd_register':'envelopes']
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
@microplan_bp_.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/totalpop/<total_pop>')
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
        "under_1": under_1,
        "under_5": under_5,
        "six_to_59_months": six_to_59_months,
        "pregnant_women": pregnant_women,
        "women_of_reproductive_age": wra,
        "young_adolescents":  young_adolescents,
        "older_adolescents": older_adolescents
    }
    
    return (data)

@microplan_bp_.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/totalpop/<total_pop>/immunization_commodities')
def compute_settlement_immunization(hospital, settlement, total_pop):
    hospital = hospital.capitalize()
    settlement = settlement.capitalize()
    total_pop = int(total_pop)

    data = {}

    BCG = ((total_pop * 0.04) * 0.9 * 1 * 3.33) + (((total_pop * 0.04) * 0.9 * 1 * 3.33) * 0.25)
    data['bcg'] = format_count(BCG)
    bOPV = ((total_pop * 0.04) * 0.9 * 1 * 1.33) + (((total_pop * 0.04) * 0.9 * 1 * 1.33) * 0.25)
    data['bopv'] = format_count(bOPV)
    HepBo = ((total_pop * 0.04) * 0.9 * 1 * 1.43) + (((total_pop * 0.04) * 0.9 * 1 * 1.43) * 0.25)
    data['hepbo'] = format_count(HepBo)
    IPV = ((total_pop * 0.04) * 0.9 * 1 * 3.33) + (((total_pop * 0.04) * 0.9 * 1 * 3.33) * 0.25)
    data['ipv'] = format_count(IPV)
    Penta = ((total_pop * 0.04) * 0.9 * 3 * 1.43) + (((total_pop * 0.04) * 0.9 * 3 * 1.43) * 0.25)
    data['penta'] = format_count(Penta)
    PCV = ((total_pop * 0.04) * 0.9 * 3 * 1.1) + (((total_pop * 0.04) * 0.9 * 3 * 1.1) * 0.25)
    data['pcv'] = format_count(PCV)
    Measles = ((total_pop * 0.04) * 0.9 * 2 * 1.43) + (((total_pop * 0.04) * 0.9 * 2 * 1.43) * 0.25)
    data['measles'] = format_count(Measles)
    Td = ((total_pop * 0.05) * 0.9 * 5 * 1.33) + (((total_pop * 0.05) * 0.9 * 5 * 1.33) * 0.25)
    data['td'] = format_count(Td)
    MenA = ((total_pop * 0.04) * 0.9 * 1 * 1.33) + (((total_pop * 0.04) * 0.9 * 1 * 1.33) * 0.25)
    data['mena'] = format_count(MenA)
    Yellow_fever = ((total_pop * 0.04) * 0.9 * 1 * 1.43) + (((total_pop * 0.04) * 0.9 * 1 * 1.43) * 0.25)
    data['yellow_fever'] = format_count(Yellow_fever)
    Covid_19 = total_pop * 0.5
    data['covid_19'] = format_count(Covid_19)
    AD_0_05ml = (total_pop * 0.04) * 0.9 * 1 * 1.1 * 1.25
    data['ad0_05'] = format_count(AD_0_05ml)
    AD_0_5ml = (total_pop * 0.04) * 0.9 * 3 * 1.25
    data['ad_0_5ml'] = format_count(AD_0_5ml)
    Recon_2ml = BCG / 20
    data['recon2ml'] = format_count(Recon_2ml)
    Recon_5ml = (Measles + MenA + Yellow_fever) / 10
    data['recon5ml'] = format_count(Recon_5ml)
    BCG_diluent = BCG / 20
    data['bcg_diluent'] = format_count(BCG_diluent)
    Measles_diluent = Measles / 10
    data['measles_diluent'] = format_count(Measles_diluent)
    Yellow_fever_diluent = Yellow_fever / 10
    data['yellow_fever_diluent'] = format_count(Yellow_fever_diluent)
    Droppers = bOPV / 20
    data['droppers'] = format_count(Droppers)
    Safety_boxes = (BCG + HepBo + IPV + Penta + PCV + Measles + Td + MenA + Yellow_fever) / 100
    data['safety_boxes'] = format_count(Safety_boxes)
    
    return jsonify(data)

@microplan_bp_.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/totalpop/<total_pop>/familyplanning_commodities')
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
    
    data['mini_pills'] = mini_pills
    data['combine_pills'] = combine_pills
    data['male_condom'] = male_condom
    data['female_condom'] = female_condom
    data['iucd'] = iucd
    data['impalanon_implant'] = impalanon_implant
    data['jadel_implant'] = jadel_implant
    data['depo_provera_inj'] = depo_provera_inj
    data['nortisterat_inj'] = nortisterat_inj
    
    return jsonify(data)

@microplan_bp_.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/totalpop/<total_pop>/malaria_commodities')
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
        "rdt_for_malaria": rdt_malaria,
        "act": act,
        "paracetamol_syrup": paracetamol_syrup,
        "zinc_ors": zinc_ors,
        "disposible_amoxycillin_dt": disposable_amoxycillin,
        "fesolate_tabs": fesolate_tabs,
        "folic_acid": folic_acid,
        "determine": determine,
        "vit_a": vit_a
    }

    return data

@microplan_bp_.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/totalpop/<total_pop>/consumable_commodities')
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
    data['cotton_wool'] = cotton_wool_100g
    data['plaster_elastoplast'] = plaster_elastoplast
    data['plaster_big'] = plaster_big
    data['xylocain_injection'] = xylocain_injection
    data['methylated_sipirit'] = methylated_spirit
    data['pt_test_kit'] = pt_test_kit
    data['urine_bottle'] = urine_bottle
    data['jik'] = jik
    data['disposable_gloves'] = disposable_gloves
    data['sterile_gloves'] = sterile_gloves
    data['liquid_soap'] = liquid_soap
    data['Under-Lid'] = under_lid
    data['tincture_of_iodine'] = tincture_of_iodine
    data['table_napkin'] = table_napkin

    return data

@microplan_bp_.route('/lga/ward/hospital/<hospital>/settlement/<settlement>/totalpop/<total_pop>/hftool_commodities')
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
    data['opd_register'] = opd_register
    data['fp_register'] = fp_register
    data['immunization_register'] = immunization_register
    data['anc_register'] = anc_register
    data['pmctct_hct_register'] = pmctct_hct_register
    data['gmp_register'] = gmp_register
    data['out_mobile_monthly_summary'] = out_mobile_monthly_summary
    data['health_facility_nhmis_monthly_summary'] = health_facility_nhmis_monthly_summary
    data['hiv_client_intake_form'] = hiv_client_intake_form
    data['hiv_request_result_form'] = hiv_request_result_form
    data['referral_forms'] = referral_forms
    data['imm_card'] = imm_card
    data['family_planning_card'] = family_planning_card
    data['anc_card'] = anc_card
    data['leaflets'] = leaflets
    data['envelopes'] = envelopes

    return data


if __name__ == '__main__':
   microplan_bp_.run(debug=True, host="0.0.0.0", port=8000)
