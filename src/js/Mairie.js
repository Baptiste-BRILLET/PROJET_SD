export default class Mairie extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "Mairie" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("Phaser_TileSet", "src/assets/TileSet_VF.png");
    this.load.tilemapTiledJSON("carteMairie", "src/assets/mairie.json");
  }

  /***********************************************************************/
  /** FONCTION CREATE
/***********************************************************************/

  /* La fonction create est appelée lors du lancement de la scene
   * si on relance la scene, elle sera appelée a nouveau
   * on y trouve toutes les instructions permettant de créer la scene
   * placement des peronnages, des sprites, des platesformes, création des animations
   * ainsi que toutes les instructions permettant de planifier des evenements
   */
  create() {
    //this.game.config.type.width = 600;
    //this.game.config.type.height = 600;
    /*************************************
     *  CREATION DU MONDE  *
     *************************************/
    const CarteMairie = this.add.tilemap("carteMairie");

    // chargement du jeu de tuiles
    const tileset = CarteMairie.addTilesetImage(
      "TileSet_VF",
      "Phaser_TileSet"
    );
    // chargement de chaque calque
    const plancher = CarteMairie.createLayer(
      "plancher",
      tileset
    );
    const mur = CarteMairie.createLayer(
      "mur",
      tileset
    );
    const mur2 = CarteMairie.createLayer(
      "mur2",
      tileset
    );
    const escalier = CarteMairie.createLayer(
      "escalier",
      tileset
    );
    const Calque_de_Tuiles_7 = CarteMairie.createLayer(
      "solsup",
      tileset
    );
    const escalier2 = CarteMairie.createLayer(
      "escalier2",
      tileset
    );
    const fenetre2 = CarteMairie.createLayer(
      "fenetre2",
      tileset
    );
    const tapis = CarteMairie.createLayer(
      "tapisbis",
      tileset
    );
    const meuble = CarteMairie.createLayer(
      "meuble",
      tileset
    );
    const tapis2 = CarteMairie.createLayer(
      "tapis",
      tileset
    );
    const objet = CarteMairie.createLayer(
      "objet",
      tileset
    );

    // définition des tuiles de plateformes qui sont solides

    const objects = [plancher, mur, mur2, escalier, Calque_de_Tuiles_7, escalier2, fenetre2, tapis, meuble, tapis2, objet];
    objects.forEach(obj => obj.setCollisionByProperty({ estSolide: true }));



    /****************************
     *  RECUPERATION DU PERSONNAGE  *
     ****************************/

    // On créée un nouveeau personnage : player
    this.player = this.physics.add.sprite(300, 400, "img_perso");
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

  /***********************************************************************/
  /** FONCTION UPDATE
/***********************************************************************/

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
  }
}