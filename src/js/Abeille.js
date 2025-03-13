export default class Abeille extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "Abeille" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("Phaser_TileSetV2", "src/assets/TileSet_VF2.png");
    this.load.tilemapTiledJSON("carteAbeille", "src/assets/Abeille.json");
  }

  create() {
    this.physics.world.gravity.y = 300;
    const CarteAbeille = this.add.tilemap("carteAbeille");
    // chargement du jeu de tuiles
    const tilesetV2 = CarteAbeille.addTilesetImage(
      "TileSet_VF2",
      "Phaser_TileSetV2"
    );
    // chargement de chaque calque
    const Fond = CarteAbeille.createLayer(
      "Fond",
      tilesetV2
    );
    const FondTere = CarteAbeille.createLayer(
      "FondTere",
      tilesetV2
    );
    const FondArbre = CarteAbeille.createLayer(
      "FondArbre",
      tilesetV2
    );
    const Foret = CarteAbeille.createLayer(
      "Foret",
      tilesetV2
    );
    const Trou = CarteAbeille.createLayer(
      "Trou",
      tilesetV2
    );
    const Plateforme = CarteAbeille.createLayer(
      "Plateforme",
      tilesetV2
    );
    const Arbre = CarteAbeille.createLayer(
      "Arbre",
      tilesetV2
    );

    // définition des tuiles de plateformes qui sont solides
    const objects = [Fond, FondTere, FondArbre, Foret, Trou, Plateforme, Arbre];
    objects.forEach(obj => obj.setCollisionByProperty({ estSolide: true }));

    /****************************
    *  RECUPERATION DU PERSONNAGE  *
    ****************************/

    // On récupère le personnage
    this.player = this.physics.add.sprite(100, 100, "img_perso");
    this.player.refreshBody();
    this.player.setBounce(0.2); // on donne un petit coefficient de rebond
    this.player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde
    
    /***********************
     *  CREATION DU CLAVIER *
     ************************/
    // ceci permet de creer un clavier et de mapper des touches, connaitre l'état des touches
    this.clavier = this.input.keyboard.createCursorKeys();

    /*****************************************************
     *  GESTION DES INTERATIONS ENTRE  GROUPES ET ELEMENTS *
     ******************************************************/

    //  Collide the player and the groupe_etoiles with the groupe_plateformes
    this.physics.add.collider(this.player, objects);

  }

  update() {
    // Gestion du clavier
    this.clavier = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.Q, //Touche Q pour aller à gauche
      right: Phaser.Input.Keyboard.KeyCodes.D, //Touche D pour aller à droite
      space: Phaser.Input.Keyboard.KeyCodes.A,
    });

    if (this.keys.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("anim_gauche", true);
    } else if (this.keys.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("anim_droite", true);
    } else {
      this.player.setVelocityX(0);
    }

    // Si aucune touche n'est pressée, jouer l'animation de repos
    if (this.player.body.velocity.x === 0) {
      this.player.anims.play("anim_repos");
    }

    if (this.keys.space.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-330);
    }

    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 3200, 640);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 3200, 640);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(this.player);


  }
}
