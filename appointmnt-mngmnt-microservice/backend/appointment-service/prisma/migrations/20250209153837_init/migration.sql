-- CreateTable
CREATE TABLE `Patient` (
    `patientId` INTEGER NOT NULL AUTO_INCREMENT,
    `RegistrationNo` VARCHAR(191) NOT NULL,
    `admission_date` DATETIME(3) NULL,
    `department` VARCHAR(191) NULL,
    `id_no` VARCHAR(191) NULL,
    `admission_time` DATETIME(3) NULL,
    `admission_type` ENUM('OPD', 'IPD', 'OT', 'EMERGENCY', 'DISCHARGED') NOT NULL DEFAULT 'OPD',
    `PatientName` VARCHAR(191) NOT NULL,
    `Gender` VARCHAR(191) NOT NULL,
    `Age` INTEGER NULL,
    `religion` VARCHAR(191) NULL,
    `GuardianName` VARCHAR(191) NULL,
    `phoneNo` VARCHAR(191) NULL,
    `JoinerName` VARCHAR(191) NULL,
    `JoinerphoneNo` VARCHAR(191) NULL,
    `RelationShip` VARCHAR(191) NULL,
    `Address` VARCHAR(191) NULL,
    `City` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `PostalCode` VARCHAR(191) NULL,
    `attending_doctor` VARCHAR(191) NULL,
    `CabinNo` VARCHAR(191) NULL,
    `Status` ENUM('OPD', 'IPD', 'OT', 'EMERGENCY', 'DISCHARGED') NULL,
    `registration_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Problems` VARCHAR(191) NULL,
    `Remarks` VARCHAR(191) NULL,
    `Notification_visibility` ENUM('NotViewed', 'Viewed') NOT NULL DEFAULT 'NotViewed',
    `Lab_Notification_visibility` ENUM('NotViewed', 'Viewed') NOT NULL DEFAULT 'NotViewed',
    `Pharma_Notification_visibility` ENUM('NotViewed', 'Viewed') NOT NULL DEFAULT 'NotViewed',
    `discharge_date` DATETIME(3) NULL,

    UNIQUE INDEX `Patient_RegistrationNo_key`(`RegistrationNo`),
    PRIMARY KEY (`patientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PatientAdmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` INTEGER NOT NULL,
    `admission_type` ENUM('OPD', 'IPD', 'OT', 'EMERGENCY', 'DISCHARGED') NOT NULL,
    `current_dept_type` ENUM('OPD', 'IPD', 'OT', 'EMERGENCY', 'DISCHARGED') NOT NULL,
    `admission_date` DATETIME(3) NOT NULL,
    `discharge_date` DATETIME(3) NULL,
    `current_status` ENUM('ACTIVE', 'DISCHARGED') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PatientDoctorMapping` (
    `mapping_id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` INTEGER NOT NULL,
    `doctor_id` VARCHAR(191) NOT NULL,
    `department` ENUM('OPD', 'IPD', 'OT', 'EMERGENCY', 'DISCHARGED') NULL,
    `role` ENUM('Consulting', 'Attending', 'Referral', 'Other') NOT NULL,
    `role_name` VARCHAR(191) NULL,
    `consultation_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'DISCHARGED') NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY (`mapping_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DoctorVisit` (
    `visit_id` INTEGER NOT NULL AUTO_INCREMENT,
    `mapping_id` INTEGER NOT NULL,
    `department` ENUM('OPD', 'IPD', 'OT', 'EMERGENCY', 'DISCHARGED') NULL,
    `visit_datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `medicines_prescribed` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `suggestions` VARCHAR(191) NULL,

    PRIMARY KEY (`visit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PatientDepartmentHistory` (
    `history_id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` INTEGER NOT NULL,
    `previous_department` ENUM('OPD', 'IPD', 'OT', 'EMERGENCY', 'DISCHARGED') NULL,
    `current_department` ENUM('OPD', 'IPD', 'OT', 'EMERGENCY', 'DISCHARGED') NULL,
    `transition_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `remarks` VARCHAR(191) NULL,

    PRIMARY KEY (`history_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DoctorPatientHistory` (
    `visit_history_id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` INTEGER NOT NULL,
    `doctorId` VARCHAR(191) NOT NULL,
    `visit_datetime` DATETIME(3) NOT NULL,
    `department` ENUM('OPD', 'IPD', 'OT', 'EMERGENCY', 'DISCHARGED') NOT NULL DEFAULT 'OPD',
    `medicines_prescribed` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `suggestions` VARCHAR(191) NULL,
    `doctor_fee` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`visit_history_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PatientAdmission` ADD CONSTRAINT `PatientAdmission_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`patientId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientDoctorMapping` ADD CONSTRAINT `PatientDoctorMapping_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`patientId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DoctorVisit` ADD CONSTRAINT `DoctorVisit_mapping_id_fkey` FOREIGN KEY (`mapping_id`) REFERENCES `PatientDoctorMapping`(`mapping_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientDepartmentHistory` ADD CONSTRAINT `PatientDepartmentHistory_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`patientId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DoctorPatientHistory` ADD CONSTRAINT `DoctorPatientHistory_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`patientId`) ON DELETE RESTRICT ON UPDATE CASCADE;
