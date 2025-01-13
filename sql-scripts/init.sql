-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mariadb:3306
-- Généré le : sam. 11 jan. 2025 à 08:33
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
  `Frequence_Livraison` enum('hebdomadaire','mensuel','bimensuel') NOT NULL,
  `Duree` int(11) NOT NULL,
  `Calendrier_Livraison` text DEFAULT NULL,
  `ID_Adherent` int(11) NOT NULL,
  `ID_Tournee` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Abonnement`
--

INSERT INTO `Abonnement` (`ID_Abonnement`, `Type_Abonnement`, `Frequence_Livraison`, `Duree`, `Calendrier_Livraison`, `ID_Adherent`, `ID_Tournee`) VALUES
(1, 'Premium', 'hebdomadaire', 6, 'Chaque lundi', 1, 1),
(2, 'Standard', 'mensuel', 12, '1er du mois', 2, 2);

-- --------------------------------------------------------

--
-- Structure de la table `Adherent`
--

CREATE TABLE `Adherent` (
  `ID_Adherent` int(11) NOT NULL,
  `Nom` varchar(100) NOT NULL,
  `Prenom` varchar(100) NOT NULL,
  `Email` varchar(150) NOT NULL,
  `Telephone` varchar(15) DEFAULT NULL,
  `Adresse` text DEFAULT NULL,
  `Coordonnees_Bancaires` text DEFAULT NULL,
  `Role` varchar(50) DEFAULT NULL,
  `Historique` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Adherent`
--

INSERT INTO `Adherent` (`ID_Adherent`, `Nom`, `Prenom`, `Email`, `Telephone`, `Adresse`, `Coordonnees_Bancaires`, `Role`, `Historique`) VALUES
(1, 'Dupont', 'Jean', 'jean.dupont@example.com', '0123456789', '12 rue des Lilas, Paris', 'FR761234567890', 'client', 'Ancien adhérent'),
(2, 'Martin', 'Marie', 'marie.martin@example.com', '0987654321', '34 avenue des Champs, Lyon', 'FR761234567891', 'client', 'Nouveau adhérent');

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
  `ID_Adherent` int(11) NOT NULL,
  `ID_Point_Depot` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Commande`
--

INSERT INTO `Commande` (`ID_Commande`, `Date_Commande`, `Etat_Commande`, `Quantite`, `ID_Produit`, `ID_Adherent`, `ID_Point_Depot`) VALUES
(1, '2024-12-17', 'en préparation', 5, 1, 1, 1),
(2, '2024-12-18', 'livré', 2, 2, 2, 2);

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
  `Commentaires` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Point_Depot`
--

INSERT INTO `Point_Depot` (`ID_Point_Depot`, `Nom`, `Adresse`, `Latitude`, `Longitude`, `Responsable`, `Horaires_Ouverture`, `Commentaires`) VALUES
(1, 'Point A', '12 rue des Dépôts, Paris', 48.85660000, 2.35220000, 'M. Dupont', '8h-18h', 'Aucun commentaire'),
(2, 'Point B', '45 avenue de la Logistique, Lyon', 45.76400000, 4.83570000, 'Mme Martin', '9h-17h', 'Réception limitée le samedi'),
(8, 'Dépôt C', '20 boulevard Saint-Michel, Marseille', 43.29650000, 5.36980000, 'M. Durand', '7h-15h', 'Pas de stockage possible'),
(9, 'Dépôt D', '5 rue du Commerce, Lille', 50.62920000, 3.05730000, 'Mme Bernard', '10h-19h', 'Ouvert le samedi');

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
(1, '2024-12-20', '2024-12-21', 'en cours', 'Parcours A'),
(2, '2024-12-18', '2024-12-19', 'terminée', 'Parcours B'),
(3, '2025-01-10', '2025-01-11', 'en cours', 'Parcours Alpha'),
(4, '2025-01-12', '2025-01-13', 'terminée', 'Parcours Beta');

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
(4, 1, 1),
(4, 2, 2);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `auth_method` enum('google','manual') DEFAULT 'manual',
  `subscription_status` enum('active','inactive') DEFAULT 'inactive',
  `subscription_expiry` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `google_id`, `name`, `auth_method`, `subscription_status`, `subscription_expiry`, `created_at`, `admin`) VALUES
