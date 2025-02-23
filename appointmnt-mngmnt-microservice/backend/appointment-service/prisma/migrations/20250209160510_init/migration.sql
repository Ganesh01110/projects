-- CreateTable
CREATE TABLE `Medicine` (
    `medicine_id` INTEGER NOT NULL AUTO_INCREMENT,
    `medicine_name` VARCHAR(191) NOT NULL,
    `hsn` VARCHAR(191) NULL,
    `batch_no` VARCHAR(191) NULL,
    `serial_no` VARCHAR(191) NULL,
    `company_name` VARCHAR(191) NULL,
    `expiry_date` DATETIME(3) NULL,
    `pieces_per_unit` INTEGER NULL,
    `mrp` DECIMAL(65, 30) NULL,
    `purchase_price` DECIMAL(65, 30) NULL,

    PRIMARY KEY (`medicine_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
