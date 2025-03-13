export default class Mairie extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "Mairie" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("Phaser_TileSetM", "src/assets/TileSet_VF.png");
    this.load.tilemapTiledJSON("carteMairie", "src/assets/mairie.json");

    //Création PNJ
    this.load.image("img_Maire", "src/assets/PNG/Maire.png");
    this.load.image("PNJ1", "src/assets/PNG/PNJ1.png");
    this.load.image("PNJ2", "src/assets/PNG/PNJ2.png");
    this.load.image("PNJ3", "src/assets/PNG/PNJ3.png");

    //Création porte Exit
    this.load.image("PorteExit", "src/assets/PorteExit3.png");

    //Image Quetes
    this.load.image("questImage5", "src/assets/Quete/Quete5.png"); // Image de la quête 5
    this.load.image("contImage1", "src/assets/Quete/Continue1.png"); // Bouton Continue 1

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

    /*************************************
     *  CREATION DU MONDE  *
     *************************************/
    const CarteMairie = this.add.tilemap("carteMairie");

    // chargement du jeu de tuiles
    const tileset = CarteMairie.addTilesetImage(
      "TileSet_VF",
      "Phaser_TileSetM"
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
    this.player = this.physics.add.sprite(320, 600, "img_perso");
    this.player.setBounce(0.2); // on donne un petit coefficient de rebond
    this.player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde

    /***********************
     *  CREATION DES PNJ *
     ************************/

    this.PNJ_Maire = this.physics.add.sprite(320, 360, "img_Maire");
    this.PNJ1 = this.physics.add.sprite(320, 120, "PNJ1");
    this.PNJ2 = this.physics.add.sprite(400, 500, "PNJ2");
    this.PNJ3 = this.physics.add.sprite(200, 400, "PNJ3");

    /*****************************************************
     *  GESTION DES INTERATIONS ENTRE  PERSO ET PNJ (Maire) *
     ******************************************************/

    // Création de l'image de quête, invisible par défaut
    this.questImage5 = this.add.image(320, 320, "questImage5").setVisible(false);
    this.contImage1 = this.add.image(320, 520, "contImage1").setVisible(false).setInteractive();


    this.contImage1.on("pointerdown", () => {
      this.hideQuestUI(this.questImage5, this.contImage1); // Cache l'interface
    });

    /*****************************************************
     *  GESTION DES INTERATIONS ENTRE  PERSO ET PORTE *
     ******************************************************/

    this.porte_retour = this.physics.add.staticSprite(260, 622, "PorteExit");

    /***********************
     *  CREATION DU CLAVIER *
     ************************/
    // ceci permet de creer un clavier et de mapper des touches, connaitre l'état des touches
    this.clavier = this.input.keyboard.createCursorKeys();

    /*****************************************************
     *  GESTION DES INTERATIONS ENTRE  GROUPES ET ELEMENTS *
     ******************************************************/

    //  Collide the player and objects
    this.physics.add.collider(this.player, objects);
  }

  /***********************************************************************/
  /** FONCTION ShowQuestUI
  /***********************************************************************/
  showQuestUI(image, cont) {
    image.setVisible(true);
    cont.setVisible(true);
    cont.setInteractive(); // Active l'interactivité du bouton quand il apparaît
  }
  
  /***********************************************************************/
  /** FONCTION HideQuestUI 
  /***********************************************************************/
  hideQuestUI(image, cont) {
    image.setVisible(false);
    cont.setVisible(false);
    cont.disableInteractive(); // Désactive l'interactivité pour éviter les clics fantômes
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

    // Interaction avec le maire
    if (this.physics.overlap(this.player, this.PNJ_Maire)) {
      this.showQuestUI(this.questImage5, this.contImage1);
    }
    // Vérifie la distance entre le joueur et le PNJ_Maire
    const distanceMaire = Phaser.Math.Distance.Between(
      this.player.x, this.player.y,
      this.PNJ_Maire.x, this.PNJ_Maire.y
    );

    // Si le joueur est trop loin, on cache l'interface de quête
    if (distanceMaire > 30) { // Ajuste la valeur 100 selon la taille de ton monde
      this.hideQuestUI(this.questImage5, this.contImage1);
    }
    // Si aucune touche n'est pressée, jouer l'animation de repos
    if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
      this.player.anims.play("anim_repos");
    }

    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
      if (this.physics.overlap(this.player, this.porte_retour)) {
        this.scene.start("General");
      }
    }
  }
}