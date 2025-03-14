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
    this.load.image("img_cage", "src/assets/Cage.png");
    this.load.image("img_cle", "src/assets/img_cle.png");
    this.load.image("img_TestBees", "src/assets/TestBees.png");
    this.load.image("img_PorteSortie", "src/assets/PorteExit4.png");


    this.load.spritesheet("img_bees", "src/assets/bees.png", {
      frameWidth: 16,  // Largeur d'un sprite
      frameHeight: 16 // Hauteur d'un sprite
    });
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
    this.player = this.physics.add.sprite(100, 235, "img_perso");
    this.player.setSize(16, 16); // Réduit la hitbox à 16x16
    this.player.setOffset(16, 16); // Ajuste si besoin pour centrer
    this.player.refreshBody();
    this.player.setBounce(0.2); // on donne un petit coefficient de rebond
    this.player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde


    /****************************
    *  CREATION DE L'ABEILLE EN PRISON *
    ****************************/

    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("img_bees", { frames: [0, 1, 2, 3, 4, 5, 6, 8, 9, 10] }),
      frameRate: 10, // Ajuste si besoin
      repeat: -1 // Animation infinie
    });

    this.pnj = this.physics.add.sprite(2780, 150, "img_bees");
    this.pnj.anims.play("fly", true);

    // Par défaut, elle ne bouge pas (bloquée dans la cage)
    this.pnj.setVelocity(0, 0);
    this.pnj.body.allowGravity = false; // Elle flotte
    this.pnj_active = false; // Indique si elle est libérée
    this.pnj.setImmovable(true);
    this.pnj.body.allowGravity = false;
    this.pnj.setCollideWorldBounds(true);

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

    /****************************
    *  CREATION DE LA CAGE MOBILE *
    ****************************/
    this.plateforme_mobile = this.physics.add.sprite(2780, 170, "img_cage");
    this.plateforme_mobile.body.allowGravity = false;
    this.plateforme_mobile.body.immovable = true;

    this.tween_mouvement = this.tweens.add({
      targets: [this.plateforme_mobile],
      paused: true,
      ease: "Linear",
      duration: 2000,
      yoyo: false,
      y: "-=160",
      hold: 1000,
      repeatDelay: 1000,
      repeat: 0
    });

    /****************************
   *  CLE POUR LEVER LA CAGE *
   ****************************/
    this.cle = this.physics.add.sprite(3055, 280, "img_cle");
    this.cle.body.allowGravity = false;
    this.physics.add.overlap(this.player, this.cle, this.collectCle, null, this);

    /****************************
    *  COLLISIONS *
    ****************************/
    this.physics.add.collider(this.pnj, objects);
    this.physics.add.collider(this.plateforme_mobile, objects);
    this.physics.add.collider(this.pnj, this.plateforme_mobile);

    /****************************
    *  EVENEMENT DE LIBERATION  *
    ****************************/
    this.physics.add.overlap(this.pnj, this.plateforme_mobile, () => {
      if (!this.plateforme_mobile.body.touching.down) {
        this.pnj.setImmovable(false);
        this.pnj.body.allowGravity = true;
      }
    });

  /*****************************************************
     *  AJOUT PORTE EXIT *
  ******************************************************/

  this.porte_retour = this.physics.add.staticSprite(3172, 290, "img_PorteSortie");

  }


  /****************************
    *  EVENEMENT DE LIBERATION  *
    ****************************/
  collectCle(player, cle) {
    cle.destroy();
    this.tween_mouvement.resume();
  }

  update() {
    // Gestion du clavier
    this.clavier = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.Q, //Touche Q pour aller à gauche
      right: Phaser.Input.Keyboard.KeyCodes.D, //Touche D pour aller à droite
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
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

    if (!this.pnj_active && !this.physics.overlap(this.pnj, this.plateforme_mobile)) {
      this.pnj_active = true;
    }

    if (this.pnj_active) {
      let distance = Phaser.Math.Distance.Between(this.pnj.x, this.pnj.y, this.player.x, this.player.y);
      let vitesseX = distance > 100 ? (this.player.x - this.pnj.x) * 0.2 : (this.player.x - this.pnj.x) * 0.05;
      this.pnj.setVelocityX(vitesseX);
      this.pnj.setVelocityY(Math.sin(this.time.now / 200) * 30);
      this.player.x > this.pnj.x ? this.pnj.resetFlip() : this.pnj.setFlipX(true);
    }

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