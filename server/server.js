
  const express = require('express'); 
  const cors = require('cors'); 
  const app = express(); 
  const jwt = require('jsonwebtoken');
  const session = require('express-session');
  const bcrypt = require('bcryptjs');
  const mariadb = require('mariadb');
  const swaggerJsdoc = require('swagger-jsdoc');
  const swaggerUi = require('swagger-ui-express');


  const pool = mariadb.createPool({
    host: 'mariadb',
    user: 'ask',
    password: 'ask',
    database: 'cocagneBDD',
    port: 3306,
    connectionLimit: 10,
  });

  pool.getConnection()
    .then(conn => {
      console.log('Connexion réussie à la base de données!');
      conn.release();
    })
    .catch(err => {
      console.error('Erreur de connexion à la base de données:', err);
    });


  // Middleware pour activer CORS
  app.use(
    cors({
      origin: 'http://localhost:3000', 
      credentials: true, 
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Autoriser les méthodes nécessaires
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['set-cookie']
    })
  );
  // Middleware pour parser les requêtes JSON
  app.use(express.json());
  app.use(
    session({
      secret: 'secret-key',
      resave: false,
      saveUninitialized: true,
    })
  );


  app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur backend!');
  });


  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Documentation API Node.js - Jardin de cocagne',
        version: '1.0.0',
        description: 'Documentation générée avec Swagger',
      },
      servers: [
        {
          url: 'http://localhost:4000',
        },
      ],
    },
    apis: ['./server.js'], // Path vers les annotations des routes
  };

  const swaggerSpecs = swaggerJsdoc(swaggerOptions);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


  /**
   * @swagger
   * /database:
   *   get:
   *     summary: Récupère la liste des bases de données
   *     description: Cette route renvoie la liste des bases de données disponibles sur le serveur.
   *     responses:
   *       200:
   *         description: Une liste de bases de données
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: string
   *       500:
   *         description: Erreur lors de la récupération des bases de données
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Erreur lors de la récupération des bases de données.
   */
  app.get('/database', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const databases = await conn.query('SHOW DATABASES');
      conn.release();
      res.json(databases);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des bases de données.' });
    }
  });




  app.get('/adherents/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const conn = await pool.getConnection();
      const adherent = await conn.query(
        `SELECT a.Id_adherent, a.email, a.name, a.Telephone,
                adr.Rue, adr.Code_Postal, adr.Ville 
        FROM Adherent a 
        LEFT JOIN Adresse adr ON a.Id_adherent = adr.ID_Adherent 
        WHERE a.Id_adherent = ?`,
        [id]
      );
      conn.release();

      if (adherent.length === 0) {
        return res.status(404).json({ error: 'Adhérent non trouvé.' });
      }

      res.status(200).json(adherent[0]);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adhérent :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'adhérent.' });
    }
  });


  //CONNEXION MODE

  // register 
  /**
   * @swagger
   * /register:
   *   post:
   *     summary: Inscription d'un utilisateur
   *     description: Permet à un utilisateur de s'inscrire.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               name:
   *                 type: string
   *     responses:
   *       201:
   *         description: Inscription réussie.
   *       400:
   *         description: Champs manquants ou incorrects.
   *       500:
   *         description: Erreur serveur.
   */
  app.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' });
    }
    try {
      const result = await pool.query('SELECT * FROM Adherent WHERE email = ?', [email]);
      if (result && result.length > 0) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query('INSERT INTO Adherent (email, password, name) VALUES (?, ?, ?)', [
        email,
        hashedPassword,
        name,
      ]);
      res.status(201).json({ message: 'Inscription réussie !' });
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  });

  // login 
  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Connexion d'un utilisateur
   *     description: Permet à un utilisateur de se connecter.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               rememberMe:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Connexion réussie.
   *       400:
   *         description: Identifiants incorrects.
   *       500:
   *         description: Erreur serveur.
   */
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }

    try {
      const result = await pool.query('SELECT * FROM Adherent WHERE email = ?', [email]);

      if (!result || result.length === 0) {
        return res.status(400).json({ error: 'Utilisateur non trouvé.' });
      }

      const user = result[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Mot de passe incorrect.' });
      }

      // Retourner les informations essentielles de l'utilisateur
      res.json({ user: { id: user.Id_adherent, email: user.email, name: user.name } });
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  });




  /**
   * @swagger
   * /depots:
   *   get:
   *     summary: Liste des dépôts
   *     description: Renvoie tous les dépôts disponibles.
   *     responses:
   *       200:
   *         description: Liste des dépôts.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *       500:
   *         description: Erreur serveur.
   */
  app.get('/depots', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const depots = await conn.query('SELECT * FROM Point_Depot');
      conn.release();
      res.status(200).json(depots);
    } catch (error) {
      console.error('Erreur lors de la récupération des dépôts :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des dépôts.' });
    }
  });

  // creer tournee 
  app.post('/tours', async (req, res) => {
    const { jourPreparation, jourLivraison, etatTournee, parcours } = req.body;
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO Tournee (Jour_Preparation, Jour_Livraison, Etat_Tournee, Parcours) VALUES (?, ?, ?, ?)',
        [jourPreparation, jourLivraison, etatTournee, parcours]
      );
      conn.release();
      res.status(201).json({ message: 'Tournée créée avec succès.', id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la création de la tournée.' });
    }
  });

  /**
   * @swagger
   * /tours:
   *   get:
   *     summary: Liste des tournées
   *     description: Renvoie toutes les tournées disponibles.
   *     responses:
   *       200:
   *         description: Liste des tournées.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *       500:
   *         description: Erreur serveur.
   */
  app.get('/tours', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const tours = await conn.query('SELECT * FROM Tournee');
      conn.release();
      res.json(tours);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des tournées.' });
    }
  });


  /**
   * @swagger
   * /tours/{id}:
   *   get:
   *     summary: Récupérer les détails d'une tournée spécifique
   *     description: Renvoie les informations d'une tournée ainsi que les points associés, triés par ordre.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID de la tournée à récupérer.
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Détails de la tournée et liste des points.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 tournee:
   *                   type: object
   *                   description: Informations sur la tournée.
   *                   properties:
   *                     ID_Tournee:
   *                       type: integer
   *                     Jour_Preparation:
   *                       type: string
   *                       format: date
   *                     Jour_Livraison:
   *                       type: string
   *                       format: date
   *                     Etat_Tournee:
   *                       type: string
   *                     Parcours:
   *                       type: string
   *                 points:
   *                   type: array
   *                   description: Liste des points associés à la tournée.
   *                   items:
   *                     type: object
   *                     properties:
   *                       ID_Point_Depot:
   *                         type: integer
   *                       Nom:
   *                         type: string
   *                       Adresse:
   *                         type: string
   *                       Latitude:
   *                         type: number
   *                       Longitude:
   *                         type: number
   *       404:
   *         description: Tournée non trouvée.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Tournée non trouvée.
   *       500:
   *         description: Erreur serveur.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Erreur lors de la récupération de la tournée.
   */

  app.get('/tours/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const conn = await pool.getConnection();
      const tournee = await conn.query('SELECT * FROM Tournee WHERE ID_Tournee = ?', [id]);

      if (!tournee.length) {
        conn.release();
        return res.status(404).json({ error: 'Tournée non trouvée.' });
      }

      const points = await conn.query(
        'SELECT pd.* FROM Tournee_Points tp JOIN Point_Depot pd ON tp.ID_Point_Depot = pd.ID_Point_Depot WHERE tp.ID_Tournee = ? ORDER BY tp.Ordre',
        [id]
      );
      conn.release();

      res.json({ tournee: tournee[0], points });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération de la tournée.' });
    }
  });


  app.post('/tours/:id/points', async (req, res) => {
    const { id } = req.params;
    const { pointId, ordre } = req.body;
    try {
      const conn = await pool.getConnection();
      await conn.query('INSERT INTO Tournee_Points (ID_Tournee, ID_Point_Depot, Ordre) VALUES (?, ?, ?)', [
        id,
        pointId,
        ordre,
      ]);
      conn.release();
      res.status(201).json({ message: 'Point ajouté à la tournée avec succès.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de l\'ajout du point à la tournée.' });
    }
  });



  /**
   * @swagger
   * /tours/{id}:
   *   put:
   *     summary: Mettre à jour une tournée
   *     description: Met à jour les informations d'une tournée spécifique, telles que l'état et le parcours.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID de la tournée à mettre à jour.
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               etatTournee:
   *                 type: string
   *                 description: Nouvel état de la tournée.
   *               parcours:
   *                 type: string
   *                 description: Nouveau parcours de la tournée.
   *     responses:
   *       200:
   *         description: Tournée mise à jour avec succès.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Tournée mise à jour avec succès.
   *       500:
   *         description: Erreur serveur.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Erreur lors de la mise à jour de la tournée.
   */

  app.put('/tours/:id', async (req, res) => {
    const { id } = req.params;
    const { etatTournee, parcours } = req.body;
    try {
      const conn = await pool.getConnection();
      await conn.query('UPDATE Tournee SET Etat_Tournee = ?, Parcours = ? WHERE ID_Tournee = ?', [
        etatTournee,
        parcours,
        id,
      ]);
      conn.release();
      res.status(200).json({ message: 'Tournée mise à jour avec succès.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la tournée.' });
    }
  });


  /**
   * @swagger
   * /tours/{id}/points/{pointId}:
   *   delete:
   *     summary: Supprimer un point d'une tournée
   *     description: Supprime un point spécifique associé à une tournée donnée.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID de la tournée.
   *         schema:
   *           type: integer
   *       - in: path
   *         name: pointId
   *         required: true
   *         description: ID du point à supprimer.
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Point supprimé avec succès.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Point supprimé de la tournée avec succès.
   *       500:
   *         description: Erreur serveur.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Erreur lors de la suppression du point de la tournée.
   */

  app.delete('/tours/:id/points/:pointId', async (req, res) => {
    const { id, pointId } = req.params;
    try {
      const conn = await pool.getConnection();
      await conn.query('DELETE FROM Tournee_Points WHERE ID_Tournee = ? AND ID_Point_Depot = ?', [id, pointId]);
      conn.release();
      res.status(200).json({ message: 'Point supprimé de la tournée avec succès.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la suppression du point de la tournée.' });
    }
  });


  /**
   * @swagger
   * /tours/{id}:
   *   delete:
   *     summary: Supprimer une tournée
   *     description: Supprime une tournée spécifique.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID de la tournée à supprimer.
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Tournée supprimée avec succès.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Tournée supprimée avec succès.
   *       500:
   *         description: Erreur serveur.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Erreur lors de la suppression de la tournée.
   */

  app.delete('/tours/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const conn = await pool.getConnection();
      await conn.query('DELETE FROM Tournee WHERE ID_Tournee = ?', [id]);
      conn.release();
      res.status(200).json({ message: 'Tournée supprimée avec succès.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la suppression de la tournée.' });
    }
  });

  // Démarrer le serveur sur le port 4000
  const PORT = 4000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });