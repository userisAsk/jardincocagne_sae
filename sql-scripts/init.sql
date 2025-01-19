-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mariadb:3306
-- Généré le : dim. 19 jan. 2025 à 11:36
-- Version du serveur : 10.9.8-MariaDB-1:10.9.8+maria~ubu2204
-- Version de PHP : 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `cocagneBDD`
--

-- --------------------------------------------------------

--
-- Structure de la table `Abonnement`
--

CREATE TABLE `Abonnement` (
  `ID_Abonnement` int(11) NOT NULL,
  `Type_Abonnement` varchar(100) NOT NULL,
  `Frequence_Livraison` enum('hebdomadaire','bimensuel') NOT NULL,
  `Duree` int(11) NOT NULL,
  `Calendrier_Livraison` text DEFAULT NULL,
  `ID_Adherent` int(11) NOT NULL,
  `ID_Tournee` int(11) DEFAULT NULL,
  `Type_Paiement` varchar(50) NOT NULL,
  `Frequence_Paiement` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Abonnement`
--

INSERT INTO `Abonnement` (`ID_Abonnement`, `Type_Abonnement`, `Frequence_Livraison`, `Duree`, `Calendrier_Livraison`, `ID_Adherent`, `ID_Tournee`, `Type_Paiement`, `Frequence_Paiement`) VALUES
(1, 'Premium', 'hebdomadaire', 6, 'Chaque lundi', 1, 1, '', ''),
(2, 'Standard', 'hebdomadaire', 12, '1er du mois', 2, 2, '', '');

-- --------------------------------------------------------

--
-- Structure de la table `Adherent`
--

CREATE TABLE `Adherent` (
  `Id_adherent` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `admin` tinyint(1) DEFAULT 0,
  `Telephone` varchar(15) DEFAULT NULL,
  `ID_Abonnement` int(11) DEFAULT NULL,
  `ID_Adresse` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Adherent`
--

INSERT INTO `Adherent` (`Id_adherent`, `email`, `password`, `name`, `created_at`, `admin`, `Telephone`, `ID_Abonnement`, `ID_Adresse`) VALUES
(1, 'ddd@gmail.com', '$2b$10$JWz7JelU2tng99CZRZKiu.BDh0weIgXgGFC/NfxEaczrYTbojFSCy', 'dddd', '2024-12-20 13:57:17', 0, NULL, NULL, NULL),
(2, 'youtbue.lol@gmail.com', NULL, 'Myyrai', '2024-12-20 13:59:25', 0, NULL, NULL, NULL),
(3, 'ask@gmail.com', '$2b$10$qYmjAxIR0shfSnhDd0GKEeWMsSB8YOotZu2Ef/d4x0wrYkNpSMFrG', 'ask', '2024-12-20 14:05:12', 0, NULL, NULL, NULL),
(4, 'loli@gmail.com', '$2b$10$gHbKTIdWyrewmEQDESiB7OlZQbnTwvA2xdyw07jGOz8rY/ecX9Mj2', 'paille ', '2024-12-20 17:41:10', 0, NULL, NULL, NULL),
(5, 'dqddd@gmaiL.com', '$2b$10$C9ZuOOCzcpR6B73SRmcU6.VWEMxSe8RhYTOi3mShGOaSjK398.NZ2', 'zouzou', '2024-12-20 17:50:45', 0, NULL, NULL, NULL),
(6, 'dqdqddqd@gmail.com', '$2b$10$sNS8TdAI4zCBDV9eF/W4jOgjQKK8ZoJ0YTPwY/nDSruXAV79I7voG', 'ae', '2024-12-20 18:09:15', 0, NULL, NULL, NULL),
(7, 'cc@gmail.com', '$2b$10$0p9U6cx9FAljw9N.3SR/Z.9dwVduWDbY8qANTK6SFVzySDK0hFUaS', 'coucouc', '2024-12-20 18:24:27', 0, NULL, NULL, NULL),
(8, 'qdqdqd@gmail.com', '$2b$10$sb/znZ6UJKlMKHUdDDhev.xVWVRJZdkll1UH6k0pvTpknGt6PigFq', 'ask', '2024-12-29 22:19:53', 0, NULL, NULL, NULL),
(9, 'kyriann.paille@gmail.com', NULL, 'Kyriann PAILLE', '2024-12-30 00:19:22', 0, NULL, NULL, NULL),
(10, 'sss@gmail.com', '$2b$10$K3ql5L2rGvifY0uzvQvHz.a5d8UmNgNnNCAe7crBYyHxLbHFRYBvm', 'ask', '2024-12-30 02:12:06', 1, NULL, NULL, NULL),
(11, 'zouzoudi22@gmail.com', NULL, 'Zouzoudi', '2025-01-05 22:42:35', 0, NULL, NULL, NULL),
(12, 'kqdkdqkdkqd@gmail.com', '$2b$10$TOTPK/o8LbqEelD/SZBre.8VKnr29bqcQB8GZjqyx2OlykzhHSXsW', 'dqdqkd', '2025-01-09 01:09:05', 0, NULL, NULL, NULL),
(13, 'dqjjdqjdq@gmail.com', '$2b$10$oQsrB7nAy/U4uMIKEum.m.p9YLzxQzpJFQCWJ9GHXsydFHJeem6OW', 'qkdqjk', '2025-01-09 01:15:16', 0, NULL, NULL, NULL),
(14, 'rodriguez@gmail.com', '$2a$10$2dounwUu67xwIBaW5U2UMe22cmmay9O2YZ3U6Dk7j.p5Ssx6w8mXW', 'alexis', '2025-01-13 00:10:12', 0, '0645237688', NULL, 1);

-- --------------------------------------------------------

--
-- Structure de la table `Adresse`
--

CREATE TABLE `Adresse` (
  `ID_Adresse` int(11) NOT NULL,
  `Rue` varchar(255) NOT NULL,
  `Code_Postal` varchar(10) NOT NULL,
  `Ville` varchar(100) NOT NULL,
  `ID_Adherent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Adresse`
--

INSERT INTO `Adresse` (`ID_Adresse`, `Rue`, `Code_Postal`, `Ville`, `ID_Adherent`) VALUES
(1, '10 Rue des Lilas', '75001', 'Paris', 14);

-- --------------------------------------------------------

--
-- Structure de la table `Commande`
--

CREATE TABLE `Commande` (
  `ID_Commande` int(11) NOT NULL,
  `Date_Commande` date NOT NULL,
  `Etat_Commande` enum('en préparation','livré','annulé') NOT NULL,
  `Quantite` int(11) NOT NULL CHECK (`Quantite` > 0),
  `ID_Produit` int(11) NOT NULL,
  `ID_Point_Depot` int(11) NOT NULL,
  `ID_Adherent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Commande`
--

INSERT INTO `Commande` (`ID_Commande`, `Date_Commande`, `Etat_Commande`, `Quantite`, `ID_Produit`, `ID_Point_Depot`, `ID_Adherent`) VALUES
(1, '2024-12-17', 'en préparation', 5, 1, 1, 1),
(2, '2024-12-18', 'livré', 2, 2, 2, 2);

-- --------------------------------------------------------

--
-- Structure de la table `DeliverySchedule`
--

CREATE TABLE `DeliverySchedule` (
  `ScheduleID` int(11) NOT NULL,
  `TourID` int(11) NOT NULL,
  `DeliveryDate` date NOT NULL,
  `Frequency` enum('Hebdomadaire','Bimensuel') NOT NULL,
  `IsHoliday` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `DeliverySchedule`
--

INSERT INTO `DeliverySchedule` (`ScheduleID`, `TourID`, `DeliveryDate`, `Frequency`, `IsHoliday`) VALUES
(1, 1, '2025-01-20', 'Hebdomadaire', 0),
(2, 2, '2025-01-20', 'Hebdomadaire', 0),
(6, 1, '2025-01-15', 'Hebdomadaire', 0);

-- --------------------------------------------------------

--
-- Structure de la table `Document`
--

CREATE TABLE `Document` (
  `ID_Document` int(11) NOT NULL,
  `Type_Document` enum('feuille de préparation','étiquette panier','feuille de route') NOT NULL,
  `Contenu` text DEFAULT NULL,
  `Date_Generation` date NOT NULL,
  `ID_Tournee` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Document`
--

INSERT INTO `Document` (`ID_Document`, `Type_Document`, `Contenu`, `Date_Generation`, `ID_Tournee`) VALUES
(1, 'feuille de préparation', 'Contenu de la feuille 1', '2024-12-20', 1),
(2, 'étiquette panier', 'Contenu de la feuille 2', '2024-12-18', 2);

-- --------------------------------------------------------

--
-- Structure de la table `Point_Depot`
--

CREATE TABLE `Point_Depot` (
  `ID_Point_Depot` int(11) NOT NULL,
  `Nom` varchar(100) NOT NULL,
  `Adresse` text NOT NULL,
  `Latitude` decimal(10,8) NOT NULL,
  `Longitude` decimal(11,8) NOT NULL,
  `Responsable` varchar(100) DEFAULT NULL,
  `Horaires_Ouverture` text DEFAULT NULL,
  `Commentaires` text DEFAULT NULL,
  `Jour_Disponibilite` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Point_Depot`
--

INSERT INTO `Point_Depot` (`ID_Point_Depot`, `Nom`, `Adresse`, `Latitude`, `Longitude`, `Responsable`, `Horaires_Ouverture`, `Commentaires`, `Jour_Disponibilite`) VALUES
(1, 'Point A', '12 rue des Dépôts, Paris', 48.85660000, 2.35220000, 'M. Dupont', '8h-18h', 'Aucun commentaire', NULL),
(2, 'Point B', '45 avenue de la Logistique, Lyon', 45.76400000, 4.83570000, 'Mme Martin', '9h-17h', 'Réception limitée le samedi', NULL),
(22, 'Épinal', 'Église Saint Antoine, 12 rue Armand Colle', 48.17326000, 6.44914000, 'Non spécifié', 'À partir de 15h - Armoires avec code', 'Aucun commentaire', 'Mardi, Mecredi ,Vendredi'),
(23, 'Épinal', 'Ligue de l\'enseignement, 15 rue Général de Reffye', 48.17389000, 6.45100000, 'Non spécifié', 'À partir de 15h - Armoires avec code', 'Aucun commentaire', 'Mardi, Mecredi ,Vendredi'),
(24, 'Épinal', 'Centre Léo LaGrange, 6 Avenue Salvador Allende', 48.17750000, 6.45390000, 'Non spécifié', 'À partir de 15h - Armoires avec code', 'Aucun commentaire', 'Mardi, Mecredi ,Vendredi'),
(25, 'Dinozé', 'APF - Local extérieur - ESAT, Rue de la papeterie', 48.16840000, 6.45530000, 'Non spécifié', 'À partir de 14h - Armoire libre', 'Aucun commentaire', 'Mardi'),
(26, 'Golbey', 'Ecodenn\'ergie, 36 bis rue de la Plaine', 48.18360000, 6.43010000, 'Non spécifié', 'À partir de 15h - Armoires avec code', 'Aucun commentaire', 'Mardi, Mercredi, Vendredi'),
(27, 'Golbey', 'Botanic, Avenue des Terres St Jean', 48.19070000, 6.42890000, 'Non spécifié', 'À partir de 15h - Ferme à 19h', 'Aucun commentaire', 'Mardi, Mercredi, Vendredi'),
(28, 'St Nabord', 'Pharmacie Robert, 24, rue du Gal de Gaulle', 48.01640000, 6.62060000, NULL, 'A partir de 15h - armoires avec code', NULL, NULL),
(29, 'Remiremont', 'Association AGACI, 26, Rue de la Joncherie', 48.01670000, 6.59690000, NULL, 'A partir de 15h - armoires avec code', NULL, NULL),
(30, 'Raon aux Bois', 'Mme Bedez, 7, Rue du Savron', 48.06910000, 6.59750000, NULL, 'A partir de 16h', NULL, 'Mercredi'),
(31, 'Docelles', 'Mr et Mme Boulassel, 1, rue Moncey', 48.11850000, 6.58690000, NULL, 'A partir de 16h30 - armoires avec code', NULL, 'Mercredi'),
(32, 'Thaon', 'Jardins de Cocagne, Prairie Claudel', 48.20780000, 6.44250000, NULL, 'De 9h à 18h', NULL, 'Mercredi'),
(33, 'Charmes', 'Complexe Sportif R. Simonin, Bvd Georges Clémenceau', 48.37880000, 6.03860000, NULL, 'A partir de 15h30 - armoires avec codes', NULL, NULL),
(34, 'Vincey', 'Résidence du Monsey, Ruelle du Monsey', 48.34470000, 6.34580000, NULL, 'A partir de 15h30 - armoires avec codes', NULL, NULL),
(35, 'Bruyères', 'Point Vert Mafra, Zac Barbazan', 48.21610000, 6.71950000, NULL, 'A partir de 11h - Ferme à 19h', NULL, 'Vendredi'),
(36, 'Bruyères', 'Brico Marché, 2 rue de Fraisne', 48.21590000, 6.72030000, NULL, 'A partir de 11h - armoires avec code', NULL, 'Vendredi'),
(37, 'Gérardmer', 'Pro et Cie, 45, Boulevard d\'Alsace', 48.07480000, 6.87930000, NULL, 'A partir de 11h - armoires avec code', NULL, 'Vendredi'),
(38, 'Le Tholy', 'M. Lecomte, 24, route du Noirpré', 48.08230000, 6.74830000, NULL, 'A partir de 11h', NULL, NULL),
(39, 'Les Forges', 'Mme. Adinolfi, 7, allée des Primevères', 48.17360000, 6.46090000, NULL, 'A partir de 11h', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `Produit`
--

CREATE TABLE `Produit` (
  `ID_Produit` int(11) NOT NULL,
  `Nom` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `Type` enum('alimentaire','non alimentaire') NOT NULL,
  `Prix` decimal(10,2) NOT NULL,
  `Unite` varchar(50) DEFAULT NULL,
  `Image` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Produit`
--

INSERT INTO `Produit` (`ID_Produit`, `Nom`, `Description`, `Type`, `Prix`, `Unite`, `Image`) VALUES
(1, 'Tomates Bio', 'Tomates issues de l\'agriculture biologique', 'alimentaire', 2.50, 'kg', 'tomates.jpg'),
(2, 'Savon Naturel', 'Savon fait main 100% naturel', 'non alimentaire', 5.00, 'unité', 'savon.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `Tournee`
--

CREATE TABLE `Tournee` (
  `ID_Tournee` int(11) NOT NULL,
  `Jour_Preparation` date NOT NULL,
  `Jour_Livraison` date NOT NULL,
  `Etat_Tournee` enum('en cours','terminée') NOT NULL,
  `Parcours` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Tournee`
--

INSERT INTO `Tournee` (`ID_Tournee`, `Jour_Preparation`, `Jour_Livraison`, `Etat_Tournee`, `Parcours`) VALUES
(1, '2024-12-20', '2025-12-02', 'en cours', 'Mardi'),
(2, '2024-12-18', '2025-01-15', 'terminée', 'Mercredi'),
(3, '2025-01-10', '2025-01-24', 'en cours', 'Vendredi');

-- --------------------------------------------------------

--
-- Structure de la table `Tournee_Points`
--

CREATE TABLE `Tournee_Points` (
  `ID_Tournee` int(11) NOT NULL,
  `ID_Point_Depot` int(11) NOT NULL,
  `Ordre` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Tournee_Points`
--

INSERT INTO `Tournee_Points` (`ID_Tournee`, `ID_Point_Depot`, `Ordre`) VALUES
(1, 1, 1),
(1, 22, 3),
(1, 24, 5),
(1, 25, 1),
(2, 2, 4),
(2, 35, 5),
(3, 1, 2),
(3, 2, 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Abonnement`
--
ALTER TABLE `Abonnement`
  ADD PRIMARY KEY (`ID_Abonnement`),
  ADD KEY `ID_Tournee` (`ID_Tournee`);

--
-- Index pour la table `Adherent`
--
ALTER TABLE `Adherent`
  ADD PRIMARY KEY (`Id_adherent`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `Adherent_ibfk_Abonnement` (`ID_Abonnement`),
  ADD KEY `FK_Adherent_Adresse` (`ID_Adresse`);

--
-- Index pour la table `Adresse`
--
ALTER TABLE `Adresse`
  ADD PRIMARY KEY (`ID_Adresse`),
  ADD KEY `ID_Adherent` (`ID_Adherent`);

--
-- Index pour la table `Commande`
--
ALTER TABLE `Commande`
  ADD PRIMARY KEY (`ID_Commande`),
  ADD KEY `ID_Produit` (`ID_Produit`),
  ADD KEY `ID_Point_Depot` (`ID_Point_Depot`),
  ADD KEY `Commande_ibfk_Adherent` (`ID_Adherent`);

--
-- Index pour la table `DeliverySchedule`
--
ALTER TABLE `DeliverySchedule`
  ADD PRIMARY KEY (`ScheduleID`),
  ADD KEY `TourID` (`TourID`);

--
-- Index pour la table `Document`
--
ALTER TABLE `Document`
  ADD PRIMARY KEY (`ID_Document`),
  ADD KEY `ID_Tournee` (`ID_Tournee`);

--
-- Index pour la table `Point_Depot`
--
ALTER TABLE `Point_Depot`
  ADD PRIMARY KEY (`ID_Point_Depot`);

--
-- Index pour la table `Produit`
--
ALTER TABLE `Produit`
  ADD PRIMARY KEY (`ID_Produit`),
  ADD UNIQUE KEY `Nom` (`Nom`);

--
-- Index pour la table `Tournee`
--
ALTER TABLE `Tournee`
  ADD PRIMARY KEY (`ID_Tournee`);

--
-- Index pour la table `Tournee_Points`
--
ALTER TABLE `Tournee_Points`
  ADD PRIMARY KEY (`ID_Tournee`,`ID_Point_Depot`),
  ADD KEY `ID_Point_Depot` (`ID_Point_Depot`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Abonnement`
--
ALTER TABLE `Abonnement`
  MODIFY `ID_Abonnement` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Adherent`
--
ALTER TABLE `Adherent`
  MODIFY `Id_adherent` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `Adresse`
--
ALTER TABLE `Adresse`
  MODIFY `ID_Adresse` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `Commande`
--
ALTER TABLE `Commande`
  MODIFY `ID_Commande` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `DeliverySchedule`
--
ALTER TABLE `DeliverySchedule`
  MODIFY `ScheduleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `Document`
--
ALTER TABLE `Document`
  MODIFY `ID_Document` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Point_Depot`
--
ALTER TABLE `Point_Depot`
  MODIFY `ID_Point_Depot` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT pour la table `Produit`
--
ALTER TABLE `Produit`
  MODIFY `ID_Produit` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Tournee`
--
ALTER TABLE `Tournee`
  MODIFY `ID_Tournee` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Abonnement`
--
ALTER TABLE `Abonnement`
  ADD CONSTRAINT `Abonnement_ibfk_2` FOREIGN KEY (`ID_Tournee`) REFERENCES `Tournee` (`ID_Tournee`) ON DELETE SET NULL;

--
-- Contraintes pour la table `Adherent`
--
ALTER TABLE `Adherent`
  ADD CONSTRAINT `Adherent_ibfk_Abonnement` FOREIGN KEY (`ID_Abonnement`) REFERENCES `Abonnement` (`ID_Abonnement`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_Adherent_Adresse` FOREIGN KEY (`ID_Adresse`) REFERENCES `Adresse` (`ID_Adresse`) ON DELETE SET NULL;

--
-- Contraintes pour la table `Adresse`
--
ALTER TABLE `Adresse`
  ADD CONSTRAINT `Adresse_ibfk_1` FOREIGN KEY (`ID_Adherent`) REFERENCES `Adherent` (`Id_adherent`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Commande`
--
ALTER TABLE `Commande`
  ADD CONSTRAINT `Commande_ibfk_1` FOREIGN KEY (`ID_Produit`) REFERENCES `Produit` (`ID_Produit`) ON DELETE CASCADE,
  ADD CONSTRAINT `Commande_ibfk_3` FOREIGN KEY (`ID_Point_Depot`) REFERENCES `Point_Depot` (`ID_Point_Depot`),
  ADD CONSTRAINT `Commande_ibfk_Adherent` FOREIGN KEY (`ID_Adherent`) REFERENCES `Adherent` (`Id_adherent`) ON DELETE CASCADE;

--
-- Contraintes pour la table `DeliverySchedule`
--
ALTER TABLE `DeliverySchedule`
  ADD CONSTRAINT `DeliverySchedule_ibfk_1` FOREIGN KEY (`TourID`) REFERENCES `Tournee` (`ID_Tournee`);

--
-- Contraintes pour la table `Document`
--
ALTER TABLE `Document`
  ADD CONSTRAINT `Document_ibfk_1` FOREIGN KEY (`ID_Tournee`) REFERENCES `Tournee` (`ID_Tournee`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Tournee_Points`
--
ALTER TABLE `Tournee_Points`
  ADD CONSTRAINT `Tournee_Points_ibfk_1` FOREIGN KEY (`ID_Tournee`) REFERENCES `Tournee` (`ID_Tournee`) ON DELETE CASCADE,
  ADD CONSTRAINT `Tournee_Points_ibfk_2` FOREIGN KEY (`ID_Point_Depot`) REFERENCES `Point_Depot` (`ID_Point_Depot`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_point_depot` FOREIGN KEY (`ID_Point_Depot`) REFERENCES `Point_Depot` (`ID_Point_Depot`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tournee` FOREIGN KEY (`ID_Tournee`) REFERENCES `Tournee` (`ID_Tournee`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
