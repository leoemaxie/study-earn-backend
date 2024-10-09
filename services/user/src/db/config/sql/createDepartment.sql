DROP TABLE IF EXISTS department;

CREATE TABLE department (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name	VARCHAR(256) NOT NULL,
    faculty_id UUID REFERENCES faculty(id) ON DELETE CASCADE,
    code	VARCHAR(3),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

DO $$ 
DECLARE
    faculty_computing UUID;
    faculty_engineering UUID;
    faculty_pure_applied UUID;
    faculty_arts_social UUID;
    faculty_management UUID;
    faculty_environmental UUID;
    faculty_nursing UUID;
    faculty_clinical UUID;
    faculty_basic_clinical UUID;
    faculty_health UUID;
    faculty_agricultural UUID;
    faculty_renewable UUID;
BEGIN
    SELECT id INTO faculty_computing FROM faculty WHERE name = 'Computing and Informatics';
    SELECT id INTO faculty_engineering FROM faculty WHERE name = 'Engineering and Technology';
    SELECT id INTO faculty_pure_applied FROM faculty WHERE name = 'Pure and Applied Sciences';
    SELECT id INTO faculty_arts_social FROM faculty WHERE name = 'Arts and Social Sciences';
    SELECT id INTO faculty_management FROM faculty WHERE name = 'Management Sciences';
    SELECT id INTO faculty_environmental FROM faculty WHERE name = 'Environmental Sciences';
    SELECT id INTO faculty_nursing FROM faculty WHERE name = 'Nursing Sciences';
    SELECT id INTO faculty_clinical FROM faculty WHERE name = 'Clinical Sciences';
    SELECT id INTO faculty_basic_clinical FROM faculty WHERE name = 'Basic Clinical Sciences';
    SELECT id INTO faculty_health FROM faculty WHERE name = 'Health Sciences';
    SELECT id INTO faculty_agricultural FROM faculty WHERE name = 'Agricultural Sciences';
    SELECT id INTO faculty_renewable FROM faculty WHERE name = 'Renewable Natural Resources';

    INSERT INTO department (name, faculty_id, code) VALUES 
        ('Computer Science', faculty_computing, 'CSE'),
        ('Cyber Security Science', faculty_computing, 'CYB'),
        ('Information Systems', faculty_computing, 'ISS'),
        ('Library and Information Science', faculty_computing, 'LIS'),
        ('Agricultural Engineering', faculty_engineering, 'AGE'),
        ('Chemical Engineering', faculty_engineering, 'CHE'),
        ('Civil Engineering', faculty_engineering, 'CVE'),
        ('Computer Engineering', faculty_engineering, 'CPE'),
        ('Electronic and Electrical Engineering', faculty_engineering, 'EEE'),
        ('Food Engineering', faculty_engineering, 'FDE'),
        ('Mechanical Engineering', faculty_engineering, 'MEE'),
        ('Earth Science', faculty_pure_applied, 'ESC'),
        ('General Studies', faculty_pure_applied, 'GNS'),
        ('Pure and Applied Biology', faculty_pure_applied, 'PAB'),
        ('Pure and Applied Chemistry', faculty_pure_applied, 'PAC'),
        ('Pure and Applied Mathematics', faculty_pure_applied, 'APM'),
        ('Pure and Applied Physics', faculty_pure_applied, 'PAP'),
        ('Science Laboratory Technology', faculty_pure_applied, 'SLT'),
        ('Statistics', faculty_pure_applied, 'STS'),
        ('English and Literary Studies', faculty_arts_social, 'ELS'),
        ('Philosophy', faculty_arts_social, 'PHY'),
        ('History', faculty_arts_social, 'HST'),
        ('Sociology', faculty_arts_social, 'SOC'),
        ('Accounting', faculty_management, 'ACC'),
        ('Business Management', faculty_management, 'BMT'),
        ('Economics', faculty_management, 'ECO'),
        ('Marketing', faculty_management, 'MKT'),
        ('Transport Management', faculty_management, 'TMT'),
        ('Architecture', faculty_management, 'ART'),
        ('Building', faculty_environmental, 'BUG'),
        ('Estate Management', faculty_environmental, 'EMT'),
        ('Fine and Applied Arts', faculty_environmental, 'FAA'),
        ('Surveying and Geoinformatics', faculty_environmental, 'SUG'),
        ('Urban and Regional Planning', faculty_environmental, 'URP'),
        ('Mental Health', faculty_nursing, 'MNH'),
        ('Medical/Surgical Nursing', faculty_nursing, 'MSN'),
        ('Maternal and Child Health Nursing', faculty_nursing, 'MCN'),
        ('Public Health Nursing', faculty_nursing, 'PHN'),
        ('Anaesthesia', faculty_clinical, 'ANA'),
        ('Community Medicine', faculty_clinical, 'CME'),
        ('Ear, Nose and Throat', faculty_clinical, 'EAT'),
        ('Medicine', faculty_clinical, 'MED'),
        ('Obstetrics and Gynaecology', faculty_clinical, 'OBG'),
        ('Ophthalmology', faculty_clinical, 'OPH'),
        ('Pediatrics and Child Health', faculty_clinical, 'PCH'),
        ('Psychiatry', faculty_clinical, 'PSY'),
        ('Radiology', faculty_clinical, 'RAD'),
        ('Surgery', faculty_clinical, 'SUY'),
        ('Chemical Pathology', faculty_basic_clinical, 'CHP'),
        ('Haematology and Blood Transfusion', faculty_basic_clinical, 'HBT'),
        ('Medical Microbiology and Parasitology', faculty_basic_clinical, 'MMP'),
        ('Morbid Anatomy and Histopathology', faculty_basic_clinical, 'MAH'),
        ('Pharmacology and Therapeutics', faculty_basic_clinical, 'PAT'),
        ('Anatomy', faculty_health, 'ANA'),
        ('Biochemistry', faculty_health, 'BCH'),
        ('Medical Laboratory Science', faculty_health, 'MLS'),
        ('Physiology', faculty_health, 'PSG'),
        ('Agricultural Economics', faculty_agricultural, 'AGC'),
        ('Agricultural Extension and Rural Development', faculty_agricultural, 'AER'),
        ('Animal Nutrition and Biotechnology', faculty_agricultural, 'ANB'),
        ('Animal Production and Health', faculty_agricultural, 'APH'),
        ('Crop and Environmental Protection', faculty_agricultural, 'CEP'),
        ('Crop Production and Soil Science', faculty_agricultural, 'CPS'),
        ('Forest Resource Management', faculty_renewable, 'FRM'),
        ('Wildlife and Ecotourism Management', faculty_renewable, 'WEM'),
        ('Aquaculture and Fisheries Management', faculty_renewable, 'AFM');
END $$;
