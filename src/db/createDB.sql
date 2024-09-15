-- Create an ENUM type for user roles
CREATE TYPE user_role_type AS ENUM ('admin', 'student', 'staff');

CREATE TABLE users (
    user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_role user_role_type NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    last_login TIMESTAMP DEFAULT now()
);

CREATE TABLE students (
    student_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    enrollment_date TIMESTAMP DEFAULT now(),
    major VARCHAR(255),
    GPA DECIMAL(3, 2), -- Example: 3.75
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE staff (
    staff_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255),
    department VARCHAR(255),
    hire_date TIMESTAMP DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE admins (
    admin_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    department VARCHAR(255),
    hire_date TIMESTAMP DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE schools (
    school_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_number VARCHAR(20),
    email VARCHAR(255),
    established_date DATE,
    school_type VARCHAR(255), -- Example: Public, Private, Charter
    website VARCHAR(255)
);

-- Trigger to update 'updated_at' on modification
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_modtime
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Trigger to prevent 'created_at' from being updated
CREATE OR REPLACE FUNCTION prevent_created_at_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
    RAISE EXCEPTION 'created_at column cannot be updated.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Loop through each table that has a 'created_at' column
    FOR rec IN
        SELECT table_name
        FROM information_schema.columns
        WHERE column_name = 'created_at'
        AND table_schema = 'public'
    LOOP
        -- Create the trigger dynamically for each table
        EXECUTE format('
            CREATE TRIGGER enforce_created_at_immutable
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION prevent_created_at_update();', rec.table_name);
    END LOOP;
END $$;
