# Docker Compose の開発/テスト DB で利用する
CREATE DATABASE IF NOT EXISTS `digimon`;

CREATE USER 'app'@'%' IDENTIFIED BY 'app';
GRANT ALL ON `digimon`.* TO 'app'@'%';
