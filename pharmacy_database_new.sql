-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 26, 2024 at 12:46 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pharmacy_database_new`
--

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `inv_id` mediumint(6) NOT NULL,
  `inv_userid` tinyint(2) NOT NULL,
  `inv_datetime` datetime NOT NULL,
  `inv_total` mediumint(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoicemedicine`
--

CREATE TABLE `invoicemedicine` (
  `invmd_id` smallint(10) NOT NULL,
  `invmd_invid` mediumint(6) NOT NULL,
  `invmd_mdid` mediumint(8) NOT NULL,
  `invmd_quantity` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medicine`
--

CREATE TABLE `medicine` (
  `medicine_id` mediumint(7) NOT NULL,
  `medicine_brandname` varchar(50) NOT NULL,
  `medicine_genericname` varchar(50) NOT NULL,
  `medicine_categoryid` tinyint(2) NOT NULL,
  `medicine_unitid` tinyint(1) NOT NULL,
  `medicine_unitprice` decimal(10,2) NOT NULL,
  `medicine_packsize` int(4) NOT NULL,
  `medicine_inhandquantity` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicine`
--

INSERT INTO `medicine` (`medicine_id`, `medicine_brandname`, `medicine_genericname`, `medicine_categoryid`, `medicine_unitid`, `medicine_unitprice`, `medicine_packsize`, `medicine_inhandquantity`) VALUES
(5, 'Panadol', 'Paracetamol', 1, 1, 10.00, 50, 150),
(6, 'Amoxicillin 500mg', 'Amoxicillin', 1, 1, 25.00, 100, 80),
(7, 'Zyrtec', 'Cetirizine', 1, 1, 30.00, 30, 40),
(8, 'Nexium', 'Esomeprazole', 1, 1, 40.00, 30, 60),
(9, 'Ventolin', 'Albuterol', 1, 1, 45.00, 60, 90),
(11, 'Advil', 'Ibuprofen', 1, 1, 15.00, 50, 100),
(12, 'Zocor', 'Simvastatin', 2, 1, 65.00, 30, 25),
(13, 'Cymbalta', 'Duloxetine', 2, 1, 80.00, 30, 15),
(18, 'Metoprolol', 'Metoprolol', 2, 1, 30.00, 100, 60),
(20, 'Ambien', 'Zolpidem', 2, 1, 85.00, 30, 20),
(21, 'Adderall', 'Amphetamine', 2, 1, 120.00, 30, 5),
(22, 'Ritalin', 'Methylphenidate', 2, 1, 100.00, 30, 8),
(23, 'Tramadol', 'Tramadol', 1, 1, 25.00, 50, 70);

-- --------------------------------------------------------

--
-- Table structure for table `medicinecategory`
--

CREATE TABLE `medicinecategory` (
  `mdct_id` tinyint(2) NOT NULL,
  `mdct_name` varchar(50) NOT NULL,
  `mdct_code` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicinecategory`
--

INSERT INTO `medicinecategory` (`mdct_id`, `mdct_name`, `mdct_code`) VALUES
(1, 'Drugs for Animals', 'DA'),
(2, 'Drugs for Cardiovascular System', 'DC'),
(3, 'Drugs for Diabetics', 'DD'),
(4, 'Drugs for Ear / Eye / Nose', 'DE'),
(5, 'Drugs for Infections', 'DF'),
(6, 'Drugs for Digestive System', 'DG'),
(7, 'Drugs for Pain', 'DJ'),
(8, 'Drugs for Nerve System', 'DL'),
(9, 'Drugs for Mental Health', 'DM'),
(10, 'Drugs for Nutrition', 'DN'),
(11, 'Drugs for Oral System', 'DO');

-- --------------------------------------------------------

--
-- Table structure for table `ordermedicine`
--

CREATE TABLE `ordermedicine` (
  `order_id` smallint(6) NOT NULL,
  `odmd_mdid` mediumint(6) NOT NULL,
  `odmd_quantity` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ordertable`
--

CREATE TABLE `ordertable` (
  `order_id` int(5) NOT NULL,
  `order_userid` int(2) NOT NULL,
  `order_date` date NOT NULL,
  `order_total` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `role_id` varchar(10) NOT NULL,
  `role_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`role_id`, `role_name`) VALUES
('1', 'Manager'),
('2', 'Cashier'),
('3', 'Purchasing Clerk'),
('4', 'Inventory Clerk'),
('5', 'Staff');

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `sp_id` int(2) NOT NULL,
  `sp_fname` varchar(20) NOT NULL,
  `sp_lname` varchar(20) NOT NULL,
  `sp_companyname` varchar(20) NOT NULL,
  `sp_pno` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supply`
--

CREATE TABLE `supply` (
  `sply_id` smallint(6) NOT NULL,
  `sply_spid` int(2) NOT NULL,
  `sply_mdid` mediumint(9) NOT NULL,
  `sply_quantity` smallint(3) NOT NULL,
  `sply_datetime` datetime NOT NULL,
  `sply_expiredate` date NOT NULL,
  `sply_stockid` smallint(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `unit`
--

CREATE TABLE `unit` (
  `unit_id` tinyint(1) NOT NULL,
  `unit_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `unit`
--

INSERT INTO `unit` (`unit_id`, `unit_name`) VALUES
(1, 'Tablet'),
(2, 'Capsule'),
(3, 'Bottle'),
(4, 'Repositories'),
(5, 'Catridges');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` tinyint(2) NOT NULL,
  `user_fname` varchar(20) NOT NULL,
  `user_lname` varchar(20) NOT NULL,
  `user_role_id` varchar(20) NOT NULL,
  `user_nic` varchar(12) NOT NULL,
  `user_pno` int(15) NOT NULL,
  `user_password` varchar(20) NOT NULL,
  `user_username` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_fname`, `user_lname`, `user_role_id`, `user_nic`, `user_pno`, `user_password`, `user_username`) VALUES
(1, 'Theekshana', 'Fernando', '1', '200031702568', 718976568, '123', 'theekshana');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`inv_id`),
  ADD KEY `fk_invoice_user` (`inv_userid`);

--
-- Indexes for table `invoicemedicine`
--
ALTER TABLE `invoicemedicine`
  ADD PRIMARY KEY (`invmd_id`),
  ADD KEY `fk_invoicemedicine_mdid` (`invmd_mdid`),
  ADD KEY `fk_invoicemedicine_invid` (`invmd_invid`);

--
-- Indexes for table `medicine`
--
ALTER TABLE `medicine`
  ADD PRIMARY KEY (`medicine_id`),
  ADD KEY `fk_md_unitid` (`medicine_unitid`),
  ADD KEY `fk_md_catid` (`medicine_categoryid`);

--
-- Indexes for table `medicinecategory`
--
ALTER TABLE `medicinecategory`
  ADD PRIMARY KEY (`mdct_id`);

--
-- Indexes for table `ordermedicine`
--
ALTER TABLE `ordermedicine`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `fk_ordermedicine_mdid` (`odmd_mdid`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`sp_id`);

--
-- Indexes for table `supply`
--
ALTER TABLE `supply`
  ADD PRIMARY KEY (`sply_id`);

--
-- Indexes for table `unit`
--
ALTER TABLE `unit`
  ADD PRIMARY KEY (`unit_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `fk_user_role` (`user_role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `medicine`
--
ALTER TABLE `medicine`
  MODIFY `medicine_id` mediumint(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `medicinecategory`
--
ALTER TABLE `medicinecategory`
  MODIFY `mdct_id` tinyint(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `sp_id` int(2) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supply`
--
ALTER TABLE `supply`
  MODIFY `sply_id` smallint(6) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `unit`
--
ALTER TABLE `unit`
  MODIFY `unit_id` tinyint(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` tinyint(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `fk_invoice_user` FOREIGN KEY (`inv_userid`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `invoicemedicine`
--
ALTER TABLE `invoicemedicine`
  ADD CONSTRAINT `fk_invoicemedicine_invid` FOREIGN KEY (`invmd_invid`) REFERENCES `invoice` (`inv_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_invoicemedicine_mdid` FOREIGN KEY (`invmd_mdid`) REFERENCES `medicine` (`medicine_id`) ON UPDATE CASCADE;

--
-- Constraints for table `medicine`
--
ALTER TABLE `medicine`
  ADD CONSTRAINT `fk_md_catid` FOREIGN KEY (`medicine_categoryid`) REFERENCES `medicinecategory` (`mdct_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_md_unitid` FOREIGN KEY (`medicine_unitid`) REFERENCES `unit` (`unit_id`) ON UPDATE CASCADE;

--
-- Constraints for table `ordermedicine`
--
ALTER TABLE `ordermedicine`
  ADD CONSTRAINT `fk_ordermedicine_mdid` FOREIGN KEY (`odmd_mdid`) REFERENCES `medicine` (`medicine_id`) ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`user_role_id`) REFERENCES `role` (`role_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