(1, 'ddd@gmail.com', '$2b$10$JWz7JelU2tng99CZRZKiu.BDh0weIgXgGFC/NfxEaczrYTbojFSCy', NULL, 'dddd', 'manual', 'inactive', NULL, '2024-12-20 13:57:17', 0),
(2, 'youtbue.lol@gmail.com', NULL, '116131400997092485320', 'Myyrai', 'google', 'inactive', NULL, '2024-12-20 13:59:25', 0),
(3, 'ask@gmail.com', '$2b$10$qYmjAxIR0shfSnhDd0GKEeWMsSB8YOotZu2Ef/d4x0wrYkNpSMFrG', NULL, 'ask', 'manual', 'inactive', NULL, '2024-12-20 14:05:12', 0),
(4, 'loli@gmail.com', '$2b$10$gHbKTIdWyrewmEQDESiB7OlZQbnTwvA2xdyw07jGOz8rY/ecX9Mj2', NULL, 'paille ', 'manual', 'inactive', NULL, '2024-12-20 17:41:10', 0),
(5, 'dqddd@gmaiL.com', '$2b$10$C9ZuOOCzcpR6B73SRmcU6.VWEMxSe8RhYTOi3mShGOaSjK398.NZ2', NULL, 'zouzou', 'manual', 'inactive', NULL, '2024-12-20 17:50:45', 0),
(6, 'dqdqddqd@gmail.com', '$2b$10$sNS8TdAI4zCBDV9eF/W4jOgjQKK8ZoJ0YTPwY/nDSruXAV79I7voG', NULL, 'ae', 'manual', 'inactive', NULL, '2024-12-20 18:09:15', 0),
(7, 'cc@gmail.com', '$2b$10$0p9U6cx9FAljw9N.3SR/Z.9dwVduWDbY8qANTK6SFVzySDK0hFUaS', NULL, 'coucouc', 'manual', 'inactive', NULL, '2024-12-20 18:24:27', 0),
(8, 'qdqdqd@gmail.com', '$2b$10$sb/znZ6UJKlMKHUdDDhev.xVWVRJZdkll1UH6k0pvTpknGt6PigFq', NULL, 'ask', 'manual', 'inactive', NULL, '2024-12-29 22:19:53', 0),
(9, 'kyriann.paille@gmail.com', NULL, '109385914937696005530', 'Kyriann PAILLE', 'google', 'inactive', NULL, '2024-12-30 00:19:22', 0),
(10, 'sss@gmail.com', '$2b$10$K3ql5L2rGvifY0uzvQvHz.a5d8UmNgNnNCAe7crBYyHxLbHFRYBvm', NULL, 'ask', 'manual', 'inactive', NULL, '2024-12-30 02:12:06', 1),
(11, 'zouzoudi22@gmail.com', NULL, '115832387124129687760', 'Zouzoudi', 'google', 'inactive', NULL, '2025-01-05 22:42:35', 0),
(12, 'kqdkdqkdkqd@gmail.com', '$2b$10$TOTPK/o8LbqEelD/SZBre.8VKnr29bqcQB8GZjqyx2OlykzhHSXsW', NULL, 'dqdqkd', 'manual', 'inactive', NULL, '2025-01-09 01:09:05', 0),
(13, 'dqjjdqjdq@gmail.com', '$2b$10$oQsrB7nAy/U4uMIKEum.m.p9YLzxQzpJFQCWJ9GHXsydFHJeem6OW', NULL, 'qkdqjk', 'manual', 'inactive', NULL, '2025-01-09 01:15:16', 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Abonnement`
--
ALTER TABLE `Abonnement`
  ADD PRIMARY KEY (`ID_Abonnement`),
  ADD KEY `ID_Adherent` (`ID_Adherent`),
  ADD KEY `ID_Tournee` (`ID_Tournee`);

--
-- Index pour la table `Adherent`
--
ALTER TABLE `Adherent`
  ADD PRIMARY KEY (`ID_Adherent`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Index pour la table `Commande`
--
ALTER TABLE `Commande`
  ADD PRIMARY KEY (`ID_Commande`),
  ADD KEY `ID_Produit` (`ID_Produit`),
  ADD KEY `ID_Adherent` (`ID_Adherent`),
  ADD KEY `ID_Point_Depot` (`ID_Point_Depot`);

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
  ADD PRIMARY KEY (`ID_Point_Depot`),
  ADD UNIQUE KEY `Nom` (`Nom`);

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
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

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
  MODIFY `ID_Adherent` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Commande`
--
ALTER TABLE `Commande`
  MODIFY `ID_Commande` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Document`
--
ALTER TABLE `Document`
  MODIFY `ID_Document` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Point_Depot`
--
ALTER TABLE `Point_Depot`
  MODIFY `ID_Point_Depot` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Abonnement`
--
ALTER TABLE `Abonnement`
  ADD CONSTRAINT `Abonnement_ibfk_1` FOREIGN KEY (`ID_Adherent`) REFERENCES `Adherent` (`ID_Adherent`) ON DELETE CASCADE,
  ADD CONSTRAINT `Abonnement_ibfk_2` FOREIGN KEY (`ID_Tournee`) REFERENCES `Tournee` (`ID_Tournee`) ON DELETE SET NULL;

--
-- Contraintes pour la table `Commande`
--
ALTER TABLE `Commande`
  ADD CONSTRAINT `Commande_ibfk_1` FOREIGN KEY (`ID_Produit`) REFERENCES `Produit` (`ID_Produit`) ON DELETE CASCADE,
  ADD CONSTRAINT `Commande_ibfk_2` FOREIGN KEY (`ID_Adherent`) REFERENCES `Adherent` (`ID_Adherent`) ON DELETE CASCADE,
  ADD CONSTRAINT `Commande_ibfk_3` FOREIGN KEY (`ID_Point_Depot`) REFERENCES `Point_Depot` (`ID_Point_Depot`);

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
