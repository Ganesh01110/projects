-- Create users and set passwords first
CREATE USER auth_user WITH ENCRYPTED PASSWORD 'auth_password';
CREATE USER user_user WITH ENCRYPTED PASSWORD 'user_password';
CREATE USER ride_user WITH ENCRYPTED PASSWORD 'ride_password';
CREATE USER location_user WITH ENCRYPTED PASSWORD 'location_password';
CREATE USER notification_user WITH ENCRYPTED PASSWORD 'notification_password';
CREATE USER payment_user WITH ENCRYPTED PASSWORD 'payment_password';
CREATE USER recomendation_user WITH ENCRYPTED PASSWORD 'recomendation_password';
CREATE USER shared_user WITH ENCRYPTED PASSWORD 'shared_password';


-- Create databases with specific owners (users now exist)
CREATE DATABASE auth_db OWNER auth_user;
CREATE DATABASE user_db OWNER user_user;
CREATE DATABASE ride_db OWNER ride_user;
CREATE DATABASE location_db OWNER location_user;
CREATE DATABASE notification_db OWNER notification_user;
CREATE DATABASE payment_db OWNER payment_user;
CREATE DATABASE recomendation_db OWNER recomendation_user;
CREATE DATABASE shared_db OWNER recomendation_user;


-- Grant privileges to users on their respective databases
GRANT ALL PRIVILEGES ON DATABASE auth_db TO auth_user;
GRANT ALL PRIVILEGES ON DATABASE user_db TO user_user;
GRANT ALL PRIVILEGES ON DATABASE ride_db TO ride_user;
GRANT ALL PRIVILEGES ON DATABASE location_db TO location_user;
GRANT ALL PRIVILEGES ON DATABASE notification_db TO notification_user;
GRANT ALL PRIVILEGES ON DATABASE payment_db TO payment_user;
GRANT ALL PRIVILEGES ON DATABASE recomendation_db TO recomendation_user;
GRANT ALL PRIVILEGES ON DATABASE shared_db TO shared_user;

