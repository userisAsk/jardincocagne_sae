
# Application web | Jardin de cocagne

Nous développons une Application web complexe en React et Node.js


## Authors

- [@Kyriann](https://github.com/userisAsk/)
- [@Adame](https://github.com/ov3rc0me)



## Deployment

pour lancer le projet la première fois 

- démarré docker dekstop
- lancer la commande dans le terminal de votre projet
```bash
  docker compose up --build -d
```
se connecter sur le site : 
- mail : gestionnaire2@gmail.com
- mot de passe : dracofeu

se connecter sur phpmyadmin : 
- username : root
- mot de passe : root

parfois l'application web peut mettre du temps a recharger si vous voulez palier a ce problème 2 solutions :
- attendre et la page apparaitra ou relancer la page
- relancer docker
- refait la commande :
 ```bash
  docker compose up  -d
```

## Documentation
Documentation swagger pour y accéder soit vous pouvez cliquer sur le ien ci-dessous(local)

[Documentation](http://localhost:4000/api-docs)

ou pour y aller manuellement taper dans votre navigatueur  la commande suivante

```bash
  http://localhost:4000/api-docs
```

## lancement Test unitaire

pour lancer le projet la première fois 

- aller a la racine du projet
```bash
  npm test
```
si vous ne parvenez pas a lancer les tests il faut mettre cette commande  : 
```bash
npm install --save-dev identity-obj-proxy
```


