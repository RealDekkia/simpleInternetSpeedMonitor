CREATE DATABASE IF NOT EXISTS `internetspeed`;
USE `internetspeed`;

CREATE TABLE IF NOT EXISTS `log` (
`ID` int(10) PRIMARY KEY AUTO_INCREMENT,
  `measureTime` datetime NOT NULL,
  `ping` float(10,3) NOT NULL,
  `up` float(10,2) NOT NULL,
  `down` float(10,2) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=902 DEFAULT CHARSET=latin1;
