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
    this.load.image("img_levier", "src/assets/levier.png");
    this.load.image("img_TestBees", "src/assets/TestBees.png");
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

    /****************************
    *  CREATION DU PNJ EN PRISON *
    ****************************/
    this.pnj = this.physics.add.sprite(340, 270, "img_TestBees");
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
    this.plateforme_mobile = this.physics.add.sprite(340, 270, "img_cage");
    this.plateforme_mobile.body.allowGravity = false;
    this.plateforme_mobile.body.immovable = true;

    this.tween_mouvement = this.tweens.add({
      targets: [this.plateforme_mobile],
      paused: true,
      ease: "Linear",
      duration: 2000,
      yoyo: true,
      y: "-=300",
      hold: 1000,
      repeatDelay: 1000,
      repeat: -1
    });

     /****************************
    *  LEVIER POUR CONTROLER LA CAGE *
    ****************************/
     this.levier = this.physics.add.staticSprite(200, 270, "img_levier");
     this.levier.active = false;
 
     /****************************
     *  COLLISIONS *
     ****************************/
     this.physics.add.collider(this.player, objects);
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
   
  }

  update() {
    // Gestion du clavier
    this.clavier = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.Q, //Touche Q pour aller à gauche
      right: Phaser.Input.Keyboard.KeyCodes.D, //Touche D pour aller à droite
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      act: Phaser.Input.Keyboard.KeyCodes.A,
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

    if (this.keys.act.isDown) {
      if (this.physics.overlap(this.player, this.levier)) {
        if (this.levier.active == true) {
          this.levier.active = false; // on désactive le levier
          this.levier.flipX = false; // permet d'inverser l'image
          this.tween_mouvement.pause();  // on stoppe le tween
        }
        // sinon :  on l'active et stoppe la plateforme
        else {
          this.levier.active = true; // on active le levier 
          this.levier.flipX = true; // on tourne l'image du levier
          this.tween_mouvement.resume();  // on relance le tween
        }
      }
    }
  }
}