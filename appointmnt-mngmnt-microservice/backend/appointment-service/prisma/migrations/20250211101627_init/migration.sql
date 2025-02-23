/*
  Warnings:

  - You are about to drop the `appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctorpatienthistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctorvisit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patientadmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patientdepartmenthistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patientdoctormapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_details` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `doctorpatienthistory` DROP FOREIGN KEY `DoctorPatientHistory_patientId_fkey`;

-- DropForeignKey
ALTER TABLE `doctorvisit` DROP FOREIGN KEY `DoctorVisit_mapping_id_fkey`;

-- DropForeignKey
ALTER TABLE `patientadmission` DROP FOREIGN KEY `PatientAdmission_patientId_fkey`;

-- DropForeignKey
ALTER TABLE `patientdepartmenthistory` DROP FOREIGN KEY `PatientDepartmentHistory_patientId_fkey`;

-- DropForeignKey
ALTER TABLE `patientdoctormapping` DROP FOREIGN KEY `PatientDoctorMapping_patientId_fkey`;

-- DropTable
DROP TABLE `appointment`;

-- DropTable
DROP TABLE `doctorpatienthistory`;

-- DropTable
DROP TABLE `doctorvisit`;

-- DropTable
DROP TABLE `medicine`;

-- DropTable
DROP TABLE `patient`;

-- DropTable
DROP TABLE `patientadmission`;

-- DropTable
DROP TABLE `patientdepartmenthistory`;

-- DropTable
DROP TABLE `patientdoctormapping`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `user_details`;

-- CreateTable
CREATE TABLE `Bill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
