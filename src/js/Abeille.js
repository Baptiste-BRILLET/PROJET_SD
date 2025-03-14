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

  init() {
    this.pnj_active = false; // Réinitialisation de l'état de l'abeille
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
    this.player.refreshBody(); //Met à jours le body du joueur
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
    // Joue l'animation "fly" en boucle pour le PNJ
    this.pnj.anims.play("fly", true);

    // Par défaut, le PNJ est immobile (car il est enfermé dans la cage)
    this.pnj.setVelocity(0, 0);

    // Désactive la gravité pour éviter qu'il tombe
    this.pnj.body.allowGravity = false;

    // Initialise une variable pour indiquer si le PNJ est actif/libéré ou non
    this.pnj_active = false;

    // Rend le PNJ immobile (ne réagit pas aux collisions)
    this.pnj.setImmovable(true);

    // (Redondance) Désactive encore la gravité (déjà fait plus haut)
    this.pnj.body.allowGravity = false;

    // Empêche le PNJ de sortir des limites du monde
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
    // Création de la plateforme mobile (img_cage) à une position initiale (2780, 170)
    this.plateforme_mobile = this.physics.add.sprite(2780, 170, "img_cage");

    // Désactive la gravité pour que la plateforme ne tombe pas
    this.plateforme_mobile.body.allowGravity = false;

    // Rend la plateforme immobile face aux autres objets (elle ne bougera que via les animations ou le code)
    this.plateforme_mobile.body.immovable = true;

    // Création d'une animation (tween) pour déplacer la plateforme
    this.tween_mouvement = this.tweens.add({
      targets: [this.plateforme_mobile], // L'élément à animer (la plateforme)
      paused: true, // L'animation est mise en pause au départ (elle ne démarre pas automatiquement)
      ease: "Linear", // Déplacement avec une vitesse constante (pas d'accélération ou de ralentissement)
      duration: 2000, // Temps que met la plateforme pour se déplacer (2 secondes)
      yoyo: false, // La plateforme ne fait pas d'aller-retour automatique
      y: "-=160", // Déplacement de 160 pixels vers le haut
      hold: 1000, // Temps d'attente de 1 seconde une fois arrivé à destination
      repeatDelay: 1000, // Temps d'attente avant qu'un autre cycle de répétition commence
      repeat: 0 // Nombre de répétitions (0 = une seule exécution)
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
    // Ajoute une collision entre le PNJ et les objets du monde
    this.physics.add.collider(this.pnj, objects);

    // Ajoute une collision entre la plateforme mobile et les objets du monde
    this.physics.add.collider(this.plateforme_mobile, objects);

    // Ajoute une collision entre le PNJ et la plateforme mobile
    this.physics.add.collider(this.pnj, this.plateforme_mobile);

    /****************************
    *  EVENEMENT DE LIBERATION  *
    ****************************/
    // Ajoute une détection de chevauchement entre le PNJ et la plateforme mobile
    this.physics.add.overlap(this.pnj, this.plateforme_mobile, () => {
      // Vérifie si la plateforme mobile n'est pas touchée par le bas (c'est-à-dire que le PNJ n'est pas debout dessus)
      if (!this.plateforme_mobile.body.touching.down) {
        this.pnj.setImmovable(false); // Rend le PNJ mobile
        this.pnj.body.allowGravity = true; // Active la gravité pour le PNJ
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

    // Vérifie si le PNJ est inactif et s'il ne chevauche pas la plateforme mobile
    if (!this.pnj_active && !this.physics.overlap(this.pnj, this.plateforme_mobile)) {
      this.pnj_active = true; // Active le PNJ s'il est inactif et hors de la plateforme
    }

    // Si le PNJ est actif, il commence à suivre le joueur
    if (this.pnj_active) {
      // Calcul de la distance entre le PNJ et le joueur
      let distance = Phaser.Math.Distance.Between(this.pnj.x, this.pnj.y, this.player.x, this.player.y);

      // Détermine la vitesse horizontale du PNJ en fonction de la distance au joueur
      // Si la distance est grande (> 100px), il accélère, sinon il ralentit pour un suivi plus fluide
      let vitesseX = distance > 100 ? (this.player.x - this.pnj.x) * 0.2 : (this.player.x - this.pnj.x) * 0.05;

      // Applique la vitesse horizontale calculée au PNJ
      this.pnj.setVelocityX(vitesseX);

      // Applique un léger mouvement vertical sinusoïdal pour donner un effet de flottement
      this.pnj.setVelocityY(Math.sin(this.time.now / 200) * 30);

      // Change l'orientation du sprite du PNJ pour toujours regarder vers le joueur
      this.player.x > this.pnj.x ? this.pnj.resetFlip() : this.pnj.setFlipX(true);
    }

    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
      if (this.physics.overlap(this.player, this.porte_retour)) {
        this.game.config.fromPeche = true;
        this.game.config.x = 1600;
        this.game.config.y = 1600;
        this.scene.start("General");
      }
    }
  }
}