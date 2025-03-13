export default class Peche extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "Peche" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("Phaser_TileSet_Peche", "src/assets/TileSet_VF.png");
    this.load.tilemapTiledJSON("cartePeche", "src/assets/peche.json");

    //Création PNJ
    this.load.image("Pecheur", "src/assets/PNG/Pecheur.png");
    this.load.image("PNJ1", "src/assets/PNG/PNJ1.png");
    this.load.image("PNJ_5", "src/assets/PNG/PNJ_5.png");
    this.load.image("PNJ_6", "src/assets/PNG/PNJ_6.png");

    //Création img Rivière
    this.load.image("Poisson", "src/assets/Riviere/Poisson.png");
    this.load.image("Encre", "src/assets/Riviere/Encre.png");
    this.load.image("SacP", "src/assets/Riviere/SacP.png");
    this.load.image("Crabe", "src/assets/Riviere/Crabe.png");
    this.load.image("EtoileJ", "src/assets/Riviere/EtoileJ.png");
    this.load.image("EtoileR", "src/assets/Riviere/EtoileR.png");


    //Création porte Exit
    this.load.image("PorteExit2", "src/assets/PorteExit2.png");
  }


  create() {
    const CartePeche = this.add.tilemap("cartePeche");

    // chargement du jeu de tuiles
    const tileset = CartePeche.addTilesetImage(
      "TileSet_VF",
      "Phaser_TileSet_Peche"
    );
    // chargement de chaque calque
    const Fond = CartePeche.createLayer(
      "Fond",
      tileset
    );
    // chargement de chaque calque
    const Herbe = CartePeche.createLayer(
      "Herbe",
      tileset
    );
    // chargement de chaque calque
    const Accesoire = CartePeche.createLayer(
      "Accesoire",
      tileset
    );
    // chargement de chaque calque
    const Legume = CartePeche.createLayer(
      "Legume",
      tileset
    );
    const objects = [Fond, Herbe, Accesoire, Legume,];
    objects.forEach(obj => obj.setCollisionByProperty({ estSolide: true }));

    /****************************
     *  RECUPERATION DU PERSONNAGE  *
     ****************************/
    this.player = this.physics.add.sprite(320, 570, "img_perso");
    this.player.setBounce(0.2); // on donne un petit coefficient de rebond
    this.player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde
    this.player.setSize(16, 16);
    this.player.setOffset(16, 16);

    /***********************
     *  CREATION DES PNJ *
     ************************/

    this.Pecheur = this.physics.add.sprite(320, 240, "Pecheur");
    this.PNJ1 = this.physics.add.sprite(320, 120, "PNJ1");
    this.PNJ_5 = this.physics.add.sprite(140, 200, "PNJ_5");
    this.PNJ_6 = this.physics.add.sprite(100, 500, "PNJ_6");

    /*****************************************************
     *  GESTION DES INTERATIONS ENTRE  PERSO ET PORTE *
     ******************************************************/

    this.porte_retour = this.physics.add.staticSprite(320, 622, "PorteExit2");


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

    /***********************
     *  CREATION DE LA RIVIERE *
     ************************/

    this.objetsFlottants = this.physics.add.group();
    this.timer = this.time.addEvent({
      delay: 2000, // Crée un objet toutes les 2 secondes
      loop: true,
      callback: this.spawnFloatingObject,
      callbackScope: this
    });

  }

  spawnFloatingObject() {
    const objets = ["Poisson", "Encre","SacP","Crabe","EtoileJ","EtoileR"];
    const typeObjet = Phaser.Utils.Array.GetRandom(objets);

    // Position de départ à gauche de la rivière
    const yPosition = Phaser.Math.Between(245, 380); // Ajuste selon ta rivière
    const objet = this.objetsFlottants.create(-50, yPosition, typeObjet);

    objet.setVelocityX(50); // Déplacement vers la droite
    objet.setScale(0.5); // Ajuste la taille si nécessaire
  }

  update() {
    // Gestion du clavier
    this.clavier = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.Z, //Touche Z pour avancer
      down: Phaser.Input.Keyboard.KeyCodes.S, //Touche S pour reculer
      left: Phaser.Input.Keyboard.KeyCodes.Q, //Touche Q pour aller à gauche
      right: Phaser.Input.Keyboard.KeyCodes.D //Touche D pour aller à droite
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

    // Déplacement vertical
    if (this.keys.up.isDown) {
      this.player.setVelocityY(-160);
      this.player.anims.play("anim_dos", true);
    } else if (this.keys.down.isDown) {
      this.player.setVelocityY(160);
      this.player.anims.play("anim_face", true);
    } else {
      this.player.setVelocityY(0);
    }
    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 640, 640);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 640, 640);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(this.player);

    // Si aucune touche n'est pressée, jouer l'animation de repos
    if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
      this.player.anims.play("anim_repos");
    }

    // Supprime les objets qui dépassent X = 500
    this.objetsFlottants.getChildren().forEach((objet) => {
      if (objet.x > 550) {
        objet.destroy();
      }
    });

    // Ton code existant (déplacement du joueur, etc.)


    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
      if (this.physics.overlap(this.player, this.porte_retour)) {
        this.game.config.fromPeche=true;
        this.game.config.x = 1600;
        this.game.config.y = 1600;
        this.scene.start("General");
      }
    }
  }
}