import React from "react";

const Textbox = (prop) => {
  let content;

  if (prop.type === "population") {
    content = (
      <>
        <p>Total Population of the Settlement: {prop.total_population}</p>
        <p>Number of Under-1 (TP): {prop.under_one}</p>
        <p>Number of Under-5 (TP): {prop.under_five}</p>
        <p>Number of 6-59 months (TP): {prop.six_fifty_nine}</p>
        <p>Number of Pregnant Women: {prop.number_of_pregnant_women}</p>
        <p>Number of WRA: {prop.number_of_wra}</p>
        <p>Young Adolescents 10-14 years: {prop.young_adolescents}</p>
        <p>Older Adolescents 15-19 years: {prop.older_adolescents}</p>
        <p>No of persons with disabilities: {prop.persons_with_disabilities}</p>
        <p>
          Physically Challenged:{" "}
          {prop["physically challengephysically_challengedd"]}
        </p>
        <p>Visually Impaired: {prop.visually_impaired}</p>
        <p>Hearing Impaired: {prop.hearing_impaired}</p>
        <p>Albinism: {prop.albinism}</p>
        <p>Intellectually Disabled: {prop.intellectually_disability}</p>
        <p>Mentally Challenged: {prop.mental_illness}</p>
      </>
    );
  } else if (prop.type === "profile") {
    content = (
      <>
        <p>HTR (Yes/No): {prop.htr}</p>
        <p>Security compromised (Yes/No): {prop.security_compromised}</p>
        <p>Name of Mai Unguwa: {prop.name_of_mai_unguwa}</p>
        <p>Phone Number 1: {prop.phone_number_o}</p>
        <p>
          Name of Primary school/Quranic & Islamic School:{" "}
          {prop.name_of_primary_school_quranic_school}
        </p>
        <p>Church/Mosque: {prop.church_mosque}</p>
        <p>Market/Playground: {prop.market_play_ground}</p>
        <p>Name of Community Volunteer: {prop.name_of_community_volunteer}</p>
        <p>Phone Number 2: {prop.phone_number_two}</p>
        <p>
          Distance to Health Facility (Km): {prop.distance_to_health_facility}
        </p>
      </>
    );
  } else if (prop.type === "family") {
    content = (
      <>
        <p>Mini Pills: {prop.mini_pills}</p>
        <p>Combine Pills: {prop.combine_pills}</p>
        <p>Male Condom: {prop.male_condom}</p>
        <p>Female Condom: {prop.female_condom}</p>
        <p>Iucd: {prop.iucd}</p>
        <p>Impalanon (Implant): {prop.impalanon_implant}</p>
        <p>Jadel (Implant): {prop.jadel_implant}</p>
        <p>Depo-Provera Inj: {prop.depo_provera_inj}</p>
        <p>Nortisterat Inj: {prop.nortisterat_inj}</p>
      </>
    );
  } else if (prop.type === "immunization") {
    content = (
      <>
        <p>
          BCG : {prop.bcg} <br />
          <br />
          bOPV : {prop.bopv} <br />
          <br />
          HepBo : {prop.hepbo} <br />
          <br />
          IPV : {prop.ipv} <br />
          <br />
          PCV : {prop.pcv} <br />
          <br />
          Measles : {prop.measles} <br />
          <br />
          Td : {prop.td} <br />
          <br />
          MenA : {prop.mena} <br />
          <br />
          Yellow fever : {prop.yellow_fever} <br />
          <br />
          Covid-19 : {prop.covid_19} <br />
          <br />
          AD 0.05ml : {prop.ad0_05} <br />
          <br />
          AD 0.5ml : {prop.ad_0_5ml} <br />
          <br />
          Recon 2ml : {prop.recon2ml} <br />
          <br />
          Recon 5ml : {prop.recon5ml} <br />
          <br />
          BCG diluent : {prop.bcg_diluent} <br />
          <br />
          Measles diluent : {prop.measles_diluent} <br />
          <br />
          Yellow fever diluent : {prop.yellow_fever_diluent} <br />
          <br />
          Droppers : {prop.droppers} <br />
          <br />
          Safety boxes : {prop.safety_boxes} <br />
          <br />
        </p>
      </>
    );
  } else if (prop.type === "malaria") {
    content = (
      <>
        <p>Rdt for Malaria: {prop.rdt_for_malaria}</p>
        <p>Act: {prop.act}</p>
        <p>Paracetamol Syrup(for malaria and ari): {prop.paracetamol_syrup}</p>
        <p>Zinc ors: {prop.zinc_ors}</p>
        <p>Disposible amoxycillin DT: {prop.disposible_amoxycillin_dt}</p>
        <p>Fesolate Tabs: {prop.fesolate_tabs}</p>
        <p>Folic Acid: {prop.folic_acid}</p>
        <p>Determine: {prop.determine}</p>
        <p>Vit-A: {prop.vit_a}</p>
      </>
    );
  }  else if (prop.type === "consumables") {
    content = (
      <>
        <p>Cotton Wool 100G(1 per HF): {prop.cotton_wool}</p>
        <p>Plaster Elastoplast(1 per HF): {prop.plaster_elastoplast}</p>
        <p>Plaster (BIG): {prop.plaster_big}</p>
        <p>Xylocain Injection (20 ML) per HF: {prop.xylocain_injection}</p>
        <p>Methylated Sipirit (1 per HF): {prop.methylated_sipirit}</p>
        <p>Pt Test Kit: {prop.pt_test_kit}</p>
        <p>Urine Bottle: {prop.urine_bottle}</p>
        <p>Jik (1 liter) per HF: {prop.jik}</p>
        <p>Disposable Gloves (pkt 100): {prop.disposable_gloves}</p>
        <p>Sterile Gloves (pkt 50): {prop.sterile_gloves}</p>
        <p>Liquid Soap (50 ML) per HF: {prop.liquid_soap}</p>
        <p>Under-Lid: {prop.under_lid}</p>
        <p>Tincture of Iodine (20 ML) prt HF: {prop.tincture_of_iodine}</p>
        <p>Table Napkin (Roll): {prop.table_napkin}</p>
      </>
    );
  } else if (prop.type === "hftools") {
    content = (
      <>
        <p>Cotton Wool 100G(1 per HF): {prop.cotton_wool}</p>
        <p>Plaster Elastoplast(1 per HF): {prop.plaster_elastoplast}</p>
        <p>Plaster (BIG): {prop.plaster_big}</p>
        <p>Xylocain Injection (20 ML) per HF: {prop.xylocain_injection}</p>
        <p>Methylated Sipirit (1 per HF): {prop.methylated_sipirit}</p>
        <p>Pt Test Kit: {prop.pt_test_kit}</p>
        <p>Urine Bottle: {prop.urine_bottle}</p>
        <p>Jik (1 liter) per HF: {prop.jik}</p>
        <p>Disposable Gloves (pkt 100): {prop.disposable_gloves}</p>
        <p>Sterile Gloves (pkt 50): {prop.sterile_gloves}</p>
        <p>Liquid Soap (50 ML) per HF: {prop.liquid_soap}</p>
        <p>Under-Lid: {prop.under_lid}</p>
        <p>Tincture of Iodine (20 ML) prt HF: {prop.tincture_of_iodine}</p>
        <p>Table Napkin (Roll): {prop.table_napkin}</p>
      </>
    );
  } else {
    content = <p>No data available for the selected type.</p>;
  }

  return <div style={{ marginLeft: "15px" }}>{content}</div>;
};

export default Textbox;
